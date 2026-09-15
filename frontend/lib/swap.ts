/**
 * Uniswap V3 helpers for Base.
 * Primary path: swap ETH / WETH → USDC before booking.
 */

export const BASE_ADDRESSES = {
  WETH: "0x4200000000000000000000000000000000000006" as const,
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const,
  SWAP_ROUTER: "0x2626664c2603336E57B271c5C0b26F421741e481" as const,
  QUOTER: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a" as const,
} as const;

export const swapRouterAbi = [
  {
    type: "function",
    name: "exactInputSingle",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMinimum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "payable",
  },
] as const;

export const DEFAULT_POOL_FEE = 500;

export function buildEthToUsdcParams(
  amountInWei: bigint,
  recipient: `0x${string}`,
  minOutUsdc: bigint = 0n
) {
  return {
    tokenIn: BASE_ADDRESSES.WETH,
    tokenOut: BASE_ADDRESSES.USDC,
    fee: DEFAULT_POOL_FEE,
    recipient,
    amountIn: amountInWei,
    amountOutMinimum: minOutUsdc,
    sqrtPriceLimitX96: 0n,
  };
}

export function estimateEthToUsdc(ethAmount: number, ethPriceUsd = 3500): number {
  return ethAmount * ethPriceUsd * 0.997;
}
