import { detectAndStoreDuplicateClusters } from "@property-lk/db";

async function main() {
  const result = await detectAndStoreDuplicateClusters();

  console.log(
    JSON.stringify(
      {
        ok: true,
        scannedListings: result.scannedListings,
        clusterCount: result.clusterCount,
        clusterKeys: result.clusterKeys
      },
      null,
      2
    )
  );
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
