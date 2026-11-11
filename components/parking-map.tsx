"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Crosshair, Loader2, Minus, Plus } from "lucide-react";
import {
  buildGeoJSON,
  buildSpotsGeoJSON,
  fetchParkingData,
  PARKING_CENTER,
  STATUS,
  SPOT_STYLE,
  type ParkingZone,
} from "@/lib/parking-data";

type LoadStatus = "loading" | "ready" | "error";

const ZONE_SOURCE = "parking-zones";
const SPOTS_SOURCE = "parking-spots";
const LAYER_GLOW   = "zones-glow";
const LAYER_CASE   = "zones-casing";
const LAYER_LINE   = "zones-line";
const LAYER_SPOTS  = "spots-circle";
const LAYER_HIT    = "spots-hit";

// ── Car icon (top-down, pointing up) ───────────────────────────────────────────
const CAR_OCCUPIED = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <rect x="15" y="3" width="10" height="34" rx="5" fill="CURRENT"/>
  <rect x="13" y="10" width="14" height="5" rx="2.5" fill="#fff" opacity="0.2"/>
  <rect x="13" y="25" width="14" height="5" rx="2.5" fill="#fff" opacity="0.2"/>
</svg>`;

const CAR_FREE = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <rect x="16" y="4" width="8" height="32" rx="4" fill="none" stroke="CURRENT" stroke-width="2" stroke-dasharray="4 3"/>
</svg>`;

function svgToDataUri(svg: string, color: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/CURRENT/g, color))}`;
}

// ── Yandex-style floating badge ─────────────────────────────────────────────────
function createYandexBadge(zone: ParkingZone): HTMLDivElement {
  const s = STATUS[zone.status];
  const el = document.createElement("div");
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.setAttribute("aria-label", `${zone.name}: ${zone.available} of ${zone.capacity} free`);

  const bg = s.color;
  el.style.cssText = `
    all: unset;
    display: flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 14px 0 12px;
    border-radius: 18px;
    background: ${bg};
    color: #FFFFFF;
    font-family: var(--font-display, sans-serif);
    font-weight: 900;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15);
    border: 2.5px solid #FFFFFF;
    transition: transform 150ms ease, box-shadow 150ms ease;
    white-space: nowrap;
    user-select: none;
  `;

  const num = document.createElement("span");
  num.textContent = String(zone.available);
  el.appendChild(num);

  const dot = document.createElement("span");
  dot.style.cssText = "width:7px;height:7px;border-radius:50%;background:#fff;opacity:0.7;";
  el.appendChild(dot);

  const label = document.createElement("span");
  label.style.cssText = "font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;opacity:0.85;";
  label.textContent = `₽${zone.pricePerHour}`;
  el.appendChild(label);

  el.addEventListener("mouseenter", () => {
    el.style.transform = "scale(1.06)";
    el.style.boxShadow = "0 5px 16px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)";
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "scale(1)";
    el.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)";
  });

  return el;
}

export function ParkingMap({ accessToken }: { accessToken: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const badgeRef      = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded,  setMapLoaded]  = useState(false);
  const [zone,       setZone]       = useState<ParkingZone | null>(null);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoadStatus("loading");
    fetchParkingData()
      .then((data) => {
        if (cancelled) return;
        setZone(data[0] ?? null);
        setLoadStatus("ready");
      })
      .catch(() => { if (!cancelled) setLoadStatus("error"); });
    return () => { cancelled = true; };
  }, []);

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!accessToken || !mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = accessToken;
    const instance = new mapboxgl.Map({
      container:          mapContainer.current,
      style:              "mapbox://styles/mapbox/streets-v12",
      center:             PARKING_CENTER,
      zoom:               17.8,
      pitch:              45,
      bearing:            -42,
      attributionControl: false,
    });
    instance.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-right",
    );
    mapRef.current = instance;

    const resize = () => instance.resize();
    instance.once("load", resize);
    const ro = new ResizeObserver(resize);
    if (mapContainer.current) ro.observe(mapContainer.current);
    window.addEventListener("resize", resize);

    instance.on("load", () => {
      // Sources
      instance.addSource(ZONE_SOURCE, {
        type:      "geojson",
        data:      { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });
      instance.addSource(SPOTS_SOURCE, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Car images (async load)
      const addImg = (id: string, uri: string) => {
        instance.loadImage(uri, (err, img) => {
          if (!err && img && !instance.hasImage(id)) instance.addImage(id, img);
        });
      };
      addImg("car-occupied", svgToDataUri(CAR_OCCUPIED, "#2C3E50"));
      addImg("car-free",     svgToDataUri(CAR_FREE, "#3CB371"));
      addImg("car-reserved", svgToDataUri(CAR_OCCUPIED, "#F5A623"));

      // Zone glow
      instance.addLayer({
        id:     LAYER_GLOW,
        type:   "line",
        source: ZONE_SOURCE,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color":   ["get", "color"],
          "line-width":   ["interpolate", ["linear"], ["zoom"], 15, 12, 20, 30],
          "line-opacity": 0.1,
          "line-blur":    6,
        },
      });

      // Zone casing (white outline — Yandex style)
      instance.addLayer({
        id:     LAYER_CASE,
        type:   "line",
        source: ZONE_SOURCE,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color":   "#FFFFFF",
          "line-width":   ["interpolate", ["linear"], ["zoom"], 15, 8, 20, 18],
          "line-opacity": 0.9,
        },
      });

      // Zone main line
      instance.addLayer({
        id:     LAYER_LINE,
        type:   "line",
        source: ZONE_SOURCE,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color":   ["get", "color"],
          "line-width":   ["interpolate", ["linear"], ["zoom"], 15, 4, 20, 10],
          "line-opacity": 0.85,
        },
      });

      // Spot hit area
      instance.addLayer({
        id:     LAYER_HIT,
        type:   "circle",
        source: SPOTS_SOURCE,
        paint: { "circle-radius": ["interpolate", ["linear"], ["zoom"], 15, 8, 20, 16], "circle-opacity": 0 },
      });

      // Spots — car icons rotated to street bearing
      instance.addLayer({
        id:     LAYER_SPOTS,
        type:   "symbol",
        source: SPOTS_SOURCE,
        layout: {
          "icon-image": [
            "case",
            ["==", ["get", "state"], "occupied"], "car-occupied",
            ["==", ["get", "state"], "reserved"],  "car-reserved",
            "car-free",
          ],
          "icon-size":              ["interpolate", ["linear"], ["zoom"], 15, 0.45, 20, 0.9],
          "icon-rotate":            ["get", "bearing"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap":      true,
          "icon-ignore-placement":   true,
        },
      });

      // Spot hover cursor
      instance.on("mouseenter", LAYER_HIT, () => { instance.getCanvas().style.cursor = "pointer"; });
      instance.on("mouseleave", LAYER_HIT, () => { instance.getCanvas().style.cursor = ""; });

      setMapLoaded(true);
    });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
      if (badgeRef.current) badgeRef.current.remove();
      badgeRef.current = null;
      instance.remove();
      mapRef.current = null;
    };
  }, [accessToken]);

  // ── Sync data + badge ─────────────────────────────────────────────────────
  const syncMap = useCallback(() => {
    const instance = mapRef.current;
    if (!instance || !mapLoaded) return;

    const zs = zone ? [zone] : [];
    const zoneSource = instance.getSource(ZONE_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    if (zoneSource) zoneSource.setData(buildGeoJSON(zs));

    const spotSource = instance.getSource(SPOTS_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    if (spotSource) {
      spotSource.setData(zone ? buildSpotsGeoJSON(zone) : { type: "FeatureCollection", features: [] });
    }

    // Yandex-style floating badge at midpoint
    if (badgeRef.current) {
      badgeRef.current.remove();
      badgeRef.current = null;
    }
    if (zone) {
      const el = createYandexBadge(zone);
      badgeRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat(zone.midpoint)
        .addTo(instance);
    }
  }, [mapLoaded, zone]);

  useEffect(() => {
    syncMap();
  }, [syncMap]);

  const hasMap = Boolean(accessToken);

  return (
    <main className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#EAEAE5] font-sans text-[#0A0A0A]">
      {/* ── Minimal top bar (Yandex style) ─────────────────────────────────── */}
      <header className="z-30 flex h-[48px] shrink-0 items-center gap-2.5 border-b border-[#0A0A0A]/8 bg-[#FFFFFF] px-4">
        <a href="/" className="shrink-0">
          <img src="/logopkr.png" alt="Parkantir" className="block h-5.5 w-auto" />
        </a>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F4F0] px-2.5 py-0.5 text-[0.56rem] font-black uppercase tracking-[0.08em] text-[#0A0A0A]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3CB371] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3CB371]" />
          </span>
          24h · Moscow
        </div>
        {zone && (
          <div className="ml-auto flex items-center gap-1.5 text-xs font-bold text-[#0A0A0A]">
            <Clock time={zone.snapshot.hour} day={zone.snapshot.day} date={zone.snapshot.date} />
          </div>
        )}
      </header>

      {/* ── Map ────────────────────────────────────────────────────────────── */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {hasMap ? (
          <div ref={mapContainer} className="absolute inset-0 h-full w-full" />
        ) : (
          <NoTokenState />
        )}

        {loadStatus === "loading" && hasMap && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-[#EAEAE5]/50 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 rounded-xl border border-[#0A0A0A]/8 bg-[#FFFFFF] px-5 py-3.5 shadow-[0_6px_24px_rgba(10,10,10,0.1)]">
              <Loader2 className="h-4.5 w-4.5 animate-spin text-[#0A0A0A]" />
              <p className="text-xs font-black uppercase tracking-[0.08em]">Loading</p>
            </div>
          </div>
        )}

        {hasMap && loadStatus === "ready" && (
          <Toolbar
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            onRecenter={() =>
              mapRef.current?.flyTo({ center: PARKING_CENTER, zoom: 17.8, bearing: -42, pitch: 45, duration: 900 })
            }
          />
        )}

        {/* ── Floating info strip (top-left, Yandex style) ─────────────────── */}
        {zone && loadStatus === "ready" && <InfoStrip zone={zone} />}

        {/* ── Spots legend (bottom-left) ──────────────────────────────────── */}
        {zone && loadStatus === "ready" && <SpotLegend />}
      </div>
    </main>
  );
}

// ─── Live clock ────────────────────────────────────────────────────────────────

function Clock({ time, day, date }: { time: string; day: string; date: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F4F0] px-2.5 py-1 text-[0.62rem] font-black">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3CB371] opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3CB371]" />
      </span>
      <span className="text-[#1B8A4C]">{time}</span>
      <span className="text-[#9A9A9A]">·</span>
      <span className="capitalize text-[#0A0A0A]">{day}</span>
      <span className="text-[#9A9A9A]">·</span>
      <span className="text-[#757575]">{date}</span>
    </span>
  );
}

// ─── Info strip (top-left floating) ────────────────────────────────────────────

function InfoStrip({ zone }: { zone: ParkingZone }) {
  const s = STATUS[zone.status];
  const free = zone.available > 0;

  return (
    <div className="absolute left-3 top-3 z-20 max-w-[260px] rounded-2xl border border-[#0A0A0A]/8 bg-[#FFFFFF] p-3.5 shadow-[0_6px_24px_rgba(10,10,10,0.12)]">
      <p className="truncate text-sm font-black leading-tight">{zone.name}</p>
      <p className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.06em] text-[#9A9A9A]">
        {zone.type.replace(/_/g, " ")} · 24h
      </p>

      <div className="mt-3 flex items-end gap-2">
        <span className="font-[family-name:var(--font-display)] text-4xl font-black leading-none" style={{ color: s.color }}>
          {zone.available}
        </span>
        <span className="mb-1 text-[0.66rem] font-black uppercase tracking-[0.04em] text-[#0A0A0A]">
          {free ? "free" : "full"}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-[0.56rem] font-black uppercase tracking-[0.06em]"
          style={{ color: s.text, background: s.soft }}
        >
          {s.label}
        </span>
        <span className="text-[0.62rem] font-bold text-[#757575]">
          {zone.occupied}/{zone.capacity} occupied
        </span>
      </div>

      {/* Mini spot bar */}
      <div className="mt-3 flex gap-0.5">
        {zone.spots.map((spot) => (
          <div
            key={spot.id}
            title={`${spot.id} · ${SPOT_STYLE[spot.state].label}`}
            className="h-2 flex-1 rounded-sm transition-all"
            style={{ background: SPOT_STYLE[spot.state].color }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[0.54rem] font-bold text-[#9A9A9A]">
        <span>₽{zone.pricePerHour}/{zone.currency} · hr</span>
        <span>{zone.spots.length} spots</span>
      </div>
    </div>
  );
}

// ─── Spot legend (bottom-left) ─────────────────────────────────────────────────

function SpotLegend() {
  return (
    <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 rounded-xl border border-[#0A0A0A]/8 bg-[#FFFFFF]/90 px-3 py-2 shadow-[0_4px_16px_rgba(10,10,10,0.1)] backdrop-blur-md">
      {(["free", "occupied", "reserved"] as const).map((key) => {
        const st = SPOT_STYLE[key];
        return (
          <span key={key} className="inline-flex items-center gap-1.5 text-[0.58rem] font-black uppercase tracking-[0.04em] text-[#0A0A0A]">
            <i className="h-2.5 w-2.5 rounded-full" style={{ background: st.color }} />
            {st.label}
          </span>
        );
      })}
    </div>
  );
}

// ─── Toolbar ───────────────────────────────────────────────────────────────────

function Toolbar({
  onZoomIn,
  onZoomOut,
  onRecenter,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
}) {
  return (
    <>
      <div className="absolute right-3 top-3 z-20 flex flex-col overflow-hidden rounded-xl border border-[#0A0A0A]/8 bg-[#FFFFFF] shadow-[0_4px_16px_rgba(10,10,10,0.1)]">
        <button type="button" onClick={onZoomIn} aria-label="Zoom in"
          className="grid h-10 w-10 place-items-center border-b border-[#0A0A0A]/6 text-[#0A0A0A] transition hover:bg-[#F4F4F0]">
          <Plus className="h-4 w-4" />
        </button>
        <button type="button" onClick={onZoomOut} aria-label="Zoom out"
          className="grid h-10 w-10 place-items-center text-[#0A0A0A] transition hover:bg-[#F4F4F0]">
          <Minus className="h-4 w-4" />
        </button>
      </div>
      <button type="button" onClick={onRecenter} aria-label="Recenter"
        className="absolute right-3 top-[96px] z-20 grid h-10 w-10 place-items-center rounded-xl border border-[#0A0A0A]/8 bg-[#FFFFFF] shadow-[0_4px_16px_rgba(10,10,10,0.1)] transition hover:bg-[#F4F4F0]">
        <Crosshair className="h-4 w-4 text-[#0A0A0A]" />
      </button>
    </>
  );
}

// ─── No token ──────────────────────────────────────────────────────────────────

function NoTokenState() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#EAEAE5_0%,#DCDCD5_100%)]">
      <div className="max-w-[320px] text-center">
        <p className="text-base font-black uppercase tracking-[0.04em]">Mapbox token required</p>
        <p className="mt-2 text-sm font-semibold text-[#757575]">
          Add <code className="rounded bg-[#0A0A0A] px-1.5 py-0.5 text-xs text-[#3CB371]">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to .env
        </p>
      </div>
    </div>
  );
}
