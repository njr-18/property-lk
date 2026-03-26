export function dbMutationPlaceholder(name: string) {
  return {
    name,
    status: "unimplemented"
  } as const;
}
