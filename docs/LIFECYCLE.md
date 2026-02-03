# Ticket Lifecycle in TIMLG

This diagram details all possible ticket states, from the moment a user performs the *commit* to its final resolution.

```mermaid
flowchart 
  Start((COMMIT\nTicket created))

  subgraph WAIT[WAIT PHASE]
    direction TB
    PENDING[PENDING\nStake paid - waiting for NIST pulse]
  end

  subgraph REVEAL[REVEAL PHASE]
    direction TB
    REVEAL_NOW[REVEAL NOW\nPulse published - reveal window open]
  end

  subgraph RESULT[RESULT]
    direction TB
    REVEALED[REVEALED\nReveal submitted]
    WIN[WIN\nPrediction correct]
    BURN_LOSS[BURN LOSS\nStake burned]
    CLAIM_PRIZE[CLAIM PRIZE\nFunds available after settlement]
    CLAIMED[CLAIMED\nPayout received]
    BURN_EXPIRED[BURN EXPIRED\nStake burned]
  end

  subgraph RECOVERY[RECOVERY - TIMEOUT]
    direction TB
    REFUND_TIMEOUT[REFUND TIMEOUT\nNo pulse within REFUND_TIMEOUT_SLOTS]
    REFUNDED[REFUNDED\nStake returned]
  end

  End((END))

  Start --> PENDING

  PENDING -->|Oracle publishes pulse - on time| REVEAL_NOW
  PENDING -->|No pulse - timeout| REFUND_TIMEOUT

  REVEAL_NOW -->|User reveals - in time| REVEALED
  REVEAL_NOW -->|Missed reveal window| BURN_EXPIRED

  REVEALED -->|Correct| WIN
  REVEALED -->|Incorrect| BURN_LOSS

  WIN -->|Round settled| CLAIM_PRIZE
  CLAIM_PRIZE -->|User claims| CLAIMED

  REFUND_TIMEOUT -->|User refunds stake| REFUNDED

  BURN_LOSS --> End
  BURN_EXPIRED --> End
  CLAIMED --> End
  REFUNDED --> End

  classDef phase fill:#F6F1FF,stroke:#6B5BD2,stroke-width:1px,color:#111;
  classDef neutral fill:#FFFFFF,stroke:#8A8A8A,stroke-width:1px,color:#111;
  classDef good fill:#DFF7E6,stroke:#2E7D32,stroke-width:1px,color:#111;
  classDef warn fill:#FFF4CC,stroke:#B08900,stroke-width:1px,color:#111;
  classDef bad fill:#FFE1E1,stroke:#B3261E,stroke-width:1px,color:#111;

  class WAIT,REVEAL,RESULT,RECOVERY phase;
  class PENDING,REVEAL_NOW,REVEALED,CLAIM_PRIZE,REFUND_TIMEOUT,REFUNDED neutral;
  class WIN,CLAIMED good;
  class BURN_LOSS,BURN_EXPIRED bad;
```

### Participation Volume Flow

The following Sankey diagram visualizes how tickets typically flow through the system by volume, highlighting the "leakage" point (Expired) and the final distribution of outcomes.

```mermaid
sankey-beta
    Total,Refunded,50
    Total,Pending,50
    Total,Played,900

    Played,Expired,50
    Played,Revealed,850

    Revealed,Losses,425
    Revealed,Wins,425

    Wins,Claimed,425
```

### State Explanations (Updated)

1. **PENDING**: The ticket has been registered on-chain. The user has already paid the *stake*, but the result (NIST Pulse) is not yet available.  
2. **REVEAL NOW**: The pulse is now public on-chain, and the reveal window is still open for the user.  
3. **WIN**: The user revealed and was correct, either waiting for settlement or ready to collect.  
4. **CLAIM PRIZE**: Prize funds are now available for claiming after the round has been settled.  
5. **BURN LOSS**: The user revealed but was not correct. The *stake* is permanently **burned**.  
6. **BURN EXPIRED**: The user **did not reveal on time**. The *stake* is **burned** in the same way as a loss.  
7. **REFUND TIMEOUT**: A safety mechanism activated if the Oracle does not publish the pulse after a reasonable time (`REFUND_TIMEOUT_SLOTS`). Allows the user to recover their *stake*.  
8. **CLAIMED**: Terminal state. The user successfully claimed the prize payout.  
9. **REFUNDED**: Terminal state. The user recovered their *stake* after a timeout (no pulse published).  
