# Devnet Beta User Guide

Welcome to the **TIMLG Protocol Devnet Beta**. This guide will walk you through the entire lifecycle of a game round, explaining the interface, game mechanics, and how to track your results using the visual flowcharts.

!!! info "Test Environment"
    You are on **Devnet**, a Solana development network. All SOL and TIMLG tokens used here have **no economic value**. The goal is to test the protocol's game theory and stability.

---

## 1. Getting Started

### Validating Your Connection
Before playing, ensure your wallet is connected. The application will check your connection status and display your current network (must be **Solana Devnet**).

![Connect Wallet](assets/start_guide/1-connect_wallet.png)

*   **Connect Button:** Located at the top right. Click to link your Phantom or Solflare wallet.
*   **Devnet Indicator:** Ensures you are on the correct test network.

### Initial State & Faucet
Once connected, if you are a new user, you will likely see empty balances.

![Empty Wallet](assets/start_guide/2-empty_wallet_connected.png)

To start playing, you need funds. Use the **Faucet** panel (bottom left) to request free test tokens:
1.  **Request SOL:** For transaction fees ("gas").
2.  **Request TIMLG:** The game token used for betting tickets.

After requesting funds, your dashboard will update:

![Funded Wallet](assets/start_guide/3-wallet_1_sol_10_timlg.png)

*   **Your Assets:** Shows your current holdings (e.g., 10.00 TIMLG).
*   **Performance Audit:** Tracks your total wins, losses, and net profit/loss (PnL) for this session.

---

## 2. Playing the Game (Commit Phase)

### Prediction Card
The core interaction happens in the **Play Card**. Here you predict the outcome of the next random "pulse".

![Play Card](assets/start_guide/4-playcard.png)

*   **Bull / Bear Switch:** Choose your prediction.
*   **Round Info:** Displays the current Round ID (e.g., #6883) and the countdown until the **Commit Window** closes (e.g., "Commit ends: 14s").
*   **COMMIT TICKET:** Click this button to place your bet. Each ticket costs **1 TIMLG**.

### Monitoring Your Commitments
Once you commit a ticket, it appears in your **Order History** under the current round.

![Commit Window History](assets/start_guide/5-orderhistory-commitwindow1round6tickets.png)

*   **Status: OPEN:** The round is still accepting bets.
*   **Ticket Status: PENDING:** Your prediction is recorded on-chain but encrypted (hashed).
*   **Info Icon (i):** Shows technical details like your specific `nonce` and `commitmentHash`.

---

## 3. Waiting for the Oracle (Pulse)

After the Commit window closes, the round enters the **Waiting Pulse** phase. The protocol is now waiting for the independent Oracle to publish the verifiable random number.

![Waiting Pulse](assets/start_guide/6-orderhistory-waitingpulse1round6tickets.png)

*   **Status: WAITING PULSE:** No more bets can be placed.
*   **Timer:** Shows an estimated time until the Oracle pulse arrives.
*   **Escape Hatch:** If the Oracle fails to reveal within the timeout (usually ~150 slots), the round enters **Refund Mode** (see Section 6).

---

## 4. The Reveal Phase

Once the Oracle publishes the pulse, the **Reveal Window** opens. This is a critical step in the Commit-Reveal scheme.

### Reveal Window Open
You must now "reveal" your secret prediction to prove it matches the commitment.

![Reveal Window](assets/start_guide/7-orderhistory-revealwindow1round6tickets.png)

*   **Status: REVEAL OPEN:** You have a limited time (e.g., ~150 slots) to reveal your tickets.
*   **Action: REVEAL NOW:** Click the orange button to reveal individual tickets, or use the **"Reveal All"** button in the header action bar to reveal all tickets in the round at once.

### Revealed Outcomes
As tickets are revealed, their status updates immediately based on the Oracle's random number:

![Revealed Outcomes](assets/start_guide/8-orderhistory-revealwindow5revealed3won2lose1unrevealed.png)

*   **WIN:** Your prediction matched.
*   **LOSS:** Your prediction did not match.
*   **REVEAL NOW:** Tickets you haven't revealed yet.

!!! danger "Use It or Lose It"
    If you fail to reveal your ticket before the Reveal Window closes, it becomes **EXPIRED** and is considered a loss.

---

## 5. Settlement & Claiming

### Awaiting Settlement
After the reveal phase ends, the round briefly enters **Awaiting Settle**. The protocol calculates the total pool and winning shares.

![Awaiting Settle](assets/start_guide/9-orderhistory-awatingsettle-3winners2loses1experied.png)

*   **Auto-Settling:** This usually happens automatically.
*   **Status Update:** "Win" tickets update to "Claim Prize" once the token settlement is finalized.

### Claiming Prizes
Once settled, winners can claim their payout.

![Claim Prize](assets/start_guide/10-orderhistory-claimwindow3readytoclaim.png)

*   **Status: CLAIM PRIZE:** Money is waiting for you in the contract.
*   **Action: CLAIM:** Click to withdraw your winnings to your wallet. You can also use **"Claim All"** to withdraw multiple prizes in one transaction.

### Claimed History
After claiming, the status changes to **CLAIMED**.

![Claimed Status](assets/start_guide/11-orderhistory-claimwindow2claims1no.png)

*   **Green Badge (CLAIMED):** Confirms the funds are safe in your wallet.

---

## 6. Edge Cases: Sweeps & Refunds

### The Sweep Mechanism (Game Over)
To keep the contract efficient, unclaimed prizes and expired tickets are eventually "swept" (removed) to the Treasury after a grace period.

![Archived & Swept](assets/start_guide/12-orderhistory-archived2claimed1swept2lose1experied.png)

*   **SWEPT / EXPIRED:** These tickets can no longer be acted upon.
*   **Orange Badge (SWEPT):** Indicates a winning ticket that wasn't claimed in time, or a round that was closed to free up rent space.

### Safety Mechanism: Refunds
If the Oracle network goes down or a "Pulse" is missed, the protocol protects your funds via the **Escape Hatch**.

**Refund Available:**
![Refund Available](assets/start_guide/13-orderhistory-1round1ticket-refoundavailable.png)

*   **Status: REFUND MODE:** The round failed to execute properly.
*   **Action: REFUND AVAILABLE:** You can withdraw your full stake (1 TIMLG).

**Refunded State:**
![Refunded](assets/start_guide/14-orderhistory-1round1ticket-refounded.png)

*   **Status: REFUNDED:** Your stake has been returned to your wallet.

---

## 7. Analytics & Verification

The TIMLG dashboard provides powerful tools to track your performance and verify game integrity.

![Analytics Dashboard](assets/start_guide/15-walletoverview-analitics&flowchart.png)

*   **Sankey Diagram (Flowchart):** Visualizes exactly where your money went.
    *   **Left (Source):** Total TIMLG spent (Volume).
    *   **Middle (Outcome):** Split between Wins, Losses, and Fees.
    *   **Right (Status):** Shows if Wins were Claimed (Profit) or Swept (Missed Opportunity).
*   **Stat Cards:**
    *   **Net Profit:** Your realized PnL.
    *   **Win Rate:** Your success frequency (expected ~50%).
    *   **Pending:** Value currently locked in open rounds.

Use these tools to audit your own gameplay and ensure the protocol is behaving as expected.
