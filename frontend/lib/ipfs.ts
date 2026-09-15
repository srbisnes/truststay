/**
 * IPFS metadata helper for TrustStay listings.
 * Production: use Pinata, web3.storage or NFT.Storage with API keys.
 * Demo mode uses a public gateway-friendly payload + deterministic CID-like hash.
 */

export type ListingMetadata = {
  name: string;
  description: string;
  location: string;
  image?: string;
  amenities: string[];
  maxGuests: number;
  external_url?: string;
};

export function buildListingMetadata(input: {
  title: string;
  description: string;
  location: string;
  amenities?: string[];
  maxGuests: number;
  imageUrl?: string;
}): ListingMetadata {
  return {
    name: input.title,
    description: input.description,
    location: input.location,
    image: input.imageUrl,
    amenities: input.amenities ?? [],
    maxGuests: input.maxGuests,
    external_url: "https://truststay.app",
  };
}

export async function uploadListingToIPFS(
  metadata: ListingMetadata,
  options?: { pinataJwt?: string }
): Promise<{ cid: string; url: string }> {
  if (options?.pinataJwt) {
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.pinataJwt}`,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: { name: `truststay-${metadata.name}` },
      }),
    });
    if (!res.ok) throw new Error(`Pinata upload failed: ${res.status}`);
    const data = await res.json();
    const cid = data.IpfsHash as string;
    return { cid, url: `https://gateway.pinata.cloud/ipfs/${cid}` };
  }

  const json = JSON.stringify(metadata);
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(json));
  const hex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 46);
  const cid = `bafy${hex}`;
  return { cid, url: `https://ipfs.io/ipfs/${cid}` };
}

export function ipfsGatewayUrl(cid: string): string {
  if (cid.startsWith("http")) return cid;
  return `https://ipfs.io/ipfs/${cid}`;
}
