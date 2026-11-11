"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Car,
  CircleParking,
  MapPinned,
  Navigation,
  Radar,
} from "lucide-react";
import { useEffect, useState } from "react";

const screens = [
  {
    id: "radar",
    label: "Radar",
    title: "Introducing Parkantir.",
    text: "The smart parking companion for Moscow's urban drivers. Real-time availability, intelligent routing, and seamless reservations in one app.",
    stat: "82%",
    statLabel: "Live parking confidence",
    bullets: [
      "Live Parking Map",
      "Smart Navigation",
      "Instant Reservation",
    ],
    theme: "yellow",
  },
  {
    id: "coverage",
    label: "Coverage",
    title: "Built for busy city blocks.",
    text: "Start with streets, garages, and event zones around your destination.",
    stat: "3x",
    statLabel: "Coverage signals",
    bullets: ["Downtown streets", "Garage availability", "Event zones"],
    theme: "black",
  },
  {
    id: "how-it-works",
    label: "How It Works",
    title: "Open, pick, arrive.",
    text: "Parkantir keeps the flow simple so you spend less time guessing.",
    stat: "01",
    statLabel: "Simple route",
    bullets: ["Open the radar", "Pick the best odds", "Park with less circling"],
    theme: "white",
  },
  {
    id: "pricing",
    label: "Pricing",
    title: "Simple while we launch.",
    text: "Join early access and get the app when Parkantir opens in your city.",
    stat: "Free",
    statLabel: "Early access",
    bullets: ["No complicated plans", "No surprises", "iOS and Android soon"],
    theme: "yellow",
  },
  {
    id: "company",
    label: "Company",
    title: "Less circling. Better city movement.",
    text: "We are focused on one clear job: helping drivers find parking sooner.",
    stat: "Park",
    statLabel: "With better signals",
    bullets: ["Real-time movement", "Useful predictions", "Cleaner city flow"],
    theme: "black",
  },
];

const themeClasses = {
  yellow: {
    section: "bg-[#FFEE00] text-[#0A0A0A]",
    label: "text-[#757575]",
    text: "text-[#242424]",
    panel: "border-[#0A0A0A] bg-[#FFFFFF] text-[#0A0A0A] shadow-[10px_10px_0_#0A0A0A]",
    accent: "bg-[#00F0D1]",
    line: "bg-[#0A0A0A]",
    ghost: "border-[#0A0A0A]/20",
  },
  black: {
    section: "bg-[#0A0A0A] text-[#FFFFFF]",
    label: "text-[#00F0D1]",
    text: "text-[#EDEDED]",
    panel: "border-[#FFFFFF] bg-[#FFFFFF] text-[#0A0A0A] shadow-[10px_10px_0_#00F0D1]",
    accent: "bg-[#FFEE00]",
    line: "bg-[#FFFFFF]",
    ghost: "border-[#FFFFFF]/20",
  },
  white: {
    section: "bg-[#FFFFFF] text-[#0A0A0A]",
    label: "text-[#757575]",
    text: "text-[#242424]",
    panel: "border-[#0A0A0A] bg-[#FFEE00] text-[#0A0A0A] shadow-[10px_10px_0_#00F0D1]",
    accent: "bg-[#0A0A0A]",
    line: "bg-[#0A0A0A]",
    ghost: "border-[#0A0A0A]/20",
  },
} as const;

const radarFeatures = [
  {
    title: "Live Parking Map",
    text: "See available, occupied, and reserved spots across Moscow in real time.",
    Icon: MapPinned,
  },
  {
    title: "Smart Navigation",
    text: "Get guided directly to the nearest free spot with turn-by-turn directions.",
    Icon: Navigation,
  },
  {
    title: "Instant Reservation",
    text: "Reserve your spot ahead of time and arrive with a plan.",
    Icon: CalendarCheck,
  },
];

const storySlides = [
  {
    eyebrow: "Introduction",
    title: "Introducing Parkantir.",
    text: "A smart parking companion for Moscow's urban drivers. Find nearby availability, route with confidence, and reserve before you arrive.",
  },
  {
    eyebrow: "Searching",
    title: "The driver needs a spot.",
    text: "Parkantir reads live parking signals around the destination while the car is still on the way.",
  },
  {
    eyebrow: "Assistant",
    title: "Parkantir helps choose.",
    text: "The Parkantir owl checks nearby streets, compares availability, and highlights the best option.",
  },
  {
    eyebrow: "Available",
    title: "This spot is available.",
    text: "The driver gets a clear recommendation and can navigate or reserve the spot instantly.",
  },
];

function ProgressDots({ activeId }: { activeId: string }) {
  return (
    <nav
      aria-label="Landing section progress"
      className={`fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 gap-3 ${
        activeId === "radar" ? "lg:hidden" : "lg:grid"
      }`}
    >
      {screens.map((screen, index) => {
        const isActive = screen.id === activeId;

        return (
          <a
            key={screen.id}
            href={`#${screen.id}`}
            className={`group grid h-10 w-10 place-items-center rounded-full border text-xs font-black transition ${
              isActive
                ? "border-[#0A0A0A] bg-[#00F0D1] text-[#0A0A0A]"
                : "border-[#0A0A0A] bg-[#FFFFFF] text-[#757575] hover:bg-[#FFEE00]"
            }`}
          >
            <span>{index + 1}</span>
            <span className="sr-only">{screen.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

function ParkingPanel({
  screen,
  index,
}: {
  screen: (typeof screens)[number];
  index: number;
}) {
  const theme = themeClasses[screen.theme as keyof typeof themeClasses];
  const icons = [Radar, Navigation, CircleParking];
  const ActiveIcon = icons[index % icons.length];

  return (
    <motion.div
      className={`relative rounded-lg border p-5 ${theme.panel}`}
      initial={{ opacity: 0, y: 32, rotate: -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: false, amount: 0.45 }}
    >
      <motion.div
        className={`absolute -right-4 -top-4 h-20 w-20 rounded-lg border ${theme.ghost}`}
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#757575]">
              Parking odds
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-6xl font-black uppercase leading-none sm:text-7xl">
              {screen.stat}
            </p>
          </div>
          <span
            className={`inline-flex h-12 w-12 items-center justify-center rounded-md ${theme.accent}`}
          >
            <ActiveIcon className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>

        <p className="mt-3 text-sm font-black uppercase tracking-[0.12em] text-[#757575]">
          {screen.statLabel}
        </p>

        <div className="mt-8 grid gap-3">
          {screen.bullets.map((bullet, bulletIndex) => (
            <div key={bullet} className="flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  bulletIndex === index % 3 ? theme.accent : theme.line
                }`}
              />
              <span className="text-sm font-black uppercase leading-5 tracking-[0.06em]">
                {bullet}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-9 grid gap-2">
          {[72, 48, 88, 62].map((width, barIndex) => (
            <div key={width + barIndex} className="h-3 rounded-full bg-[#E9E9E9]">
              <motion.div
                className={`h-full rounded-full ${theme.accent}`}
                initial={{ width: "18%" }}
                whileInView={{ width: `${width - index * 4 + barIndex * 2}%` }}
                transition={{ delay: 0.08 * barIndex, duration: 0.75 }}
                viewport={{ once: false, amount: 0.6 }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RadarDashboardDeck() {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[580px] lg:mr-0"
      initial={{ opacity: 0, y: 24, rotate: -0.8 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: false, amount: 0.45 }}
    >
      <motion.div
        className="absolute -right-5 top-6 h-[86%] w-[96%] rounded-lg border border-[#FFFFFF]/70 bg-[#FFFFFF]/45"
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-10 top-11 h-[76%] w-[92%] rounded-lg border border-[#FFFFFF]/45 bg-[#FFFFFF]/28"
        animate={{ x: [0, 9, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative overflow-hidden rounded-lg border border-[#FFFFFF] bg-[#FFFFFF] p-5 shadow-[0_22px_58px_rgba(10,10,10,0.16)]">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.82fr]">
        <div>
          <div className="flex flex-wrap gap-5">
            {["Free", "Busy", "Reserved"].map((item, index) => (
              <div key={item} className="flex items-center gap-2">
                <span
                  className={`h-3 w-3 rounded-full ${
                    index === 0
                      ? "bg-[#00C7AE]"
                      : index === 1
                        ? "bg-[#FFEE00]"
                        : "bg-[#0A0A0A]"
                  }`}
                />
                <span className="text-xs font-black uppercase tracking-[0.08em]">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((slot) => (
              <motion.div
                key={slot}
                className={`grid h-16 place-items-center rounded-md border border-[#DCDCDC] ${
                  slot === 1 || slot === 5 || slot === 9
                    ? "bg-[#00C7AE]"
                    : slot === 3 || slot === 11
                      ? "bg-[#FFEE00]"
                      : "bg-[#FFFFFF]"
                }`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.035 * slot, duration: 0.35 }}
                viewport={{ once: false, amount: 0.55 }}
              >
                {slot === 7 ? (
                  <span className="grid h-full w-full place-items-center rounded-md border-2 border-[#0A0A0A] bg-[#FFFFFF] text-3xl font-black">
                    P
                  </span>
                ) : null}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#DCDCDC] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <p className="font-[family-name:var(--font-display)] text-5xl font-black uppercase leading-none sm:text-6xl">
            82%
          </p>
          <p className="mt-3 text-lg font-black leading-tight">
            Availability nearby
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm font-bold text-[#008F7D]">
            <Radar className="h-4 w-4" aria-hidden="true" />
            Live estimate
          </p>

          <div className="relative mt-6 h-40 overflow-hidden rounded-md border border-[#DCDCDC] bg-[#F3F3F0]">
            <div className="absolute inset-0 bg-[linear-gradient(35deg,transparent_0_42%,#D8D8D4_42.4%_44%,transparent_44.4%),linear-gradient(145deg,transparent_0_48%,#D8D8D4_48.4%_50%,transparent_50.4%),linear-gradient(90deg,transparent_0_28%,#E1E1DE_28.4%_30%,transparent_30.4%),linear-gradient(0deg,transparent_0_62%,#E1E1DE_62.4%_64%,transparent_64.4%)]" />
            <div className="absolute left-5 top-4 rounded-full bg-[#FFFFFF] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.08em] text-[#008F7D] shadow-sm">
              Nearest spot
            </div>
            <motion.div
              className="absolute bottom-[-8px] left-16 h-44 w-2 origin-bottom rounded-full bg-[#00C7AE]"
              initial={{ scaleY: 0.12 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.55 }}
              style={{ rotate: "28deg" }}
            />
            <motion.div
              className="absolute right-10 top-8 grid h-14 w-14 place-items-center rounded-full bg-[#00C7AE]/20"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#00C7AE]">
                <span className="h-4 w-4 rounded-full bg-[#FFFFFF]" />
              </span>
            </motion.div>
            <Navigation
              className="absolute bottom-7 left-7 h-9 w-9 rotate-45 fill-[#0A0A0A] text-[#0A0A0A]"
              aria-hidden="true"
            />
          </div>
        </div>
        </div>
      </div>
    </motion.div>
  );
}

function OwlAssistant() {
  return (
    <div className="relative grid h-28 w-28 place-items-center rounded-full border border-[#0A0A0A] bg-[#FFFFFF] shadow-[8px_8px_0_#00C7AE]">
      <div className="absolute -top-3 flex gap-8">
        <span className="h-7 w-7 rotate-45 rounded-sm border-l border-t border-[#0A0A0A] bg-[#FFFFFF]" />
        <span className="h-7 w-7 rotate-45 rounded-sm border-l border-t border-[#0A0A0A] bg-[#FFFFFF]" />
      </div>
      <div className="relative z-10 grid gap-3">
        <div className="flex justify-center gap-4">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[#0A0A0A] bg-[#FFFBE2]">
            <span className="h-3 w-3 rounded-full bg-[#0A0A0A]" />
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[#0A0A0A] bg-[#FFFBE2]">
            <span className="h-3 w-3 rounded-full bg-[#0A0A0A]" />
          </span>
        </div>
        <span className="mx-auto h-3 w-8 rounded-b-full border-b-2 border-[#0A0A0A]" />
      </div>
    </div>
  );
}

function StoryVisual({ activeIndex }: { activeIndex: number }) {
  if (activeIndex === 0) {
    return <RadarDashboardDeck />;
  }

  if (activeIndex === 1) {
    return (
      <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-[#0A0A0A] bg-[#FFFFFF] p-6 shadow-[0_22px_58px_rgba(10,10,10,0.14)]">
        <div className="absolute inset-0 bg-[linear-gradient(35deg,transparent_0_41%,#E3E3DF_41.5%_43%,transparent_43.5%),linear-gradient(145deg,transparent_0_52%,#E3E3DF_52.5%_54%,transparent_54.5%),linear-gradient(90deg,transparent_0_26%,#ECECE8_26.5%_28%,transparent_28.5%),linear-gradient(0deg,transparent_0_68%,#ECECE8_68.5%_70%,transparent_70.5%)]" />
        <div className="relative flex items-center justify-between">
          <span className="rounded-full bg-[#FFEE00] px-4 py-2 text-xs font-black uppercase tracking-[0.12em]">
            Searching nearby
          </span>
          <span className="text-sm font-black text-[#757575]">Moscow center</span>
        </div>
        <motion.div
          className="absolute bottom-20 left-8 grid h-20 w-32 place-items-center rounded-[28px] border border-[#0A0A0A] bg-[#0A0A0A] text-[#FFFFFF] shadow-[6px_6px_0_#00C7AE]"
          animate={{ x: [0, 180, 315] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Car className="h-12 w-12" aria-hidden="true" />
        </motion.div>
        <div className="absolute bottom-8 left-0 h-1 w-full bg-[#0A0A0A]/10" />
        <div className="absolute right-14 top-24 grid gap-3">
          {["Busy", "Reserved", "Searching"].map((label) => (
            <span
              key={label}
              className="rounded-md border border-[#0A0A0A] bg-[#FFFFFF] px-4 py-3 text-sm font-black uppercase tracking-[0.08em]"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (activeIndex === 2) {
    return (
      <div className="relative min-h-[420px] rounded-lg border border-[#0A0A0A] bg-[#FFFFFF] p-6 shadow-[0_22px_58px_rgba(10,10,10,0.14)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#757575]">
              Parkantir assistant
            </p>
            <p className="mt-2 text-2xl font-black leading-tight">
              Checking open spots
            </p>
          </div>
          <OwlAssistant />
        </div>
        <div className="mt-8 grid gap-4">
          {["Tverskaya area", "Arbat district", "Garden Ring"].map(
            (location, index) => (
              <motion.div
                key={location}
                className="flex items-center justify-between rounded-md border border-[#0A0A0A] bg-[#F7F7F2] px-5 py-4"
                initial={{ opacity: 0.4, x: 20 }}
                animate={{ opacity: [0.55, 1, 0.55], x: [20, 0, 20] }}
                transition={{
                  delay: index * 0.25,
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="font-black uppercase tracking-[0.06em]">
                  {location}
                </span>
                <span
                  className={`h-3 w-3 rounded-full ${
                    index === 1 ? "bg-[#00C7AE]" : "bg-[#FFEE00]"
                  }`}
                />
              </motion.div>
            ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-[#0A0A0A] bg-[#FFFFFF] p-6 shadow-[0_22px_58px_rgba(10,10,10,0.14)]">
      <div className="absolute inset-0 bg-[linear-gradient(35deg,transparent_0_42%,#E1E1DD_42.5%_44%,transparent_44.5%),linear-gradient(145deg,transparent_0_48%,#E1E1DD_48.5%_50%,transparent_50.5%)]" />
      <div className="relative flex items-start justify-between gap-5">
        <div className="max-w-[330px] rounded-lg border border-[#0A0A0A] bg-[#FFFFFF] p-5 shadow-[6px_6px_0_#00C7AE]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#008F7D]">
            Parkantir
          </p>
          <p className="mt-2 text-2xl font-black leading-tight">
            This spot is available.
          </p>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#5A5A5A]">
            2 minutes away · reservation ready
          </p>
        </div>
        <OwlAssistant />
      </div>
      <motion.div
        className="absolute bottom-20 right-20 grid h-28 w-24 place-items-center rounded-md border-2 border-[#0A0A0A] bg-[#00C7AE]"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-4xl font-black">P</span>
      </motion.div>
      <Navigation
        className="absolute bottom-14 left-16 h-10 w-10 rotate-45 fill-[#0A0A0A] text-[#0A0A0A]"
        aria-hidden="true"
      />
    </div>
  );
}

function RadarStorySlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = storySlides[activeIndex];

  const goForward = () => {
    setActiveIndex((current) => (current + 1) % storySlides.length);
  };

  const goBack = () => {
    setActiveIndex((current) =>
      current === 0 ? storySlides.length - 1 : current - 1,
    );
  };

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[0.72fr_0.9fr] xl:gap-16">
      <motion.div
        key={activeSlide.title}
        className="max-w-[560px]"
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="inline-flex rounded-full bg-[#FFFFFF]/40 px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-[#008F7D]">
          {activeSlide.eyebrow}
        </p>
        <h2 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(3rem,5.4vw,5.4rem)] font-black uppercase leading-[0.94]">
          {activeSlide.title}
        </h2>
        <p className="mt-6 max-w-[520px] text-lg font-medium leading-8 text-[#1F1F1F]">
          {activeSlide.text}
        </p>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={goForward}
            className="inline-flex min-h-14 items-center justify-center gap-4 rounded-lg bg-[#0A0A0A] px-8 text-base font-black text-[#FFFFFF] shadow-[6px_6px_0_#00C7AE] transition hover:-translate-y-0.5"
          >
            <span>Continue</span>
            <ArrowRight className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-14 items-center justify-center border-b-2 border-[#0A0A0A] text-base font-black transition hover:text-[#008F7D]"
          >
            Back
          </button>
        </div>

        <div className="mt-8 flex gap-3">
          {storySlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to ${slide.eyebrow}`}
              className={`h-3 rounded-full border border-[#0A0A0A] transition ${
                activeIndex === index
                  ? "w-10 bg-[#0A0A0A]"
                  : "w-3 bg-[#FFFFFF]/70"
              }`}
            />
          ))}
        </div>
      </motion.div>

      <div className="relative overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${activeIndex * 100}%` }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {storySlides.map((slide, index) => (
            <div key={slide.title} className="w-full shrink-0">
              <StoryVisual activeIndex={index} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function RadarFeatureCards() {
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-3">
      {radarFeatures.map(({ title, text, Icon }, index) => (
        <motion.article
          key={title}
          className="grid grid-cols-[58px_1fr] gap-4 rounded-lg border border-[#FFFFFF] bg-[#FFFFFF] p-5 shadow-[0_18px_42px_rgba(10,10,10,0.11)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * index, duration: 0.5 }}
          viewport={{ once: false, amount: 0.4 }}
        >
          <span className="grid h-14 w-14 place-items-center rounded-lg border border-[#ECE6B8] bg-[#FFFBE2] text-[#008F7D] shadow-[0_10px_24px_rgba(10,10,10,0.07)]">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-black leading-tight">
              {title}
            </span>
            <span className="mt-1.5 block text-sm font-semibold leading-6 text-[#5A5A5A]">
              {text}
            </span>
          </span>
        </motion.article>
      ))}
    </div>
  );
}

function RadarSlide({ screen }: { screen: (typeof screens)[number] }) {
  return (
    <motion.section
      id={screen.id}
      className="relative min-h-screen snap-start overflow-hidden bg-[#FFEE00] text-[#0A0A0A]"
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] bg-[#0A0A0A]/5 lg:block" />

      <div className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col justify-center px-4 pb-12 pt-34 sm:px-6 lg:px-8 lg:pb-14 lg:pt-36">
        <RadarStorySlider />
      </div>
    </motion.section>
  );
}

export function LandingSections() {
  const [activeId, setActiveId] = useState(screens[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (current?.target.id) {
          setActiveId(current.target.id);
        }
      },
      { threshold: [0.45, 0.65] },
    );

    screens.forEach((screen) => {
      const element = document.getElementById(screen.id);

      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative z-10">
      <ProgressDots activeId={activeId} />
      {screens.map((screen, index) => {
        const theme = themeClasses[screen.theme as keyof typeof themeClasses];

        if (screen.id === "radar") {
          return <RadarSlide key={screen.id} screen={screen} />;
        }

        return (
          <motion.section
            key={screen.id}
            id={screen.id}
            className={`relative min-h-screen snap-start overflow-hidden ${theme.section}`}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-current opacity-20" />
            <motion.div
              className={`pointer-events-none absolute left-1/2 top-10 hidden h-[72vh] w-[42vw] -translate-x-1/2 rounded-lg border ${theme.ghost} lg:block`}
              initial={{ y: 70 }}
              whileInView={{ y: -10 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.35 }}
            />

            <div className="mx-auto grid min-h-screen w-full max-w-[1480px] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:px-8 lg:py-20">
              <motion.div
                className="max-w-[680px]"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: false, amount: 0.45 }}
              >
                <p className={`text-xs font-black uppercase tracking-[0.22em] ${theme.label}`}>
                  {screen.label}
                </p>
                <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[0.9]">
                  {screen.title}
                </h2>
                <p className={`mt-7 max-w-[560px] text-lg font-semibold leading-8 ${theme.text}`}>
                  {screen.text}
                </p>
              </motion.div>

              <div className="relative lg:min-h-[560px]">
                <div className="sticky top-20 mx-auto w-full max-w-[620px] lg:top-24">
                  <ParkingPanel screen={screen} index={index} />
                  {screen.id === "pricing" ? (
                    <a
                      href="#download-app"
                      className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0A0A0A] px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#FFFFFF] transition hover:-translate-y-0.5 hover:bg-[#242424] sm:w-auto"
                    >
                      Join the list
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ) : null}
                  {screen.id === "company" ? (
                    <a
                      href="mailto:hello@parkantir.com"
                      className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#FFEE00] px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#0A0A0A] transition hover:-translate-y-0.5 hover:bg-[#fff34d] sm:w-auto"
                    >
                      Contact
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
