# TrustStay 🏠🔒

**Production-grade decentralized short-term rental protocol on Base (Ethereum L2)**

> Trustless escrow · On-chain availability · Soulbound reputation · Ultra-low fees · Worldwide

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636)](https://soliditylang.org)
[![Foundry](https://img.shields.io/badge/Built%20with-Foundry-FFDB1C)](https://getfoundry.sh)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black)](https://nextjs.org)

---

## Why TrustStay

Traditional platforms charge 15-20%, resolve disputes slowly, and still allow scams. TrustStay replaces the trusted middleman with **smart contracts**:

| Problem | TrustStay solution |
|---------|--------------------|
| Guest pays and host disappears | Funds locked in escrow until both confirm |
| Host accepts then cancels late | Guest is fully refunded if host cancels before check-in |
| Double booking | On-chain occupancy calendar makes it impossible |
| Fake reviews / no reputation | Soulbound Reputation Points (non-transferable) |
| High fees & currency friction | Base L2 (cents) + USDC + ready for ARS ramps |

**Legal note**: The protocol is a pure P2P tool. Physical access, local housing laws, taxes and fiat ramps remain subject to each jurisdiction. Consult counsel before operating commercially.

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Next.js App    │────▶│  ListingRegistry │     │ ReputationPoints│
│  (Vercel)       │     │  (on-chain)      │     │ (soulbound)     │
│  RainbowKit     │     └────────┬─────────┘     └────────▲────────┘
│  wagmi + viem   │              │                        │
└────────┬────────┘              ▼                        │
         │              ┌──────────────────┐              │
         └─────────────▶│  BookingEscrow   │──────────────┘
                        │  USDC locked     │
                        │  occupancy map   │
                        │  dual confirm    │
                        └──────────────────┘
```

- **Chain**: Base (primary) / Base Sepolia (test)
- **Token**: USDC (6 decimals)
- **Contracts**: Solidity 0.8.24 + OpenZeppelin + Foundry
- **Frontend**: Next.js 15 App Router, Tailwind, RainbowKit, wagmi v2

---

## Repository structure

```
truststay/
├── contracts/               # Foundry project
│   ├── src/
│   │   ├── ListingRegistry.sol
│   │   ├── BookingEscrow.sol
│   │   └── ReputationPoints.sol
│   ├── test/BookingEscrow.t.sol
│   ├── script/Deploy.s.sol
│   ├── foundry.toml
│   └── remappings.txt
├── frontend/                # Next.js app
│   ├── app/                 # pages: /, /explore, /list, /listing/[id], /dashboard
│   ├── components/
│   └── lib/                 # wagmi, contracts ABIs, mock data
├── docs/ARCHITECTURE.md
└── README.md
```

---

## Quick start

### 1. Contracts

```bash
cd contracts
curl -L https://foundry.paradigm.xyz | bash
foundryup

forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install foundry-rs/forge-std --no-commit

forge build
forge test -vv
```

Deploy (Base Sepolia example):

```bash
# .env
PRIVATE_KEY=0x...
USDC_ADDRESS=0x...          # Base Sepolia USDC or mock
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=...

forge script script/Deploy.s.sol \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify
```

Copy the three addresses into `frontend/lib/contracts.ts`.

### 2. Frontend

```bash
cd frontend
npm install

cp .env.example .env.local
# Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID (get free at https://cloud.walletconnect.com)
# Optionally set contract addresses

npm run dev
# → http://localhost:3000
```

### 3. Production frontend (Vercel)

1. Import `srbisnes/truststay` in Vercel
2. Root Directory = `frontend`
3. Framework = Next.js
4. Add env var `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
5. Deploy

---

## Core security model

- **ReentrancyGuard** on every value-moving function
- **SafeERC20** for all USDC transfers
- Occupancy mapping prevents double-booking at protocol level
- Funds only leave escrow when:
  - Both guest **and** host call `confirmStay`, or
  - `finalizeBooking` is called after `checkOut + disputeWindow`
- Host can cancel **before** check-in → full refund
- Protocol fee hard-capped at 5% in code (default 1.5%)
- Reputation is soulbound (transfers revert)

Recommended before mainnet: professional audit (Trail of Bits / OpenZeppelin / Spearbit) + full Foundry fuzz suite.

---

## Roadmap

- [x] Core escrow + registry + reputation
- [x] Full Foundry tests
- [x] Production frontend (explore / list / book / dashboard)
- [ ] Real IPFS upload (Pinata / web3.storage)
- [ ] Uniswap V3 swaps in-app
- [ ] ARS / fiat on-ramp partner
- [ ] AI translator agent (guest ↔ host)
- [ ] Account Abstraction (gasless)
- [ ] Kleros (or similar) dispute resolution
- [ ] Mainnet audit + launch

---

## License

MIT

Built with a security-first, institutional-grade mindset.
