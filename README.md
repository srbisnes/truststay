# TrustStay 🏠🔒

**Decentralized, trustless Airbnb-style rental platform on Ethereum (Base L2)**

Worldwide secure home rentals with:
- Trustless escrow (no scams for guest or host)
- On-chain availability & bookings
- Ultra-low fees (Base L2)
- Crypto payments + ARS on-ramp support
- Built-in swaps (USDC / ETH / stablecoins)
- Reputation Points system
- AI Agents with automatic translation
- Fully EVM compatible

> Security-first • Gas-efficient • Production-grade architecture

## Why TrustStay solves the global problem

Traditional platforms (Airbnb, Booking) take high fees (15-20%), have slow disputes, currency friction, and centralized control. Scams still happen. TrustStay uses smart contracts so:

1. **Money is locked in escrow** until both parties confirm (or time + dispute window).
2. **Double-booking is impossible** (on-chain calendar).
3. **Reputation is on-chain** and portable.
4. **Fees are minimal** (protocol can take 1-3%).
5. **Works worldwide** with any EVM wallet.
6. **No single point of failure**.

### Important Legal & Compliance Note

Smart contracts handle **payment escrow and commitments**. Physical access to properties, local housing laws, taxes, consumer protection, and fiat on/off-ramps are **still subject to the laws of each country**.  

This protocol is designed as a pure P2P tool. The platform does **not** custody funds outside of transparent, user-controlled escrow contracts.  

**You must consult local counsel** before operating as a commercial marketplace, collecting fees, or integrating fiat ramps in any jurisdiction (especially Argentina for ARS). Pure crypto P2P between two parties has fewer barriers, but any service layer can trigger regulations.

## Architecture (Recommended Production Stack)

| Layer | Technology | Reason |
|-------|------------|--------|
| Chain | **Base** (Ethereum L2) | Extremely low gas, EVM, Coinbase ecosystem (good for LatAm ramps), security of Ethereum |
| Tokens | USDC (primary), ETH, other stables | Stable pricing for rentals |
| Contracts | Solidity 0.8.24 + OpenZeppelin + Foundry | Security standards, gas optimized |
| Escrow | Custom BookingEscrow + ListingRegistry | Prevents scams, double booking |
| Reputation | Soulbound Points / ERC-721 or ERC-20 with transfer restrictions | Incentivizes good behavior |
| Frontend | Next.js 15 + Tailwind + shadcn/ui + wagmi v2 + viem + RainbowKit | Modern, type-safe, wallet UX |
| Metadata | IPFS (Pinata / web3.storage) | Property photos & descriptions |
| AI Agents | Off-chain (Grok / OpenAI compatible) + on-chain triggers | Translation + booking assistant |
| Swaps | Uniswap V3 on Base | Instant conversion |
| Account Abstraction | Optional (Base Account / Safe) | Gasless UX for newcomers |

### Core Smart Contract Flow

1. **Host** creates Listing (price per night in USDC, max guests, location hash, IPFS CID, availability windows).
2. **Guest** selects dates → contract checks availability → Guest deposits full amount + small security deposit into Escrow.
3. Host accepts (or auto-accept).
4. During stay: optional check-in / check-out signatures or photos.
5. After end date + dispute window (e.g. 48h):
   - Both confirm → funds released to Host, deposit returned to Guest.
   - Dispute → funds held for arbitration (Kleros or multi-sig committee in v1).
6. Both parties earn/lose Reputation Points based on outcome.

## Project Structure

```
truststay/
├── contracts/          # Foundry project
│   ├── src/
│   │   ├── ListingRegistry.sol
│   │   ├── BookingEscrow.sol
│   │   └── ReputationPoints.sol
│   ├── test/
│   └── script/
├── frontend/           # Next.js App Router
│   ├── app/
│   ├── components/
│   └── lib/
├── docs/
└── README.md
```

## Quick Start (Development)

### 1. Contracts (Foundry)

```bash
cd contracts
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge build
forge test
```

Deploy to Base Sepolia (testnet):

```bash
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC --broadcast --verify
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Fill NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, contract addresses, etc.
npm run dev
```

### 3. Production Deploy

- Contracts → Base mainnet (after audit)
- Frontend → Vercel (this repo is already set up for it)

## Roadmap to Production

1. **MVP (this repo)** – Core escrow + registry + basic UI + wallet
2. **v1** – Full calendar, IPFS, reputation, basic AI translator
3. **v1.5** – Uniswap swaps, ARS ramp partner integration, smart lock integration
4. **v2** – Account Abstraction, Kleros disputes, mobile PWA, multi-chain (Arbitrum, Optimism)
5. **Audit** → Trail of Bits / OpenZeppelin / Spearbit before mainnet funds

## Security Principles Applied

- Checks-Effects-Interactions
- ReentrancyGuard on all value transfers
- Access control with Ownable2Step / Roles
- No unbounded loops
- Explicit integer safety (Solidity 0.8+)
- Pull-over-push for withdrawals where possible
- Time-locks and dispute windows
- Comprehensive Foundry tests + fuzzing recommended

## License

MIT (contracts + frontend). Use responsibly.

---

Built with Security First mindset for institutional-grade Web3.
Contact the architect for private audit / custom features.
