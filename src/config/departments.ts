export const DEPARTMENTS = {
  admin: "Administration",
  bppdc: "Big Pine Paiute Development Corporation",
  coo: "Community Outreach Office",
  education: "Education",
  environmental: "Environmental",
  fiscal: "Fiscal",
  housing: "Housing",
  thpo: "Tribal Historic Preservation Office",
  wellness: "Wellness Center",
} as const;

export type DepartmentSlug = keyof typeof DEPARTMENTS;
