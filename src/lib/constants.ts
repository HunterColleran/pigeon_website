export const SITE = {
  name: "Pigeon",
  company: "Pigeon Group",
  tagline: "LOOK UP.",
  description:
    "A compact smart pager that filters your phone's notifications and delivers only what matters.",
  url: "https://pigeongroup.co",
} as const;

export const SPECS = [
  { label: "Form factor", value: '54 × 89 × 9.5 mm, < 50 g' },
  { label: "Display", value: "128 × 64 monochrome LCD" },
  { label: "Connectivity", value: "Bluetooth Low Energy 5.0" },
  { label: "Battery", value: "500 mAh rechargeable" },
  { label: "Attachment", value: "MagSafe compatible" },
  { label: "Charging", value: "USB-C" },
  { label: "Target price", value: "$129" },
] as const;
