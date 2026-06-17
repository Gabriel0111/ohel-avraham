import { redirect } from "next/navigation";

// The dashboard landing was a redundant hub (a duplicate of the community
// hero plus shortcuts to sibling tabs already in the nav). The account page
// is the canonical entry point.
export default function DashboardPage() {
  redirect("/dashboard/profile");
}
