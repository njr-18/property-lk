export function dbQueryPlaceholder(name: string) {
  return {
    name,
    status: "unimplemented"
  } as const;
}
