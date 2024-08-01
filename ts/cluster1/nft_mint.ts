import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, generateSigner, percentAmount, signerIdentity } from "@metaplex-foundation/umi";

import base58 from "bs58";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../wba-wallet.json";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
  let tx = await createNft(umi, {
    mint,
    name: "My NFT",
    symbol: "MNFT",
    uri: "https://arweave.net/Z5b0o6A6XwOSUPST9BzzR_-CefqkvUvM9fvw60StwJo",
    sellerFeeBasisPoints: percentAmount(5, 2), // 5%
  });

  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Successfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
  console.log("Mint Address: ", mint.publicKey);
})();
