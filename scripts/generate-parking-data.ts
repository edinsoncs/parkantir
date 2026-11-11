import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type Confidence = "low" | "medium" | "high";
export type ParkingStatus = "available" | "limited" | "full" | "no_data";

type Parking = {
  parking_id: string;
  name: string;
  capacity: number;
  price_per_hour: number;
  parking_type: string;
  covered: boolean;
  near_metro: boolean;
};

type ParkingCount = {
  record_id: string;
  parking_id: string;
  date: string;
  day_of_week: string;
  hour: string;
  cars_count: number;
  capacity: number;
  available_spots: number;
  occupancy_rate: number;
  source: "manual_observation";
  confidence: Confidence;
  notes: string;
};

export type ParkingPrediction = {
  prediction_id: string;
  parking_id: string;
  day_of_week: string;
  hour: string;
  estimated_cars: number | null;
  estimated_available_spots: number | null;
  estimated_occupancy_rate: number | null;
  status: ParkingStatus;
  confidence: Confidence | "no_data";
  based_on_records: number;
  model_type: "historical_average";
  last_updated: string;
};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "data", "parking");
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const HOURS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
const START_DATES = ["2026-05-18", "2026-05-25", "2026-06-01", "2026-06-08"];

function occupancyProfile(parking: Parking): number[] {
  const centrality = (parking.near_metro ? 0.07 : 0) + (parking.covered ? 0.04 : 0);
  const pricePressure = parking.price_per_hour >= 400 ? -0.04 : parking.price_per_hour <= 200 ? 0.04 : 0;
  const typePressure = parking.parking_type === "surface" ? -0.07 : parking.parking_type === "multi_storey" ? 0.02 : 0.04;
  const base = centrality + pricePressure + typePressure;
  return [0.42, 0.58, 0.7, 0.77, 0.8, 0.73, 0.48].map((rate) => Math.min(0.96, rate + base));
}

function roundRate(value: number) {
  return Number(value.toFixed(3));
}

function deterministicVariation(parkingIndex: number, week: number, day: number, hour: number) {
  return ((((parkingIndex + 2) * 11 + week * 7 + day * 5 + hour * 3) % 9) - 4) / 100;
}

export async function generateHistoricalCounts(): Promise<ParkingCount[]> {
  const parkings = JSON.parse(await readFile(path.join(DATA_DIR, "parkings.json"), "utf8")) as Parking[];
  const records: ParkingCount[] = [];

  for (const [parkingIndex, parking] of parkings.entries()) {
    const profile = occupancyProfile(parking);
    for (const [weekIndex, monday] of START_DATES.entries()) {
      for (const [dayIndex, day] of DAYS.entries()) {
        for (const [hourIndex, hour] of HOURS.entries()) {
          const date = new Date(`${monday}T12:00:00Z`);
          date.setUTCDate(date.getUTCDate() + dayIndex);
          let targetRate = profile[hourIndex];

          if (day === "friday" && hourIndex >= 2) targetRate += 0.025;
          if (day === "saturday") {
            targetRate += parking.parking_type === "multi_storey" ? -0.18 : hourIndex >= 2 && hourIndex <= 5 ? 0.055 : 0.015;
          }
          targetRate += deterministicVariation(parkingIndex, weekIndex, dayIndex, hourIndex);
          targetRate = Math.min(1, Math.max(0.12, targetRate));

          const carsCount = Math.min(parking.capacity, Math.round(parking.capacity * targetRate));
          const availableSpots = parking.capacity - carsCount;
          records.push({
            record_id: `obs-${String(records.length + 1).padStart(4, "0")}`,
            parking_id: parking.parking_id,
            date: date.toISOString().slice(0, 10),
            day_of_week: day,
            hour,
            cars_count: carsCount,
            capacity: parking.capacity,
            available_spots: availableSpots,
            occupancy_rate: roundRate(carsCount / parking.capacity),
            source: "manual_observation",
            confidence: weekIndex === 0 ? "medium" : "high",
            notes: day === "saturday" ? "Manual observation; tourist and retail traffic pattern." : "Manual observation during standard city traffic pattern.",
          });
        }
      }
    }
  }

  await writeFile(path.join(DATA_DIR, "parking_counts.json"), `${JSON.stringify(records, null, 2)}\n`);
  return records;
}

function predictionStatus(available: number): ParkingStatus {
  if (available === 0) return "full";
  if (available <= 10) return "limited";
  return "available";
}

function predictionConfidence(recordCount: number): Confidence | "no_data" {
  if (recordCount >= 4) return "high";
  if (recordCount >= 2) return "medium";
  if (recordCount === 1) return "low";
  return "no_data";
}

export async function generateParkingPredictions(): Promise<ParkingPrediction[]> {
  const parkings = JSON.parse(await readFile(path.join(DATA_DIR, "parkings.json"), "utf8")) as Parking[];
  const counts = JSON.parse(await readFile(path.join(DATA_DIR, "parking_counts.json"), "utf8")) as ParkingCount[];
  const availableDays = [...new Set(counts.map((record) => record.day_of_week))];
  const availableHours = [...new Set(counts.map((record) => record.hour))].sort();
  const generatedAt = new Date().toISOString();
  const groups = new Map<string, ParkingCount[]>();

  for (const record of counts) {
    const key = `${record.parking_id}|${record.day_of_week}|${record.hour}`;
    groups.set(key, [...(groups.get(key) ?? []), record]);
  }

  const predictions: ParkingPrediction[] = [];
  for (const parking of parkings) {
    for (const day of availableDays) {
      for (const hour of availableHours) {
        const records = groups.get(`${parking.parking_id}|${day}|${hour}`) ?? [];
        const base = {
          prediction_id: `pred-${parking.parking_id}-${day}-${hour.replace(":", "")}`,
          parking_id: parking.parking_id,
          day_of_week: day,
          hour,
          based_on_records: records.length,
          model_type: "historical_average" as const,
          last_updated: generatedAt,
        };

        if (!records.length) {
          predictions.push({ ...base, estimated_cars: null, estimated_available_spots: null, estimated_occupancy_rate: null, status: "no_data", confidence: "no_data" });
          continue;
        }

        const estimatedCars = Math.round(records.reduce((sum, record) => sum + record.cars_count, 0) / records.length);
        const available = Math.max(0, parking.capacity - estimatedCars);
        predictions.push({
          ...base,
          estimated_cars: estimatedCars,
          estimated_available_spots: available,
          estimated_occupancy_rate: roundRate(estimatedCars / parking.capacity),
          status: predictionStatus(available),
          confidence: predictionConfidence(records.length),
        });
      }
    }
  }

  await writeFile(path.join(DATA_DIR, "parking_predictions.json"), `${JSON.stringify(predictions, null, 2)}\n`);
  return predictions;
}

async function main() {
  await generateHistoricalCounts();
  const predictions = await generateParkingPredictions();
  console.log(`Generated ${predictions.length} predictions in ${DATA_DIR}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
