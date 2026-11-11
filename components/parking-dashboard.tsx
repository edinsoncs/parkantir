"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CarFront,
  ChevronDown,
  CircleParking,
  Clock3,
  Database,
  Map,
  Menu,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import parkings from "@/data/parking/parkings.json";
import counts from "@/data/parking/parking_counts.json";
import predictions from "@/data/parking/parking_predictions.json";

type Prediction = (typeof predictions)[number];
type Parking = (typeof parkings)[number];
type ForecastRow = Prediction & { parking: Parking };

const DAYS = [...new Set(predictions.map((prediction) => prediction.day_of_week))];
const HOURS = [...new Set(predictions.map((prediction) => prediction.hour))].sort();
const CITY = parkings[0]?.city ?? "";

const statusStyle = {
  available: "bg-[#dff8e8] text-[#168044]",
  limited: "bg-[#fff1cb] text-[#a66a00]",
  full: "bg-[#ffe4e2] text-[#c8322d]",
  no_data: "bg-slate-100 text-slate-500",
} as const;

export function ParkingDashboard() {
  const [day, setDay] = useState(DAYS[0] ?? "");
  const [hour, setHour] = useState(HOURS[0] ?? "");
  const [parkingId, setParkingId] = useState("all");

  const current = useMemo(() => predictions.filter((prediction) =>
    prediction.day_of_week === day && prediction.hour === hour && (parkingId === "all" || prediction.parking_id === parkingId),
  ), [day, hour, parkingId]);

  const rows: ForecastRow[] = current
    .map((prediction) => ({
      ...prediction,
      parking: parkings.find((parking) => parking.parking_id === prediction.parking_id),
    }))
    .filter((row): row is ForecastRow => Boolean(row.parking));
  const totalCapacity = rows.reduce((sum, row) => sum + row.parking.capacity, 0);
  const available = rows.reduce((sum, row) => sum + (row.estimated_available_spots ?? 0), 0);
  const estimatedCars = rows.reduce((sum, row) => sum + (row.estimated_cars ?? 0), 0);
  const occupancy = totalCapacity ? Math.round((estimatedCars / totalCapacity) * 100) : 0;

  const chartSeries = HOURS.map((slot) => {
    const slotPredictions = predictions.filter((prediction) => prediction.day_of_week === day && prediction.hour === slot && (parkingId === "all" || prediction.parking_id === parkingId));
    const cars = slotPredictions.reduce((sum, item) => sum + (item.estimated_cars ?? 0), 0);
    const capacity = slotPredictions.reduce((sum, item) => sum + (parkings.find((parking) => parking.parking_id === item.parking_id)?.capacity ?? 0), 0);
    return { hour: slot, rate: capacity ? Math.round((cars / capacity) * 100) : 0 };
  });
  const peakPoint = chartSeries.reduce((peak, point) => point.rate > peak.rate ? point : peak, chartSeries[0] ?? { hour: "—", rate: 0 });
  const busiestParking = rows.reduce<ForecastRow | null>((busiest, row) =>
    !busiest || (row.estimated_occupancy_rate ?? 0) > (busiest.estimated_occupancy_rate ?? 0) ? row : busiest, null);
  const baselineRecords = Math.max(0, ...current.map((prediction) => prediction.based_on_records));
  const visibleHistoricalRecords = counts.filter((record) => parkingId === "all" || record.parking_id === parkingId).length;

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#111827]">
      <header className="sticky top-0 z-30 border-b border-[#e2e7ec] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1500px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="grid h-10 w-10 place-items-center rounded-xl bg-[#1677f2] text-white"><CarFront className="h-5 w-5" fill="currentColor" /></Link>
            <div><strong className="block text-sm tracking-tight">PARKANTIR</strong><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a94a1]">Forecast engine</span></div>
          </div>
          <nav className="hidden items-center gap-2 md:flex">
            <Link href="/maps" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#66717f] transition hover:bg-[#edf5ff] hover:text-[#1677f2]"><Map className="h-4 w-4" /> Map</Link>
            <span className="flex items-center gap-2 rounded-lg bg-[#edf5ff] px-4 py-2 text-sm font-semibold text-[#1677f2]"><BarChart3 className="h-4 w-4" /> Dashboard</span>
          </nav>
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-[#e1e6eb] md:hidden"><Menu className="h-5 w-5" /></button>
          <div className="hidden items-center gap-3 rounded-full border border-[#dfe5ea] bg-white px-4 py-2 text-xs font-semibold text-[#56616e] shadow-sm lg:flex"><i className="h-2 w-2 rounded-full bg-[#2daf60]" /> Historical model ready</div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8 lg:py-9">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1677f2]"><Sparkles className="h-4 w-4" /> AI Parking Availability Forecast</p><h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">{CITY} parking intelligence</h1><p className="mt-2 text-sm text-[#6d7784]">Forecasts from manual historical observations — never presented as real-time.</p></div>
          <div className="flex flex-wrap gap-2">
            <Select value={parkingId} onChange={setParkingId} icon={<CircleParking className="h-4 w-4" />}><option value="all">All parkings</option>{parkings.map((parking) => <option key={parking.parking_id} value={parking.parking_id}>{parking.name}</option>)}</Select>
            <Select value={day} onChange={setDay} icon={<CalendarDays className="h-4 w-4" />}>{DAYS.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</Select>
            <Select value={hour} onChange={setHour} icon={<Clock3 className="h-4 w-4" />}>{HOURS.map((item) => <option key={item}>{item}</option>)}</Select>
          </div>
        </div>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={<CircleParking />} label="Estimated available" value={available} suffix="spots" color="blue" />
          <Metric icon={<Activity />} label="Estimated occupancy" value={occupancy} suffix="%" color="green" />
          <Metric icon={<CarFront />} label="Estimated cars" value={estimatedCars} suffix="vehicles" color="amber" />
          <Metric icon={<Database />} label="Historical records" value={visibleHistoricalRecords} suffix="observations" color="slate" />
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
          <article className="rounded-2xl border border-[#e1e6eb] bg-white p-5 shadow-[0_10px_35px_rgba(35,50,65,.05)] sm:p-6">
            <div className="flex items-start justify-between"><div><h2 className="font-bold">Expected occupancy by hour</h2><p className="mt-1 text-xs text-[#89929e]">Historical average for {day}</p></div><span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#647181]">{baselineRecords}-record baseline</span></div>
            <div className="mt-8 flex h-[260px] items-end gap-2 border-b border-[#e7ebef] sm:gap-4">
              {chartSeries.map((point) => (
                <div key={point.hour} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="opacity-0 text-xs font-bold text-[#1677f2] transition group-hover:opacity-100">{point.rate}%</span>
                  <div className="w-full max-w-[58px] rounded-t-lg bg-[linear-gradient(180deg,#388df7,#1677f2)] transition-all group-hover:brightness-110" style={{ height: `${Math.max(8, point.rate * 2)}px` }} />
                  <span className="pb-3 text-[10px] font-semibold text-[#7c8794] sm:text-xs">{point.hour.slice(0, 2)}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl bg-[#111b2b] p-6 text-white shadow-[0_18px_50px_rgba(17,27,43,.16)]">
            <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#78aff8]">Forecast insight</p><h2 className="mt-2 text-2xl font-bold tracking-tight">Peak pressure at {peakPoint.hour}</h2></div><TrendingUp className="h-8 w-8 text-[#55df8a]" /></div>
            <p className="mt-5 text-sm leading-6 text-white/60">{busiestParking ? `${busiestParking.parking.name} has the highest estimated occupancy for ${day} at ${hour}.` : "There is not enough data for this selection."} The result is calculated only from the local historical dataset.</p>
            <div className="mt-8 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/[.06] p-4"><span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Model</span><strong className="mt-2 block text-sm">{current[0]?.model_type.replace("_", " ") ?? "No data"}</strong></div><div className="rounded-xl bg-white/[.06] p-4"><span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Confidence</span><strong className="mt-2 block text-sm capitalize text-[#55df8a]">{current[0]?.confidence ?? "no data"}</strong></div></div>
            <Link href="/maps" className="mt-6 flex items-center justify-between rounded-xl bg-[#1677f2] px-5 py-4 text-sm font-bold">Explore on map <ArrowRight className="h-4 w-4" /></Link>
          </article>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#e1e6eb] bg-white shadow-[0_10px_35px_rgba(35,50,65,.05)]">
          <div className="flex items-center justify-between border-b border-[#e7ebef] px-5 py-5 sm:px-6"><div><h2 className="font-bold">Parking forecast</h2><p className="mt-1 text-xs text-[#89929e]">{day}, {hour} · {CITY}</p></div><span className="hidden text-xs text-[#89929e] sm:block">{rows.length} locations</span></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-[#f8fafb] text-[10px] font-bold uppercase tracking-[0.11em] text-[#89929e]"><tr><th className="px-6 py-3">Parking</th><th className="px-4 py-3">Capacity</th><th className="px-4 py-3">Cars</th><th className="px-4 py-3">Available</th><th className="px-4 py-3">Occupancy</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Confidence</th></tr></thead>
              <tbody className="divide-y divide-[#edf0f2]">{rows.map((row) => <tr key={row.prediction_id} className="transition hover:bg-[#f8fbff]"><td className="px-6 py-4"><strong className="block">{row.parking.name}</strong><span className="mt-1 block text-xs text-[#89929e]">{row.parking.address}</span></td><td className="px-4 py-4 font-medium">{row.parking.capacity}</td><td className="px-4 py-4">{row.estimated_cars ?? "—"}</td><td className="px-4 py-4 text-lg font-bold">{row.estimated_available_spots ?? "—"}</td><td className="px-4 py-4"><div className="flex items-center gap-3"><div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#e8ecf0]"><i className="block h-full rounded-full bg-[#1677f2]" style={{ width: `${(row.estimated_occupancy_rate ?? 0) * 100}%` }} /></div>{Math.round((row.estimated_occupancy_rate ?? 0) * 100)}%</div></td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[row.status as keyof typeof statusStyle]}`}>{row.status.replace("_", " ")}</span></td><td className="px-4 py-4"><span className="inline-flex items-center gap-2 capitalize"><i className="h-2 w-2 rounded-full bg-[#2daf60]" />{row.confidence}</span></td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-[#8b949f]">Estimated availability based on historical parking patterns. Not real-time data.</p>
      </div>
    </main>
  );
}

function Select({ value, onChange, icon, children }: { value: string; onChange: (value: string) => void; icon: React.ReactNode; children: React.ReactNode }) {
  return <label className="relative flex items-center gap-2 rounded-xl border border-[#dfe5ea] bg-white px-3 shadow-sm"><span className="text-[#66717f]">{icon}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 max-w-[190px] appearance-none bg-transparent pr-7 text-xs font-semibold outline-none">{children}</select><ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-[#89929e]" /></label>;
}

function Metric({ icon, label, value, suffix, color }: { icon: React.ReactNode; label: string; value: number; suffix: string; color: "blue" | "green" | "amber" | "slate" }) {
  const palette = { blue: "bg-[#e7f1ff] text-[#1677f2]", green: "bg-[#e2f8e9] text-[#239c50]", amber: "bg-[#fff2cf] text-[#b97800]", slate: "bg-[#edf0f3] text-[#66717f]" };
  return <article className="flex items-center gap-4 rounded-2xl border border-[#e1e6eb] bg-white p-5 shadow-[0_8px_28px_rgba(35,50,65,.045)]"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl [&>svg]:h-5 [&>svg]:w-5 ${palette[color]}`}>{icon}</div><div><p className="text-xs font-medium text-[#7b8693]">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight">{value.toLocaleString()} <span className="text-xs font-medium text-[#9aa3ad]">{suffix}</span></p></div></article>;
}
