# Getting Started: Devnet Beta

Welcome to the **TIMLG Devnet Beta**. This guide will walk you through the steps to test the protocol risk-free using test tokens (no real value).

!!! info "Test Environment"
    You are on **Devnet**, a Solana development network. The SOL and TIMLG tokens used here have **no economic value**. The goal is to test the game mechanics and stability.

---

## 0. Prerequisites

Before starting, you need a Solana-compatible wallet. We recommend **Phantom**.

1. Install the [Phantom Wallet](https://phantom.app/) browser extension.
2. Open your wallet and go to **Settings > Developer Settings**.
3. Enable **Testnet/Devnet Mode** and make sure **Solana Devnet** is selected.

---

## 1. Connection and Funds (Faucet)

To play, you need two things:
*   **Devnet SOL:** To pay for network fees (gas).
*   **TIMLG Tokens:** The chips used to bet in the game.

### Steps:

1.  Click the **"Connect Wallet"** button in the top right corner of the application.
2.  If this is your first time, you will see your balances are 0.
3.  Use the **Faucet** panel (bottom left on desktop or in the menu):
    *   Click **"Airdrop 1 SOL"** to receive SOL.
    *   Click **"Get 1,000 TIMLG"** to receive your game tokens.

![Faucet Panel and Balances](assets/start_guide/faucet_panel.png)
*Above: Panel where you can request test funds.*

---

## 2. How to Play (Commit)

The game consists of predicting the next randomness "pulse". In this simplified version, you choose between **Bull (1)** or **Bear (0)**.

### Steps:

1.  Look at the game panel ("Prediction Card").
2.  Select your prediction: **Bull** or **Bear**.
3.  Click **COMMIT TICKET**.
4.  Approve the transaction in your wallet.

!!! warning "Ticket Cost"
    Each ticket costs **1 TIMLG**. This token is locked in the contract until the result is revealed.

![Game Controls](assets/start_guide/game_controls.png)
*Above: Game card to select your prediction.*

---

## 3. Wait and Reveal

TIMLG uses a "Commit-Reveal" system to ensure fairness.

*   **Commit:** You send your prediction in secret (encrypted + salt).
*   **Wait:** Wait for the oracle to publish the random number (Pulse).
*   **Reveal:** You open your prediction to see if it matches.

### What do I need to do?

After Committing, you will see your ticket in the **"My Tickets"** list with the status **Pending**.

1.  Wait a few seconds (rounds are fast on Devnet, ~1-2 minutes).
2.  When the oracle publishes the result, a **REVEAL** button will appear (or it will reveal automatically if you have that option enabled).
3.  If manual, click **REVEAL** and sign the transaction.

!!! danger "Don't Forget to Reveal!"
    If you forget to reveal your ticket within the allowed time (Reveal Window), it will expire and **you will lose your stake**. This is to prevent spam and ensure the game moves forward.

![Pending Ticket](assets/start_guide/pending_ticket.png)
*Above: Ticket waiting for the oracle result.*

---

## 4. Results and Claim

Once the ticket is revealed, you will know if you won:

*   **WIN:** Your prediction matched. You recover your 1 TIMLG + win 1 extra TIMLG (minus fees).
*   **LOSS:** It did not match. Your TIMLG token is burned.

### Claiming Winnings

If you win, the prize does not go directly to your wallet; it stays in the contract waiting for you to claim it.

1.  Find the winning ticket in "My Tickets".
2.  Click the **CLAIM** button.
3.  Your winnings will be added to your total balance.

![Claim Win](assets/start_guide/claim_win.png)
*Above: Winning ticket ready to be claimed.*

---

## 5. Refunds (Protocol Failures)

What happens if the game breaks or the Oracle stops working?

TIMLG has a built-in safety mechanism. If the Oracle fails to publish the random number (Pulse) within the expected time limit (Timeout), the round is cancelled.

*   **REFUND:** In this case, a **REFUND** button will appear on your ticket. You can click it to get your 100% stake back.
*   **Note:** Refunds only apply to protocol failures, not user errors (like forgetting to reveal).

---

## Deep Dive

Want to understand the mechanics in detail?

*   **[Ticket Lifecycle Diagram](LIFECYCLE.md)**: Visual flow of all possible ticket states (Commit -> Reveal -> Win/Loss/Refund).
*   **[Timing Windows & Parameters](protocol/timing_windows.md)**: Details on how slots determine the duration of each phase.

---

## Questions?

If you find any errors or have questions, please contact us through our support channels on [Discord/Telegram].
