export type AdminSection =
  | "Dashboard"
  | "Users"
  | "Sellers"
  | "Products (Moderation)"
  | "Orders"
  | "Reports/Complaints"
  | "CMS"
  | "Audit Logs"
  | "Admin";

export const NAV_ITEMS: AdminSection[] = [
  "Dashboard",
  "Users",
  "Sellers",
  "Products (Moderation)",
  "Orders",
  "Reports/Complaints",
  "CMS",
  "Audit Logs",
  "Admin",
];

export const SECTION_DESCRIPTIONS: Record<AdminSection, string> = {
  Dashboard: "Overview of marketplace health across users and sellers.",
  Users: "Manage buyer accounts, statuses, and activity visibility.",
  Sellers: "Review seller stores, onboarding status, and control actions.",
  "Products (Moderation)": "Approve, reject, or unlist seller products.",
  Orders: "Monitor order lifecycle, issues, and interventions.",
  "Reports/Complaints": "Handle abuse reports, disputes, and content complaints.",
  CMS: "Update banners, highlights, and managed storefront content.",
  "Audit Logs":
    "Track superadmin actions for accountability and compliance.",
  Admin: "Single superadmin profile and platform-level admin settings.",
};

