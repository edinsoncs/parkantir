import { ParkingMap } from "@/components/parking-map";
import "mapbox-gl/dist/mapbox-gl.css";

export const metadata = {
  title: "Moscow Parking Map | Parkantir",
  description: "Parking availability analysis across central Moscow.",
};

export default function MapsPage() {
  return <ParkingMap accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ""} />;
}
