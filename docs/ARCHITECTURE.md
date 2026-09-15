# TrustStay Architecture Decision Record

## Problem
Global short-term rentals suffer from:
- High platform fees (15-20%)
- Scams (ghost listings, no-shows, damage disputes)
- Currency friction (especially ARS / emerging markets)
- Slow, centralized dispute resolution
- Lack of portable reputation

## Solution Summary
Pure P2P protocol on Base (Ethereum L2) with:
1. On-chain listing registry + occupancy calendar
2. USDC escrow with dual confirmation + dispute window
3. Soulbound reputation points
4. Frontend + AI agents as thin UX layer
5. Optional fiat ramps (partner) without the protocol itself needing licenses

## Why Base?
- Gas costs ≈ $0.01 or less → viable for daily bookings
- Full EVM compatibility
- Coinbase ecosystem helps with on-ramps (important for Argentina/LatAm)
- Inherits Ethereum security + decentralization

## Security Model (Critical)
- **ReentrancyGuard** on all value paths
- **SafeERC20** for USDC transfers
- Occupancy mapping prevents double booking at the protocol level
- Funds never leave escrow until both parties confirm or dispute window passes
- Protocol fee capped (≤5% in code)
- No admin can seize user funds (only change fee recipient / parameters)
- Future: Kleros or similar for decentralized arbitration

## What is intentionally off-chain
- Photos, long descriptions → IPFS
- Real-time chat / translation → AI agents (off-chain)
- Physical key exchange / smart locks → integration point
- Legal contracts / local compliance → user responsibility

## Fiat / ARS Reality
True permissionless operation is crypto-only.
Any ARS ↔ crypto ramp requires a licensed partner (Transak, Ramp, local Argentine providers, etc.).
The protocol itself remains a pure smart-contract tool.

## Roadmap Priorities
1. Audit of BookingEscrow + ListingRegistry
2. Full calendar UI + IPFS metadata
3. Uniswap integration for swaps
4. AI agent (translator + booking helper)
5. Account Abstraction for gasless onboarding
6. Multi-chain expansion if needed

## Legal Disclaimer
This software is provided as a tool. Operating a commercial rental marketplace may require licenses, tax registration, consumer protection compliance, and housing regulation adherence in every jurisdiction you serve. Consult qualified counsel.
