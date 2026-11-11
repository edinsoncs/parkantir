import { ParkingDashboard } from "@/components/parking-dashboard";

export const metadata = {
  title: "Forecast Dashboard | Parkantir",
  description: "Historical parking availability forecasts for central Moscow.",
};

export default function DashboardPage() {
  return <ParkingDashboard />;
}
