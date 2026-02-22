import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

// --- Configuration ---
const RPC_URL = process.env.RPC_URL || "https://devnet.helius-rpc.com/?api-key=df9e7f13-259a-42be-af08-7cee2aacd36f";
const PROGRAM_ID = process.env.PROGRAM_ID || "GeA3JqAjAWBCoW3JVDbdTjEoxfUaSgtHuxiAeGG5PrUP";
const IDL_PATH = process.env.IDL_PATH || join(dirname(fileURLToPath(import.meta.url)), "beta-app/src/playcard/lib/timlg_protocol.json");
const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH || join(dirname(fileURLToPath(import.meta.url)), "firebase-credentials.json");
const DB_URL = process.env.DB_URL || "https://timlg-protocol-default-rtdb.firebaseio.com";
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || "60000"); // 60 seconds (optimized)

const OUTPUT_PATHS = [
    process.env.AUDIT_JSON_OUT_1,
    process.env.AUDIT_JSON_OUT_2
].filter(Boolean);

// --- Firebase Initialization ---
const serviceAccount = JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf8'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: DB_URL
});
const db = admin.database();

const connection = new Connection(RPC_URL, "confirmed");
const programPk = new PublicKey(PROGRAM_ID);
const IDL = JSON.parse(readFileSync(IDL_PATH, 'utf8'));

// Use Borsh Coder for manual decoding
const coder = new anchor.BorshAccountsCoder(IDL);

const toHex = (u8) => {
    if (!u8) return null;
    const arr = Array.from(new Uint8Array(u8));
    if (arr.every(b => b === 0)) return null;
    return arr.map(b => b.toString(16).padStart(2, '0')).join("");
};

// State to persist between cycles
let globalStats = null;
let roundArchive = {}; // round_id -> { tickets, reveals, wins, isFinal }
const MAX_ARCHIVE_SIZE = 5000;

async function runIndexer() {
    console.log(`[${new Date().toISOString()}] Starting Audit Indexing Cycle...`);

    try {
        // 1. Load initial state from Firebase if not already loaded
        if (!globalStats) {
            console.log("Loading initial state from Firebase...");
            const snapshot = await db.ref('audit_stats').once('value');
            const data = snapshot.val();
            if (data && data.dailyTickets !== undefined) {
                globalStats = {
                    dailyRounds: data.dailyRounds || 0,
                    dailyTickets: data.dailyTickets || 0,
                    dailyReveals: data.dailyReveals || 0,
                    dailyWins: data.dailyWins || 0,
                    totalPayouts: data.totalPayouts || 0,
                    totalBurned: data.totalBurned || 0,
                    processedIds: data.processedIds || []
                };
                roundArchive = data.archive || {};
                console.log(`Loaded archive with ${Object.keys(roundArchive).length} rounds.`);
            } else {
                console.log("No previous stats found. Starting from zero.");
                globalStats = { dailyRounds: 0, dailyTickets: 0, dailyReveals: 0, dailyWins: 0, totalPayouts: 0, totalBurned: 0, processedIds: [] };
            }
        }

        // 2. Get Registry, Config, etc.
        const [configPda] = PublicKey.findProgramAddressSync([Buffer.from("config_v3")], programPk);
        const [registryPda] = PublicKey.findProgramAddressSync([Buffer.from("round_registry_v3"), configPda.toBuffer()], programPk);
        const [tokenomicsPda] = PublicKey.findProgramAddressSync([Buffer.from("tokenomics_v3"), configPda.toBuffer()], programPk);
        const [treasurySolPda] = PublicKey.findProgramAddressSync([Buffer.from("treasury_sol_v3")], programPk);

        const [regInfo, configInfo, tokenomicsInfo, treasurySolInfo, currentSlot] = await Promise.all([
            connection.getAccountInfo(registryPda),
            connection.getAccountInfo(configPda),
            connection.getAccountInfo(tokenomicsPda),
            connection.getAccountInfo(treasurySolPda),
            connection.getSlot()
        ]);

        if (!regInfo || !configInfo) throw new Error("Registry or Config not found");

        const regData = coder.decode("RoundRegistry", regInfo.data);
        const configData = coder.decode("Config", configInfo.data);
        const tokData = tokenomicsInfo ? coder.decode("Tokenomics", tokenomicsInfo.data) : null;
        const adminPk = new PublicKey(configData.admin); // Force PublicKey object

        let rewardFeePoolBalance = 0;
        let rewardFeePoolAddress = null;
        if (tokenomicsInfo) {
            const [rewardFeePoolPda] = PublicKey.findProgramAddressSync([Buffer.from("reward_fee_pool_v3"), tokenomicsPda.toBuffer()], programPk);
            rewardFeePoolAddress = rewardFeePoolPda.toBase58();
            try {
                const bal = await connection.getTokenAccountBalance(rewardFeePoolPda);
                rewardFeePoolBalance = bal.value.uiAmount || 0;
            } catch (e) { }
        }

        // Oracle Replication Pool TIMLG
        let replicationPoolBalance = 0;
        let replicationPoolAddress = null;
        if (tokenomicsInfo) {
            const [replicationPoolPda] = PublicKey.findProgramAddressSync([Buffer.from("replication_pool_v3"), tokenomicsPda.toBuffer()], programPk);
            replicationPoolAddress = replicationPoolPda.toBase58();
            try {
                const bal = await connection.getTokenAccountBalance(replicationPoolPda);
                replicationPoolBalance = bal.value.uiAmount || 0;
            } catch (e) { }
        }

        // Protocol Treasury TIMLG (Swept unclaimed prizes)
        const [treasuryPda] = PublicKey.findProgramAddressSync([Buffer.from("treasury_v3")], programPk);
        let treasuryBalance = 0;
        try {
            const bal = await connection.getTokenAccountBalance(treasuryPda);
            treasuryBalance = bal.value.uiAmount || 0;
            console.log(`[VAULT] Recycling Vault: ${treasuryBalance} TIMLG`);
        } catch (e) {
            console.log(`[VAULT] Recycling Vault error: ${e.message}`);
        }

        // Operator Admin Wallet Balance (SOL Rent/Sweeps recovery)
        let operatorSolBalance = 0;
        try {
            const info = await connection.getAccountInfo(adminPk);
            operatorSolBalance = (info?.lamports || 0) / 1e9;
        } catch (e) { }

        console.log(`[VAULT] SOL Fees: ${(treasurySolInfo?.lamports || 0) / 1e9} SOL`);
        console.log(`[VAULT] SOL Operator: ${operatorSolBalance} SOL`);
        console.log(`[VAULT] TIMLG Reward Pool: ${rewardFeePoolBalance} TIMLG`);
        console.log(`[VAULT] TIMLG Recycling Vault: ${treasuryBalance} TIMLG`);

        const nextId = (regData.nextRoundId || regData.next_round_id).toNumber();
        const scanRange = 300;
        const recentRoundsLimit = 300; // Increased limit for UI feed
        const roundIds = Array.from({ length: scanRange }, (_, i) => nextId - 1 - i).filter(id => id >= 0);

        const currentCycleRecentRounds = [];
        const processedRounds = new Set();
        const stakeAmount = (configData.stakeAmount || configData.stake_amount).toNumber() / 1e9;
        const feeBps = tokData ? (tokData.rewardFeeBps || tokData.reward_fee_bps || 0) : 0;
        const feeMultiplier = 1 - (feeBps / 10000);

        if (roundIds.length > 0) {
            const BATCH_SIZE = 100;
            for (let i = 0; i < roundIds.length; i += BATCH_SIZE) {
                const batchIds = roundIds.slice(i, i + BATCH_SIZE);
                const pdas = batchIds.map(rid => {
                    const ridBuf = Buffer.alloc(8);
                    ridBuf.writeBigUInt64LE(BigInt(rid));
                    const [roundPda] = PublicKey.findProgramAddressSync([Buffer.from("round_v3"), ridBuf], programPk);
                    return roundPda;
                });

                const accounts = await connection.getMultipleAccountsInfo(pdas);
                for (let j = 0; j < accounts.length; j++) {
                    const info = accounts[j];
                    if (!info) continue;
                    try {
                        const decoded = coder.decode("Round", info.data);
                        const rIdStr = batchIds[j].toString();
                        const prev = roundArchive[rIdStr] || { tickets: 0, reveals: 0, wins: 0, isFinal: false, payouts: 0, pulseTx: null, sweepTx: null };
                        const r = {
                            id: batchIds[j],
                            state: decoded.state,
                            createdSlot: (decoded.createdSlot || decoded.created_slot).toNumber(),
                            pulsePublished: (decoded.pulsePublished || decoded.pulse_set),
                            swept: decoded.swept,
                            tickets: (decoded.committedCount || decoded.committed_count).toNumber(),
                            reveals: (decoded.revealedCount || decoded.revealed_count).toNumber(),
                            wins: (decoded.winCount || decoded.win_count).toNumber(),
                            explorerUrl: pdas[j] ? `https://explorer.solana.com/address/${pdas[j].toBase58()}?cluster=devnet` : null,
                            pulseUrl: decoded.pulse_id ? `https://beacon.nist.gov/beacon/2.0/pulse/current?pulseId=${decoded.pulse_id}` : (decoded.pulseId ? `https://beacon.nist.gov/beacon/2.0/pulse/current?pulseId=${decoded.pulseId}` : null),

                            // Enhanced Round Data (Matching Browser Export)
                            commitOpen: (decoded.createdSlot || decoded.created_slot).toNumber(),
                            commitClose: (decoded.commitDeadlineSlot || decoded.commit_deadline_slot).toNumber(),
                            pulseSlot: (decoded.pulseSetSlot || decoded.pulse_set_slot).toNumber(),
                            revealDeadline: (decoded.revealDeadlineSlot || decoded.reveal_deadline_slot).toNumber(),
                            finalizedAt: (decoded.finalizedSlot || decoded.finalized_slot).toNumber(),
                            settledAt: (decoded.tokenSettledSlot || decoded.token_settled_slot).toNumber(),
                            sweptAt: (decoded.sweptSlot || decoded.swept_slot).toNumber(),

                            pulseHash: toHex(decoded.pulse),
                            pulseId: (decoded.pulseIndexTarget || decoded.pulse_index_target).toNumber(),

                            // Transaction Signatures (Audit Trail)
                            pulseTx: prev.pulseTx || null,
                            settleTx: prev.settleTx || null,
                            sweepTx: prev.sweepTx || null
                        };

                        // Fetch missing signatures for recent active/finalized rounds
                        // ✅ Optimization: Skip if we already have the signatures in the archive
                        if (!r.pulseTx && r.pulsePublished && !prev.pulseTx) {
                            try {
                                const sigs = await connection.getSignaturesForAddress(pdas[j], { limit: 15 });
                                for (const s of sigs) {
                                    // Heuristic: Pulse is usually the first or second tx after round announcement
                                    if (!r.pulseTx) r.pulseTx = s.signature;
                                }
                            } catch (e) { }
                        } else if (prev.pulseTx) {
                            r.pulseTx = prev.pulseTx;
                        }

                        if (!r.settleTx && r.settledAt > 0 && !prev.settleTx) {
                            try {
                                const sigs = await connection.getSignaturesForAddress(pdas[j], { limit: 15 });
                                // Settle happens after pulse, look for a second/third unique signature
                                for (const s of sigs) {
                                    if (s.signature !== r.pulseTx && !r.settleTx) {
                                        r.settleTx = s.signature;
                                    }
                                }
                            } catch (e) { }
                        } else if (prev.settleTx) {
                            r.settleTx = prev.settleTx;
                        }

                        if (!r.sweepTx && r.sweptAt > 0 && !prev.sweepTx) {
                            try {
                                const sigs = await connection.getSignaturesForAddress(pdas[j], { limit: 5 });
                                // Sweep is typically the very last signature on the account
                                r.sweepTx = sigs[0]?.signature;
                            } catch (e) { }
                        } else if (prev.sweepTx) {
                            r.sweepTx = prev.sweepTx;
                        }

                        processedRounds.add(r.id);

                        // Deduplication for display list
                        if (!currentCycleRecentRounds.some(existing => existing.id === r.id)) {
                            currentCycleRecentRounds.push(r);
                        }


                        // INCREMENTAL STATS TRACKING
                        const isFinal = r.swept || (Object.keys(r.state)[0] === 'finished' || r.state === 3);

                        // Volume tracking (Daily Tickets/Reveals/Wins)
                        // Rules: We only count the DELTA between what we saw before and what we see now.
                        // This prevents losing data when a round is purged from the chain.
                        const ticketDelta = Math.max(0, r.tickets - prev.tickets);
                        const revealDelta = Math.max(0, r.reveals - prev.reveals);
                        const winDelta = Math.max(0, r.wins - prev.wins);

                        // Filter out pure "zombie" rounds from entering the persistent archive
                        const isWorthArchiving = r.tickets > 0 || r.pulsePublished;

                        if (isWorthArchiving && (ticketDelta > 0 || revealDelta > 0 || winDelta > 0 || (isFinal && !prev.isFinal))) {
                            globalStats.dailyTickets += ticketDelta;
                            globalStats.dailyReveals += revealDelta;
                            globalStats.dailyWins += winDelta;

                            // Rounds count and Payouts only once finalized
                            if (isFinal && !prev.isFinal) {
                                globalStats.dailyRounds++;
                                // Note: we calculate the payout based on TOTAL wins of the finalized round
                                // to ensure accuracy, minus any payout already recorded (if we somehow recorded partial wins)
                                const totalP = r.wins * stakeAmount * feeMultiplier;
                                const payoutDelta = Math.max(0, totalP - prev.payouts);
                                globalStats.totalPayouts += payoutDelta;

                                // Loss calculation (Burned)
                                const totalB = (r.tickets - r.wins) * stakeAmount;
                                const burnDelta = Math.max(0, totalB - (prev.burns || 0));
                                globalStats.totalBurned += burnDelta;

                                roundArchive[rIdStr] = {
                                    ...r, // Store full object for historical exports
                                    isFinal: true,
                                    payouts: totalP,
                                    burns: totalB
                                };
                                console.log(`[ARCHIVE] Finalized Round #${r.id}: Tickets=${r.tickets}, Wins=${r.wins}`);
                            } else {
                                // Update archive with intermediate state
                                roundArchive[rIdStr] = {
                                    ...r, // Store full object
                                    isFinal: false,
                                    payouts: 0,
                                    burns: 0
                                };
                            }
                        }

                        // Always collect recent rounds for display (skipping zombies)
                        const isZombie = (Object.keys(r.state)[0] === 'announced' || r.state === 0) &&
                            r.tickets === 0 && (currentSlot - r.createdSlot > 10000);

                        if (!isZombie && currentCycleRecentRounds.length < recentRoundsLimit) {
                            currentCycleRecentRounds.push(r);
                        }
                    } catch (e) { }
                }
            }
        }

        // ✅ UX FIX: Fill remaining display slots with historical data from the archive.
        // This ensures the dashboard always shows recent rounds even after they are deleted on-chain by the rent reclaimer.
        if (currentCycleRecentRounds.length < recentRoundsLimit) {
            const sortedArchiveKeys = Object.keys(roundArchive).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
            for (const key of sortedArchiveKeys) {
                if (currentCycleRecentRounds.length >= recentRoundsLimit) break;
                const archivedRound = roundArchive[key];
                // Only add if it's not already in the array (not active on-chain)
                if (!currentCycleRecentRounds.some(r => r.id === archivedRound.id)) {
                    currentCycleRecentRounds.push(archivedRound);
                }
            }
        }
        currentCycleRecentRounds.sort((a, b) => b.id - a.id);

        // --- TECHNICAL BACKFILL (Phase 51) ---
        // Verify if any archived round with activity is missing technical fields
        const backfillLimit = 5;
        let backfilledCount = 0;
        for (const [idStr, r] of Object.entries(roundArchive)) {
            if (backfilledCount >= backfillLimit) break;

            const rId = parseInt(idStr, 10);
            // If it has tickets but is missing IDs or tech fields, force a de-facto re-index
            const needsBackfill = r.tickets > 0 && (!r.settleTx || r.id === undefined);

            if (needsBackfill) {
                try {
                    console.log(`[BACKFILL] Deep-fetching technical data for Round #${rId}...`);
                    const BN = anchor.BN || anchor.default.BN;
                    const pda = PublicKey.findProgramAddressSync(
                        [new TextEncoder().encode("round_v3"), new BN(rId).toArrayLike(Buffer, "le", 8)],
                        programPk
                    )[0];

                    const acc = await connection.getAccountInfo(pda);
                    if (acc) {
                        const decoded = coder.decode("Round", acc.data);
                        // Update with full data
                        const sigs = await connection.getSignaturesForAddress(pda, { limit: 20 });
                        let pTx = null, sTx = null, swTx = null;

                        for (const s of sigs) {
                            const tx = await connection.getTransaction(s.signature, { commitment: "finalized", maxSupportedTransactionVersion: 0 });
                            if (tx) {
                                const logs = tx.meta.logMessages.join(",");
                                if (logs.includes("SetPulse")) pTx = s.signature;
                                if (logs.includes("SettleRoundTokens")) sTx = s.signature;
                                if (logs.includes("Sweep")) swTx = s.signature;
                            }
                        }

                        roundArchive[idStr] = {
                            ...r,
                            id: rId,
                            pulseTx: pTx || r.pulseTx,
                            settleTx: sTx || r.settleTx,
                            sweepTx: swTx || r.sweepTx,
                            settledAt: decoded.settledCount ? decoded.settledCount.toNumber() : 0,
                            isFinal: true
                        };
                        console.log(`[BACKFILL] Successfully restored Round #${rId} (Settle: ${sTx ? "FOUND" : "NOT FOUND"})`);
                        backfilledCount++;
                    } else {
                        // If account is closed, try fetching sigs from history
                        const sigs = await connection.getSignaturesForAddress(pda, { limit: 40 });
                        if (sigs.length > 0) {
                            let sTx = null;
                            for (const s of sigs) {
                                const tx = await connection.getTransaction(s.signature, { commitment: "finalized", maxSupportedTransactionVersion: 0 });
                                if (tx && tx.meta.logMessages.join(",").includes("SettleRoundTokens")) sTx = s.signature;
                            }
                            roundArchive[idStr].settleTx = sTx || "PURGED";
                            roundArchive[idStr].id = rId;
                            console.log(`[BACKFILL] Account purged but found sigs for #${rId} (Settle: ${sTx ? "FOUND" : "PURGED"})`);
                        } else {
                            roundArchive[idStr].settleTx = "PURGED";
                            roundArchive[idStr].id = rId;
                        }
                        backfilledCount++;
                    }
                } catch (e) {
                    console.error(`[BACKFILL] Error on Round #${rId}:`, e.message);
                }
            }
        }

        // Keep archive manageable
        const archiveKeys = Object.keys(roundArchive);
        if (archiveKeys.length > MAX_ARCHIVE_SIZE) {
            const sortedIds = archiveKeys.map(Number).sort((a, b) => b - a);
            const newArchive = {};
            for (let i = 0; i < MAX_ARCHIVE_SIZE; i++) {
                const id = sortedIds[i].toString();
                newArchive[id] = roundArchive[id];
            }
            roundArchive = newArchive;
        }

        // 3. Prep final stats for UI with global display calculations
        let displayTickets = globalStats.dailyTickets;
        let displayReveals = globalStats.dailyReveals;
        let displayWins = globalStats.dailyWins;
        let displayPayouts = globalStats.totalPayouts;
        let displayLosses = 0;

        // Calculate losses from historical archive
        for (const rid in roundArchive) {
            const arch = roundArchive[rid];
            displayLosses += (arch.tickets - arch.wins) * stakeAmount;
        }

        // Oracle Uptime logic
        let lastPulseSlot = 0;
        let lastPulseRound = null;

        // Add real-time data from active/unprocessed rounds
        for (const r of currentCycleRecentRounds) {
            const isFinal = r.swept || (Object.keys(r.state)[0] === 'finished' || r.state === 3);
            if (!isFinal && !processedRounds.has(r.id)) {
                displayTickets += r.tickets;
                displayReveals += r.reveals;
                displayWins += r.wins;
                displayPayouts += (r.wins * stakeAmount * feeMultiplier);
                displayLosses += (r.tickets - r.wins) * stakeAmount;
            }

            // Find latest pulse within the active window
            if (r.pulsePublished && r.createdSlot > lastPulseSlot) {
                lastPulseSlot = r.createdSlot;
                lastPulseRound = r.id;
            }
        }

        // If no pulse was found in the recent cycle, search the whole archive cache just in case
        if (lastPulseSlot === 0) {
            const allRecent = Object.values(roundArchive).sort((a, b) => b.id - a.id).slice(0, 100);
            for (const arch of allRecent) {
                if (arch.pulsePublished && arch.createdSlot > lastPulseSlot) {
                    lastPulseSlot = arch.createdSlot;
                    lastPulseRound = arch.id;
                    break;
                }
            }
        }

        const finalStats = {
            dailyRounds: globalStats.dailyRounds,
            dailyTickets: displayTickets,
            dailyReveals: displayReveals,
            dailyWins: displayWins,
            totalPayouts: displayPayouts,
            totalBurned: displayLosses,
            winRate: displayTickets > 0 ? (displayWins / displayTickets) * 100 : 0,
            netFlux: displayPayouts - displayLosses,
            lastUpdated: new Date().toISOString(),
            lastPulse: {
                slot: lastPulseSlot,
                roundId: lastPulseRound,
                // roughly estimate age based on slot difference if we had the current slot, but frontend can also do it
                currentSlot: currentSlot
            },
            treasury: {
                solFees: (treasurySolInfo?.lamports || 0) / 1e9,
                solFeesAddress: treasurySolPda.toBase58(),
                solOperator: operatorSolBalance,
                solOperatorAddress: adminPk.toBase58(),
                timlgFees: rewardFeePoolBalance,
                timlgFeesAddress: rewardFeePoolAddress,
                timlgSweeps: treasuryBalance,
                timlgSweepsAddress: treasuryPda.toBase58(),
                // Keep replication for internal data if needed, but UI will focus on 2x2
                replicationPool: replicationPoolBalance,
                replicationPoolAddress: replicationPoolAddress
            },
            config: {
                stake: stakeAmount,
                fee: feeBps / 100,
                solServiceFee: (typeof (configData.solServiceFeeLamports || configData.sol_service_fee_lamports) === 'object') ?
                    (configData.solServiceFeeLamports || configData.sol_service_fee_lamports).toNumber() / 1e9 :
                    ((configData.solServiceFeeLamports || configData.sol_service_fee_lamports || 0) / 1e9),
                grace: (configData.claimGraceSlots || configData.claim_grace_slots).toNumber(),
                configAddress: configPda.toBase58(),
                tokenomicsAddress: tokenomicsPda ? tokenomicsPda.toBase58() : null
            },
            recentRounds: currentCycleRecentRounds,
            processedIds: globalStats.processedIds,
            archive: roundArchive
        };

        await writeStats(finalStats);

    } catch (err) {
        console.error("Indexing Cycle Failed:", err);
    }
}

async function writeStats(stats) {
    for (const outPath of OUTPUT_PATHS) {
        try {
            mkdirSync(dirname(outPath), { recursive: true });
            writeFileSync(outPath, JSON.stringify(stats, null, 2));
        } catch (e) { }
    }
    try {
        await db.ref('audit_stats').set(stats);
        console.log(`[${new Date().toISOString()}] Successfully pushed to Firebase Realtime DB`);
    } catch (e) { }
}

runIndexer();
setInterval(runIndexer, POLL_INTERVAL);
