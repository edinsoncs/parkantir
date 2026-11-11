import parkings from "@/data/parking/parkings.json";
import predictions from "@/data/parking/parking_predictions.json";

export function getCurrentParkingStatus(parking_id: string, currentDay: string, currentHour: string | number) {
  const parking = parkings.find((item) => item.parking_id === parking_id);
  if (!parking) return null;

  const normalizedDay = currentDay.toLowerCase();
  const normalizedHour = typeof currentHour === "number"
    ? `${String(currentHour).padStart(2, "0")}:00`
    : currentHour.length === 2 ? `${currentHour}:00` : currentHour;
  const prediction = predictions.find((item) =>
    item.parking_id === parking_id && item.day_of_week === normalizedDay && item.hour === normalizedHour,
  );

  return {
    parking_id,
    name: parking.name,
    estimated_available_spots: prediction?.estimated_available_spots ?? null,
    status: prediction?.status ?? "no_data",
    confidence: prediction?.confidence ?? "no_data",
    price_per_hour: parking.price_per_hour,
    lat: parking.lat,
    lng: parking.lng,
    message: "Estimated availability based on historical parking patterns. Not real-time data.",
  };
}
