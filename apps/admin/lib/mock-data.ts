export type NavItem = {
  href: string;
  label: string;
  description: string;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", description: "Overview and queue" },
  { href: "/listings", label: "Listings", description: "Moderate property supply" },
  { href: "/verification", label: "Verification", description: "Trust and identity checks" },
  { href: "/duplicates", label: "Duplicates", description: "Cluster review" },
  { href: "/reports", label: "Reports", description: "User flagged issues" },
  { href: "/users", label: "Users", description: "Account management" },
  { href: "/inquiries", label: "Inquiries", description: "Lead triage" },
  { href: "/settings", label: "Settings", description: "Rules and integrations" }
];

export const dashboardStats = [
  { label: "Listings awaiting review", value: "18", foot: "+4 since yesterday" },
  { label: "Duplicate clusters", value: "7", foot: "2 high confidence" },
  { label: "Open reports", value: "24", foot: "6 need escalation" },
  { label: "New inquiries", value: "63", foot: "41% response rate" }
];

export const listings = [
  {
    id: "LKT-1024",
    title: "3 Bedroom House in Nugegoda",
    type: "Rent",
    status: "Pending review",
    price: "LKR 180,000"
  },
  {
    id: "LKT-1031",
    title: "Apartment near Colombo 07",
    type: "Sale",
    status: "Active",
    price: "LKR 42,500,000"
  },
  {
    id: "LKT-1058",
    title: "Commercial space in Rajagiriya",
    type: "Rent",
    status: "Needs verification",
    price: "LKR 240,000"
  }
];

export const verificationQueue = [
  { name: "Owner identity", item: "LKT-1024", status: "Review required" },
  { name: "Phone check", item: "LKT-1031", status: "Verified" },
  { name: "Availability confirmation", item: "LKT-1058", status: "Pending" }
];

export const duplicateClusters = [
  { id: "DC-01", members: 4, confidence: "92%", status: "Likely duplicate" },
  { id: "DC-02", members: 2, confidence: "78%", status: "Needs manual review" }
];

export const reports = [
  { issue: "Fake listing", listing: "LKT-1008", severity: "High" },
  { issue: "Wrong price", listing: "LKT-1031", severity: "Medium" },
  { issue: "Spam contact details", listing: "LKT-1058", severity: "High" }
];

export const users = [
  { name: "A. Perera", role: "Agent", status: "Active" },
  { name: "S. Fernando", role: "Owner", status: "Pending review" },
  { name: "M. Silva", role: "Admin", status: "Active" }
];

export const inquiries = [
  { subject: "2 bedroom apartment", contact: "Nimal", status: "New" },
  { subject: "Family house in Kandy", contact: "Roshan", status: "Contacted" },
  { subject: "Commercial lease", contact: "Hasini", status: "Closed" }
];

export const settings = [
  "Review SLA targets",
  "Moderation alert routing",
  "Duplicate detection thresholds",
  "Verification expiry windows"
];
