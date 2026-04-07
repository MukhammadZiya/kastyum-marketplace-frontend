export const adminSessionKeys = {
  all: ["adminSession"] as const,
  me: () => [...adminSessionKeys.all] as const,
};
