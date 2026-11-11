import zonesData from "@/data/parking/zones.json";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LngLat = [number, number];

export type ParkingZoneStatus = "available" | "limited" | "full";

export type SpotState = "free" | "occupied" | "reserved";

export type ParkingSpot = {
  id: string;
  coordinates: LngLat;
  state: SpotState;
};

export type ParkingZone = {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
  currency: string;
  capacity: number;
  timezone: string;
  open24h: boolean;
  operatingHours: { start: string; end: string };
  geometry: {
    type: "LineString";
    coordinates: LngLat[];
  };
  bearing: number;
  midpoint: LngLat;
  available: number;
  occupied: number;
  status: ParkingZoneStatus;
  spots: ParkingSpot[];
  snapshot: {
    date: string;
    day: string;
    hour: string;
    timestamp: number;
  };
};

export type ZoneStatus = {
  key: ParkingZoneStatus;
  label: string;
  color: string;
  soft: string;
  text: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const STATUS: Record<ParkingZoneStatus, ZoneStatus> = {
  available: { key: "available", label: "Available", color: "#3CB371", soft: "#E6F6EE", text: "#1B8A4C" },
  limited:   { key: "limited",   label: "Limited",   color: "#F5A623", soft: "#FFF3DC", text: "#B8780B" },
  full:      { key: "full",      label: "Full",      color: "#E74C3C", soft: "#FBEAE8", text: "#C0392B" },
};

export const SPOT_STYLE: Record<SpotState, { color: string; soft: string; label: string }> = {
  free:      { color: "#3CB371", soft: "#E6F6EE", label: "Free" },
  occupied:  { color: "#2C3E50", soft: "#2C3E50", label: "Occupied" },
  reserved:  { color: "#F5A623", soft: "#FFF3DC", label: "Reserved" },
};

export const LEGEND = Object.values(STATUS).map((s) => ({
  label: s.label,
  color: s.color,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function midpoint(coords: LngLat[]): LngLat {
  const mid = coords[Math.floor((coords.length - 1) / 2)];
  return mid ?? coords[0];
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Street bearing (degrees, 0 = north, clockwise) from the first to last
 * coordinate of the LineString. Used to rotate car icons to match the
 * diagonal street orientation.
 */
function bearingOf(coords: LngLat[]): number {
  if (coords.length < 2) return 0;
  const [lng1, lat1] = coords[0];
  const [lng2, lat2] = coords[coords.length - 1];
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

/**
 * Realistic 24-hour occupancy model (always open):
 *
 *  Weekday:
 *   00-06  night          ~12%
 *   07     early commute  ~45%
 *   08-10  morning rush  ~85%
 *   11-13  midday        ~60%
 *   14-16  afternoon     ~65%
 *   17-19  evening rush  ~90%
 *   20-22  evening       ~35%
 *   23     late night    ~18%
 *
 *  Weekend:
 *   00-09  early          ~15%
 *   10-14  brunch         ~50%
 *   15-20  afternoon      ~65%
 *   21-23  evening        ~30%
 */
function occupancyRatio(day: string, hour: number): number {
  const isWeekend = day === "saturday" || day === "sunday";

  if (isWeekend) {
    if (hour >= 10 && hour <= 14) return 0.50;
    if (hour >= 15 && hour <= 20) return 0.65;
    if (hour >= 21 || hour < 10)  return 0.15;
    return 0.30;
  }

  if (hour === 7)             return 0.45;
  if (hour >= 8 && hour <= 10) return 0.85;
  if (hour >= 11 && hour <= 13) return 0.60;
  if (hour >= 14 && hour <= 16) return 0.65;
  if (hour >= 17 && hour <= 19) return 0.90;
  if (hour >= 20 && hour <= 22) return 0.35;
  if (hour === 23)             return 0.18;
  return 0.12;
}

function isOperatingNow(
  open24h: boolean,
  start: string,
  end: string,
  hour: number,
  minute: number,
): boolean {
  if (open24h) return true;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const now = hour * 60 + minute;
  return now >= sh * 60 + sm && now < eh * 60 + em;
}

function computeSpots(
  zoneId: string,
  rawSpots: { spot_id: string; lng: number; lat: number }[],
  ratio: number,
  seedHour: number,
): { spots: ParkingSpot[]; occupied: number } {
  let occupied = 0;
  const spots: ParkingSpot[] = rawSpots.map((raw) => {
    const seed = hashString(`${zoneId}:${raw.spot_id}:${seedHour}`);
    const threshold = ratio * 1000;
    const isOccupied = (seed % 1000) < threshold;
    const isReserved = !isOccupied && (seed % 19) === 0 && ratio > 0.4;
    let state: SpotState = "free";
    if (isOccupied) {
      state = "occupied";
      occupied += 1;
    } else if (isReserved) {
      state = "reserved";
    }
    return {
      id: raw.spot_id,
      coordinates: [raw.lng, raw.lat],
      state,
    };
  });
  return { spots, occupied };
}

function resolveStatus(available: number, capacity: number): ParkingZoneStatus {
  if (available === 0) return "full";
  if (available <= Math.ceil(capacity * 0.25)) return "limited";
  return "available";
}

export function getZoneStatus(zone: ParkingZone): ZoneStatus {
  return STATUS[zone.status];
}

// ─── Center ───────────────────────────────────────────────────────────────────

export const PARKING_CENTER: LngLat = (() => {
  const all = zonesData.flatMap((z) => z.geometry.coordinates) as LngLat[];
  const lng = all.reduce((s, c) => s + c[0], 0) / all.length;
  const lat = all.reduce((s, c) => s + c[1], 0) / all.length;
  return [lng, lat];
})();

// ─── GeoJSON builder (zone line) ─────────────────────────────────────────────

type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    id: string;
    properties: Record<string, unknown>;
    geometry: { type: "LineString"; coordinates: LngLat[] };
  }[];
};

export function buildGeoJSON(zones: ParkingZone[]): GeoJSONFeatureCollection {
  return {
    type: "FeatureCollection",
    features: zones.map((zone) => ({
      type: "Feature",
      id: zone.id,
      properties: {
        id:        zone.id,
        status:    zone.status,
        color:     STATUS[zone.status].color,
        available: zone.available,
        capacity:  zone.capacity,
      },
      geometry: zone.geometry,
    })),
  };
}

// ─── GeoJSON builder (spots as points) ────────────────────────────────────────

type SpotFeatureCollection = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    properties: { id: string; state: SpotState; color: string; bearing: number };
    geometry: { type: "Point"; coordinates: LngLat };
  }[];
};

export function buildSpotsGeoJSON(zone: ParkingZone): SpotFeatureCollection {
  return {
    type: "FeatureCollection",
    features: zone.spots.map((spot) => ({
      type: "Feature",
      properties: {
        id:      spot.id,
        state:   spot.state,
        color:   SPOT_STYLE[spot.state].color,
        bearing: zone.bearing,
      },
      geometry: { type: "Point", coordinates: spot.coordinates },
    })),
  };
}

// ─── Data fetch ───────────────────────────────────────────────────────────────

export async function fetchParkingData(): Promise<ParkingZone[]> {
  const now = new Date();
  const day  = now.toLocaleDateString("en-US", { weekday: "long", timeZone: "Europe/Moscow" }).toLowerCase();
  const hour = Number(now.toLocaleString("en-US", { hour: "2-digit", hour12: false, timeZone: "Europe/Moscow" }));
  const minute = now.getMinutes();
  const hourLabel = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const dateLabel = now.toLocaleDateString("en-GB", { timeZone: "Europe/Moscow" });

  return zonesData.map((raw) => {
    const rawSpots = (raw as unknown as { spots: { spot_id: string; lng: number; lat: number }[] }).spots;
    const isOpen = isOperatingNow(
      (raw as unknown as { open_24h: boolean }).open_24h,
      raw.operating_hours.start,
      raw.operating_hours.end,
      hour,
      minute,
    );
    const ratio = isOpen ? occupancyRatio(day, hour) : 0;
    const { spots, occupied } = computeSpots(raw.parking_zone_id, rawSpots, ratio, hour);
    const available = raw.capacity - occupied;
    const status = resolveStatus(available, raw.capacity);
    const coords = raw.geometry.coordinates as LngLat[];

    return {
      id:            raw.parking_zone_id,
      name:          raw.name,
      type:          raw.type,
      pricePerHour:  raw.price_per_hour,
      currency:      raw.currency,
      capacity:      raw.capacity,
      timezone:      raw.timezone,
      open24h:       (raw as unknown as { open_24h: boolean }).open_24h,
      operatingHours: raw.operating_hours,
      geometry: { type: "LineString" as const, coordinates: coords },
      bearing:       bearingOf(coords),
      midpoint:      midpoint(coords),
      available,
      occupied,
      status,
      spots,
      snapshot: { date: dateLabel, day, hour: hourLabel, timestamp: now.getTime() },
    };
  });
}
