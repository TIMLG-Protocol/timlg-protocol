# TIMLG Protocol — Devnet Beta User Guide

Welcome to the **TIMLG Protocol Devnet Beta**. This guide walks you through the full lifecycle of a round—from connecting your wallet to claiming rewards—and explains how to read **Order History statuses** and the **Flow Analysis** (Sankey) to audit your results.

!!! info "Test Environment (Devnet)"
    You are on **Solana Devnet**. All SOL and TIMLG tokens used here have **no economic value**. This environment exists to test UX, protocol stability, and round lifecycle integrity.

---

## 1. Getting Started

### 1.1 Connect your wallet
Use the **Connect Wallet** button in the header to connect (Phantom / Solflare).

![Connect Wallet](assets/start_guide/1-connect_wallet.png)

**What to check**
- **Wallet chip**: shows your connected address (shortened).
- **Network**: must be **Solana Devnet** (recommended to show a Devnet badge in the header UI).

---

### 1.2 Get Devnet funds (Faucet)
New wallets will show empty balances.

![Empty wallet connected](assets/start_guide/2-empty_wallet_connected.png)

Use the Faucet actions:
1. **Airdrop SOL** — pays transaction fees.
2. **Get TIMLG** — the protocol token used for tickets/stake.

After funding:

![Wallet funded (example)](assets/start_guide/3-wallet_1_sol_10_timlg.png)

**Your Assets panel**
- **Solana Native (SOL)**: used for fees.
- **Protocol Token (TIMLG)**: used to play (each ticket stakes TIMLG).

**Actions**
- Airdrop and Get TIMLG are *Devnet-only* utilities.

---

## 2. Play a Round (Commit Phase)

The **Play Card** is the tactical center of the game. Here you analyze the timeline and place your predictions.

![Play Card](assets/start_guide/4-playcard.png)

### 2.1 Understanding the Interface

The interface is divided into three clear zones (Header, Left, Right) to give you full control:

**Zone 1: The Header (Timeline)**
Located at the very top of the card.
- **Round Status & ID**: Shows which Round you are viewing (e.g. **ROUND #6867**) and its status (**OPEN**).
- **Current Pulse**: Displays the *current* network pulse (the "now").
- **Timer**: In the top right, a countdown shows exactly how much time remains before this round closes.

**Zone 2: Left Panel (Information)**
This area confirms *what* you are betting on.
- **Target Pulse**: The large number indicates the exact pulse this round is targeting.
- **Ticket Preview**: Below the target, you see the details of the ticket you are creating:
    - **Assigned Bit**: The specific bit index you are predicting.
    - **Stake**: The cost (e.g., 1.00 TIMLG).
    - **Technical Data**: Nonce, Commitment Hash, and Ticket PDA (for transparency).

**Zone 3: Right Panel (The Controls)**
This is the interactive "Button Panel" where you make your strategic choices.
- **Pulse Offset (Top Row)**: Selects *which* future round you want to target.
    - **Concept**: Each button (+1, +2, +3...) points to a specific round relative to the *current* pulse.
    - **+1**: Targets the very next pulse.
    - **+5**: Targets a pulse further in the future.
    - *Example:* If you select **+3**, the "Target Pulse" on the left will update to show Current Pulse + 3.
- **Commit Prediction (Bottom Row)**: Once your target is set, choose your outcome:
    - **BEAR (0)**
    - **BULL (1)**
    - **RAND**: Random selection.

**Footer: Protocol Terminal**
At the bottom, a collapsible blue bar (**Protocol Terminal**) logs all your actions and transaction signatures in real-time.

### 2.2 Committing Your Ticket
1.  **Select Offset**: Use the top row of the Right Panel to pick your target round.
2.  **Select Prediction**: Use the bottom row of the Right Panel to choose Bear/Bull.
3.  **Verify**: Check the **Target Pulse** in the Left Panel to ensure it's the one you want.
4.  **Action**: The prediction button effectively acts as the "Prepare" step. (Depending on the specific UI version, you then click **COMMIT** or sign the transaction triggered by your selection).
5.  **Sign**: Approve the transaction in your wallet.

Only after signing is your ticket sent to the blockchain.

---

## 3. Order History: Following Round #6883

Once you commit a ticket, it appears in your **Order History**. This timeline groups your tickets by Round, allowing you to track the exact lifecycle of your bets.

Below, we follow **Round #6883** from start to finish to demonstrate the complete game flow.

### Step 1: The Commit Window (Open)
At this stage, the round is **OPEN**. You can place multiple tickets on the same round.
In this example, we have committed **6 tickets** to Round #6883. All of them are **PENDING**, meaning the prediction is recorded on-chain but encrypted.

![Commit Window](assets/start_guide/5-orderhistory-commitwindow1round6tickets.png)

---

### Step 2: Waiting for Pulse
Once the timer hits zero, the Commit Window closes. The status changes to **WAITING PULSE**.
No more tickets can be added. The protocol is now waiting for the Oracle to publish the verifiable random number for this specific round.

![Waiting Pulse](assets/start_guide/6-orderhistory-waitingpulse1round6tickets.png)

---

### Step 3: Reveal Window Opens
The Oracle publishes the pulse! The round immediately shifts to **REVEAL OPEN**.
You initiate the reveal process to prove your predictions match. Notice the orange **REVEAL ALL (6)** button header, allowing you to reveal all 6 tickets in one click.

![Reveal Window Open](assets/start_guide/7-orderhistory-revealwindow1round6tickets.png)

---

### Step 4: Outcomes Revealed
As you reveal tickets, their results appear instantly.
In our example, of the 6 tickets:
- **3 Tickets** matched the pulse (**WIN**).
- **2 Tickets** did not match (**LOSS**).
- **1 Ticket** has not been revealed yet (**REVEAL NOW** is still active).

![Revealed Outcomes](assets/start_guide/8-orderhistory-revealwindow5revealed3won2lose1unrevealed.png)

!!! danger "Don't Forget!"
    If you leave a ticket unrevealed (like the last one here) until the window closes, it becomes **EXPIRED (Loss)**.

---

### Step 5: Awaiting Settlement
After the reveal window closes, the round briefly updates to **AWAITING SETTLE**.
The protocol calculates the total prize pool and shares for the winners. Note that the unrevealed ticket is now marked **EXPIRED**.

![Awaiting Settle](assets/start_guide/9-orderhistory-awatingsettle-3winners2loses1experied.png)

---

### Step 6: Claiming Prizes
Settlement is complete. The status becomes **CLAIM WINDOW**.
Our **3 Winning Tickets** are now marked **READY TO CLAIM**. You can click **CLAIM ALL (3)** to withdraw all winnings to your wallet in a single transaction.

![Claim Window](assets/start_guide/10-orderhistory-claimwindow3readytoclaim.png)

---

### Step 7: Partial Claims
In this view, we checked back after claiming some rewards.
- **2 Tickets** are marked **CLAIMED** (Green badge). The funds are safe in the wallet.
- **1 Ticket** is still **READY TO CLAIM**.

![Partial Claims](assets/start_guide/11-orderhistory-claimwindow2claims1no.png)

---

### Step 8: Final State (Archived)
The round is finished.
- **CLAIMED** tickets are finalized.
- **LOSS** and **EXPIRED** tickets remain as history.
- **SWEPT**: The one winning ticket we *didn't* claim in time has been "Swept" to the Treasury. It is no longer claimable.

![Archived State](assets/start_guide/12-orderhistory-archived2claimed1swept2lose1experied.png)

---

## 4. Edge Cases & Safety: Refund Mode (Escape Hatch)

If the oracle/pulse pipeline fails, the protocol protects users by entering **REFUND MODE**.

### 4.1 Refund available
![REFUND MODE — Refund available](assets/start_guide/13-orderhistory-1round1ticket-refoundavailable.png)

- Round status: **REFUND MODE**
- Note: **Escape Hatch Active**
- Ticket status: **REFUND AVAILABLE**
- Action: **Refund** or **Refund All (N)**

### 4.2 Refunded
![REFUND MODE — Refunded](assets/start_guide/14-orderhistory-1round1ticket-refounded.png)

- Ticket status: **REFUNDED**
- Stake returned to your wallet.

---

## 5. Analytics & Verification (Performance + Flow Analysis)

The wallet screen includes a **Performance Audit** and a **Participation Volume Flow** chart that lets you audit where your tickets ended up.

![Wallet overview — Performance + Flow analysis](assets/start_guide/15-walletoverview-analitics&flowchart.png)

### 5.1 Performance Audit cards
Typical metrics:
- **Net Profit (TIMLG)**: realized P&L based on claimed wins minus losses (Devnet numbers only).
- **Win Rate**: your win percentage.
- **Best Streak**: longest win streak.
- **Volume**: number of tickets played.

### 5.2 Sankey Flow (Participation Volume Flow)
The Sankey summarizes your lifecycle funnel:
- **Total** → **Played** → **Revealed** → splits into **Win / Loss**
- Win splits into **Claimed / Swept**
- Additional branches can include **Expired** and **Refunded**

**How to read key outcomes**
- **Expired**: committed but not revealed in time.
- **Swept**: won but not claimed in time.
- **Refunded**: safety mode triggered, stake returned.

---

## 6. Quick Status Glossary (User-facing definitions)

- **OPEN**: you can still commit tickets.
- **PENDING**: committed; reveal not done yet.
- **WAITING PULSE**: waiting for oracle pulse.
- **REVEAL OPEN**: reveal window open; reveal required.
- **REVEAL NOW**: action needed; reveal this ticket.
- **WIN / LOSS**: outcome known after reveal.
- **EXPIRED**: not revealed in time.
- **AWAITING SETTLE**: settlement in progress.
- **CLAIM WINDOW**: winners can claim now.
- **READY TO CLAIM**: prize available.
- **CLAIMED**: prize claimed successfully.
- **SWEPT**: prize not claimed in time.
- **REFUND MODE**: escape hatch active (protocol safety).
- **REFUND AVAILABLE**: you can withdraw your stake.
- **REFUNDED**: stake returned.
- **ARCHIVED**: round finalized; no actions remain.
