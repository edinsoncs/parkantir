"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Battery,
  Car,
  Clock,
  MapPin,
  Navigation,
  Radar,
  Signal,
  Star,
  Wifi,
} from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cities = ["Moscow", "Tverskaya", "Arbat", "Garden Ring", "Patriarshie"];

function PhoneStatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 text-[0.7rem] font-bold text-[#FFFFFF]">
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <Signal className="h-3 w-3" aria-hidden="true" />
        <Wifi className="h-3 w-3" aria-hidden="true" />
        <Battery className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </div>
  );
}

function MiniMap() {
  return (
    <div className="relative mt-3 h-[180px] overflow-hidden rounded-xl border border-[#FFFFFF]/12 bg-[#101010]">
      <div className="absolute inset-0 bg-[linear-gradient(35deg,transparent_0_41%,#1d1d1d_41.5%_43%,transparent_43.5%),linear-gradient(145deg,transparent_0_52%,#1d1d1d_52.5%_54%,transparent_54.5%),linear-gradient(90deg,transparent_0_26%,#161616_26.5%_28%,transparent_28.5%),linear-gradient(0deg,transparent_0_68%,#161616_68.5%_70%,transparent_70.5%)]" />
      <div className="absolute left-4 top-4 h-1 w-24 rounded-full bg-[#00C7AE]/30" />
      <div className="absolute left-4 top-4 h-1 w-24 rounded-full bg-[#00C7AE]" />
      <div className="absolute bottom-6 left-10 h-1 w-16 rounded-full bg-[#FFEE00]/30" />
      <div className="absolute bottom-6 left-10 h-1 w-16 rounded-full bg-[#FFEE00]" />

      <motion.div
        className="absolute bottom-10 left-12 grid h-12 w-20 place-items-center rounded-2xl border border-[#FFFFFF]/20 bg-[#0A0A0A] text-[#FFFFFF] shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
        animate={{ x: [0, 60, 110] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Car className="h-6 w-6" aria-hidden="true" />
      </motion.div>

      <span className="absolute left-7 top-10 grid h-7 w-7 -rotate-45 place-items-center rounded-[50%_50%_50%_10%] border-2 border-[#0A0A0A] bg-[#00C7AE] text-[0.6rem] font-black shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
        <span className="rotate-45">P</span>
      </span>
      <span className="absolute right-12 top-12 grid h-6 w-6 -rotate-45 place-items-center rounded-[50%_50%_50%_10%] border-2 border-[#0A0A0A] bg-[#FFEE00] shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />

      <motion.span
        className="absolute bottom-16 right-20 grid h-6 w-6 -rotate-45 place-items-center rounded-[50%_50%_50%_10%] border-2 border-[#0A0A0A] bg-[#00C7AE]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.3, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function SpotGrid() {
  const slots = [
    { state: "free" },
    { state: "busy" },
    { state: "free" },
    { state: "reserved" },
    { state: "free" },
    { state: "busy" },
    { state: "free" },
    { state: "free" },
  ];
  return (
    <div className="mt-3 grid grid-cols-8 gap-1.5">
      {slots.map((slot, i) => (
        <motion.div
          key={i}
          className={`h-7 rounded-md ${
            slot.state === "free"
              ? "bg-[#00C7AE]"
              : slot.state === "busy"
                ? "bg-[#FFFFFF]/12"
                : "bg-[#FFEE00]"
          }`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.06, duration: 0.3 }}
        />
      ))}
    </div>
  );
}

function AppMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[420px]"
    >
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[3rem] bg-[#00F0D1]/10 blur-3xl"
      />

      <div className="absolute -right-5 -top-3 z-20 rounded-full bg-[#FFEE00] px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.1em] text-[#0A0A0A] shadow-[3px_3px_0_#0A0A0A]">
        Demo
      </div>

      <div className="relative overflow-hidden rounded-[2.4rem] border-[6px] border-[#0A0A0A] bg-[#0A0A0A] shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
        <PhoneStatusBar />

        <div className="px-5 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#00F0D1]">
                Live radar
              </p>
              <p className="mt-1 text-lg font-black leading-none text-[#FFFFFF]">
                Tverskaya area
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00C7AE]/15 px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#00C7AE]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00C7AE] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00C7AE]" />
              </span>
              Live
            </span>
          </div>

          <MiniMap />

          <div className="mt-3 flex items-center justify-between rounded-xl border border-[#FFFFFF]/10 bg-[#141414] px-3.5 py-2.5">
            <span className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.08em] text-[#FFFFFF]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00C7AE]" />
              Free
            </span>
            <span className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.08em] text-[#FFFFFF]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFEE00]" />
              Reserved
            </span>
            <span className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.08em] text-[#FFFFFF]/50">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFFFFF]/15" />
              Busy
            </span>
          </div>

          <SpotGrid />

          <div className="mt-3 flex items-center justify-between rounded-xl border border-[#00C7AE]/30 bg-[#00C7AE]/10 px-3.5 py-3">
            <div>
              <p className="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#00C7AE]">
                Nearest free spot
              </p>
              <p className="mt-0.5 text-sm font-black text-[#FFFFFF]">
                2 min · 180m
              </p>
            </div>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#00C7AE] text-[#0A0A0A]">
              <Navigation className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute -left-10 top-16 z-30 w-[190px] rounded-xl border border-[#0A0A0A] bg-[#FFFFFF] p-3.5 shadow-[8px_8px_0_#00C7AE]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-[0.6rem] font-black uppercase tracking-[0.12em] text-[#757575]">
          Prediction
        </p>
        <div className="mt-2 flex items-end gap-1">
          <p className="font-[family-name:var(--font-display)] text-3xl font-black leading-none text-[#0A0A0A]">
            82%
          </p>
          <p className="mb-0.5 text-[0.6rem] font-bold text-[#008F7D]">
            ▲ odds
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#ECECEC]">
          <motion.div
            className="h-full rounded-full bg-[#00C7AE]"
            initial={{ width: "0%" }}
            animate={{ width: "82%" }}
            transition={{ duration: 1.1, delay: 0.9, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute -right-8 bottom-16 z-30 flex items-center gap-2 rounded-full border border-[#FFFFFF]/15 bg-[#0A0A0A]/85 px-3.5 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-md"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FFEE00] text-[#0A0A0A]">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span className="text-left leading-none text-[#FFFFFF]">
          <span className="block text-[0.55rem] font-black uppercase tracking-[0.1em] text-[#00F0D1]">
            ETA
          </span>
          <span className="mt-0.5 block text-xs font-black">2 min away</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,0.85fr)] xl:gap-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-[660px] text-center lg:text-left"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-[#0A0A0A] bg-[#FFFFFF] px-3.5 py-1.5 text-[0.7rem] font-black uppercase tracking-[0.14em] text-[#0A0A0A] shadow-[3px_3px_0_#0A0A0A]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00C7AE] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00C7AE]" />
            </span>
            Live in Moscow now
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-[family-name:var(--font-display)] text-[clamp(3.2rem,6.2vw,6.4rem)] font-black uppercase leading-[0.86] text-[#0A0A0A]"
          >
            Parkantir
            <span className="block text-[#FFFFFF] [text-shadow:4px_4px_0_#0A0A0A]">
              finds parking
            </span>
            <span className="block text-[#FFFFFF] [text-shadow:4px_4px_0_#0A0A0A]">
              first.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-[480px] text-[1.05rem] font-semibold leading-7 text-[#0A0A0A] lg:mx-0"
          >
            Predict open parking before you arrive. Live radar, smart routing,
            and spot prediction — built for city drivers.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href="#download-app"
              className="group inline-flex min-w-[270px] items-center justify-between gap-5 rounded-lg bg-[#0A0A0A] px-6 py-3.5 text-base font-black uppercase tracking-[0.08em] text-[#FFFFFF] shadow-[5px_5px_0_#00F0D1] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#00F0D1]"
              style={{ color: "#FFFFFF" }}
            >
              <span className="text-[#FFFFFF]">Download App</span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#00F0D1] text-[#0A0A0A] transition group-hover:translate-x-0.5">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </a>
            <a
              href="#how-it-works"
              className="group inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-3.5 text-sm font-black uppercase tracking-[0.08em] text-[#0A0A0A] transition hover:text-[#0A0A0A]/60"
            >
              See how it works
              <ArrowUpRight
                className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.82rem] font-bold text-[#0A0A0A] lg:justify-start"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-[#0A0A0A] text-[#0A0A0A]"
                    aria-hidden="true"
                  />
                ))}
              </span>
              <span>4.9 early tester rating</span>
            </span>
            <span className="hidden h-3.5 w-px bg-[#0A0A0A]/25 sm:inline-block" />
            <span className="inline-flex items-center gap-1.5">
              <Radar className="h-4 w-4" aria-hidden="true" />
              1,200+ on waitlist
            </span>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 hidden items-center gap-3 lg:flex lg:justify-start"
          >
            <span className="text-[0.66rem] font-black uppercase tracking-[0.16em] text-[#0A0A0A]/50">
              Coverage
            </span>
            <span className="h-px w-8 bg-[#0A0A0A]/20" />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.78rem] font-bold text-[#0A0A0A]">
              {cities.map((city) => (
                <span key={city} className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#0A0A0A]/50" aria-hidden="true" />
                  {city}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="relative">
          <AppMockup />
        </div>
      </div>
    </section>
  );
}
