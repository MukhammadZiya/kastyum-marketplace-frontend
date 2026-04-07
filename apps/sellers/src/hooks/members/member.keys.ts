export const memberKeys = {
  all: ["member"] as const,
  me: () => [...memberKeys.all, "me"] as const,
  details: () => [...memberKeys.all, "detail"] as const,
  detail: (id: string) => [...memberKeys.details(), id] as const,
};
