# Protocol Versioning & Migration

The TIMLG Protocol implements a versioned account structure to support future upgrades without data loss.

## Versioning Scheme
- **`INITIAL_VERSION`**: 1
- **Current Support**: The program logic currently operates on version 1.
- **Migration Path**: Future versions will use the `migrate_config` instruction to re‑allocate account space and update parameters.

## Configuration Migration
Administrators can initiate a migration using the `migrate_config` instruction. This process:
1. Verifies the caller is the current `admin`.
2. Re‑allocates the `Config` account if additional space is required for new features.
3. Updates the `version` field in the state.
4. Initializes any new parameters with default values.

> **Important**: Migrations are irreversible and should only be performed during scheduled maintenance windows. Check the [Roadmap](../roadmap/index.md) for planned protocol upgrades.
