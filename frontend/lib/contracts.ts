// TrustStay contract ABIs and addresses
// Update addresses after deployment

export const USDC_ADDRESS = {
  base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const,
  baseSepolia: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const,
} as const;

export const CONTRACTS = {
  baseSepolia: {
    listingRegistry: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    bookingEscrow: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    reputation: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
  base: {
    listingRegistry: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    bookingEscrow: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    reputation: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
} as const;

export const listingRegistryAbi = [
  {
    type: "function",
    name: "createListing",
    inputs: [
      { name: "pricePerNight", type: "uint256" },
      { name: "securityDeposit", type: "uint256" },
      { name: "maxGuests", type: "uint16" },
      { name: "locationHash", type: "bytes32" },
      { name: "ipfsCID", type: "string" },
    ],
    outputs: [{ name: "listingId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getListing",
    inputs: [{ name: "listingId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "host", type: "address" },
          { name: "pricePerNight", type: "uint256" },
          { name: "securityDeposit", type: "uint256" },
          { name: "maxGuests", type: "uint16" },
          { name: "locationHash", type: "bytes32" },
          { name: "ipfsCID", type: "string" },
          { name: "active", type: "bool" },
          { name: "createdAt", type: "uint64" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getHostListings",
    inputs: [{ name: "host", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nextListingId",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const bookingEscrowAbi = [
  {
    type: "function",
    name: "createBooking",
    inputs: [
      { name: "listingId", type: "uint256" },
      { name: "checkIn", type: "uint64" },
      { name: "checkOut", type: "uint64" },
    ],
    outputs: [{ name: "bookingId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "confirmStay",
    inputs: [{ name: "bookingId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "finalizeBooking",
    inputs: [{ name: "bookingId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelByHost",
    inputs: [{ name: "bookingId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isAvailable",
    inputs: [
      { name: "listingId", type: "uint256" },
      { name: "checkIn", type: "uint64" },
      { name: "checkOut", type: "uint64" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBooking",
    inputs: [{ name: "bookingId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "listingId", type: "uint256" },
          { name: "guest", type: "address" },
          { name: "host", type: "address" },
          { name: "totalAmount", type: "uint256" },
          { name: "securityDeposit", type: "uint256" },
          { name: "checkIn", type: "uint64" },
          { name: "checkOut", type: "uint64" },
          { name: "status", type: "uint8" },
          { name: "guestConfirmed", type: "bool" },
          { name: "hostConfirmed", type: "bool" },
          { name: "createdAt", type: "uint64" },
        ],
      },
    ],
    stateMutability: "view",
  },
] as const;

export const erc20Abi = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;
