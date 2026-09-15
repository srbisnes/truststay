# Account Abstraction (Base)

TrustStay is designed to support gasless / smart-account UX on Base.

## Recommended path

1. **Base Account / Coinbase Smart Wallet** – native on Base, excellent for LatAm onboarding.
2. **Safe {Wallet}** – multi-sig + modules for hosts managing multiple properties.
3. **Permissionless / Alchemy Account Kit** – if you need custom paymasters.

## What changes in the protocol

- Guests and hosts can use ERC-4337 smart accounts instead of EOAs.
- A paymaster can sponsor gas for `createBooking` / `confirmStay`.
- Session keys allow limited actions without full key exposure.

No contract changes are required for basic AA support: BookingEscrow and ListingRegistry already work with any address that can hold USDC and call functions.

## Priority

Ship EOA + RainbowKit first (current). Add AA when onboarding friction becomes the bottleneck.
