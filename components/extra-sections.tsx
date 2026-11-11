"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock,
  Leaf,
  MapPin,
  Quote,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const stats = [
  {
    value: "82%",
    label: "Live parking confidence",
    sub: "arrival prediction accuracy",
    Icon: TrendingUp,
  },
  {
    value: "3x",
    label: "Coverage signals",
    sub: "streets, garages, events",
    Icon: MapPin,
  },
  {
    value: "2 min",
    label: "Average time to spot",
    sub: "from open to navigate",
    Icon: Clock,
  },
  {
    value: "1,200+",
    label: "On the waitlist",
    sub: "and growing every day",
    Icon: Check,
  },
];

const testimonials = [
  {
    quote:
      "I stopped circling the block. Parkantir shows me where to go before I leave the house.",
    name: "Dmitry V.",
    role: "Daily commuter, Moscow",
  },
  {
    quote:
      "The radar prediction is uncanny. It pointed me to a free spot two streets away.",
    name: "Anna K.",
    role: "Early access tester",
  },
  {
    quote:
      "Finally a parking app that feels built for the actual chaos of the city.",
    name: "Sergey P.",
    role: "Rideshare driver",
  },
];

function StatsSection() {
  return (
    <section
      id="impact"
      className="relative snap-start overflow-hidden border-y border-[#0A0A0A] bg-[#0A0A0A] py-16 text-[#FFFFFF] lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#00F0D1]">
              By the numbers
            </p>
            <h2 className="mt-4 max-w-[640px] font-[family-name:var(--font-display)] text-[clamp(2.4rem,4.6vw,4.2rem)] font-black uppercase leading-[0.94]">
              Less circling. Better city movement.
            </h2>
          </div>
          <p className="max-w-[360px] text-sm font-semibold leading-7 text-[#EDEDED] lg:text-right">
            Early access results from drivers testing Parkantir across Moscow
            blocks.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, label, sub, Icon }, index) => (
            <motion.div
              key={label}
              className="relative overflow-hidden rounded-lg border border-[#FFFFFF]/15 bg-[#111] p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, duration: 0.5 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#00F0D1] text-[#0A0A0A]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-black uppercase tracking-[0.12em] text-[#757575]">
                  0{index + 1}
                </span>
              </div>
              <p className="mt-6 font-[family-name:var(--font-display)] text-5xl font-black uppercase leading-none">
                {value}
              </p>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.06em]">
                {label}
              </p>
              <p className="mt-1 text-sm font-medium text-[#9A9A9A]">{sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative snap-start overflow-hidden bg-[#FFFFFF] py-16 text-[#0A0A0A] lg:py-20">
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#757575]">
              From early drivers
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.4rem,4.6vw,4.2rem)] font-black uppercase leading-[0.94]">
              Drivers feel the difference.
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#0A0A0A] bg-[#FFEE00] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] lg:self-end">
            <Leaf className="h-4 w-4" aria-hidden="true" />
            Cleaner city flow
          </span>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.figure
              key={t.name}
              className="flex flex-col rounded-lg border border-[#0A0A0A] bg-[#F7F7F2] p-6 shadow-[6px_6px_0_#00C7AE]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, duration: 0.5 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <Quote
                className="h-8 w-8 text-[#00C7AE]"
                aria-hidden="true"
              />
              <blockquote className="mt-4 flex-1 text-lg font-semibold leading-8">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-[#0A0A0A]/10 pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-[#0A0A0A] bg-[#FFFFFF] text-sm font-black uppercase">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <span>
                  <span className="block font-black">{t.name}</span>
                  <span className="block text-sm font-semibold text-[#757575]">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();

    if (!value) {
      setStatus("error");
      setMessage("Enter your email to join the waitlist.");
      return;
    }

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isValid) {
      setStatus("error");
      setMessage("That email doesn’t look right. Try again.");
      return;
    }

    setStatus("success");
    setMessage("You’re on the list. We’ll email you when Parkantir opens.");
    setEmail("");
  };

  return (
    <section
      id="download-app"
      className="relative snap-start overflow-hidden bg-[#FFEE00] py-16 text-[#0A0A0A] lg:py-24"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 hidden h-72 w-72 rounded-full border border-[#0A0A0A]/15 lg:block" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 hidden h-60 w-60 rounded-full border border-[#0A0A0A]/15 lg:block" />

      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1fr] xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.4 }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-[#0A0A0A] bg-[#FFFFFF] px-4 py-1.5 text-xs font-black uppercase tracking-[0.12em]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00C7AE] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00C7AE]" />
              </span>
              Early access open
            </p>
            <h2 className="mt-6 font-[family-name:var(--font-display)] text-[clamp(2.6rem,5vw,4.8rem)] font-black uppercase leading-[0.92]">
              Join the
              <span className="block text-[#FFFFFF] [text-shadow:4px_4px_0_#0A0A0A]">
                waitlist.
              </span>
            </h2>
            <p className="mt-6 max-w-[440px] text-lg font-semibold leading-8">
              Get the app first when Parkantir opens in your city. No spam, just
              the launch invite.
            </p>
            <ul className="mt-6 grid gap-2 text-sm font-black uppercase tracking-[0.06em]">
              {["Free during early access", "iOS and Android", "Cancel anytime"].map(
                (perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#008F7D]" aria-hidden="true" />
                    {perk}
                  </li>
                ),
              )}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, rotate: -0.6 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.4 }}
            className="relative w-full max-w-[560px] justify-self-center lg:justify-self-end"
          >
            <div className="rounded-lg border border-[#0A0A0A] bg-[#FFFFFF] p-6 shadow-[10px_10px_0_#0A0A0A] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#757575]">
                Reserve your spot
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-4xl font-black uppercase leading-none">
                Free access
              </p>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-3" noValidate>
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-[#0A0A0A]">
                    Email address
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status !== "idle") setStatus("idle");
                    }}
                    placeholder="you@email.com"
                    aria-label="Email address"
                    aria-invalid={status === "error"}
                    className="w-full rounded-md border border-[#0A0A0A] bg-[#FFFFFF] px-4 py-3.5 text-base font-semibold text-[#0A0A0A] outline-none transition focus:border-[#0A0A0A] focus:ring-4 focus:ring-[#00F0D1]/40"
                  />
                </label>

                {status === "error" && (
                  <p className="text-sm font-bold text-[#C0392B]">{message}</p>
                )}
                {status === "success" && (
                  <p className="flex items-center gap-2 text-sm font-bold text-[#008F7D]">
                    <Check className="h-4 w-4" aria-hidden="true" />
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-3 rounded-md bg-[#0A0A0A] px-6 py-4 text-base font-black uppercase tracking-[0.08em] text-[#FFFFFF] shadow-[4px_4px_0_#00F0D1] transition hover:-translate-y-0.5"
                >
                  <span className="text-[#FFFFFF]">Join the list</span>
                  <ArrowRight
                    className="h-5 w-5 transition group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
              </form>

              <p className="mt-4 text-xs font-semibold text-[#757575]">
                By joining you agree to receive launch updates. Unsubscribe
                anytime.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ExtraSections() {
  return (
    <>
      <StatsSection />
      <Testimonials />
      <WaitlistForm />
    </>
  );
}
