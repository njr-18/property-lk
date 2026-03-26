export async function seed() {
  return {
    seeded: false,
    reason: "Seed data not implemented yet."
  } as const;
}

async function main() {
  const result = await seed();
  console.log(JSON.stringify(result, null, 2));
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
