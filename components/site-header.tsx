"use client";

import { Download, Menu, Radar, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Radar", href: "#radar" },
  { label: "Coverage", href: "#coverage" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Company", href: "#company" },
];

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/logopkr.png"
      alt="Parkantir"
      className={`block h-8 w-auto ${className}`}
    />
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current?.target.id) setActive(current.target.id);
      },
      { threshold: [0.5, 0.7], rootMargin: "-20% 0px -50% 0px" },
    );
    navigation.forEach((n) => {
      const el = document.getElementById(n.href.slice(1));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto w-full max-w-[1480px] px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "pt-2.5" : "pt-4"
        }`}
      >
        <div
          className={`flex items-center justify-between gap-4 rounded-2xl border px-3.5 py-2.5 backdrop-blur-md transition-all duration-300 sm:px-5 lg:px-6 ${
            scrolled
              ? "border-[#0A0A0A]/10 bg-[#FFFFFF]/88 shadow-[0_12px_40px_rgba(10,10,10,0.12)]"
              : "border-[#0A0A0A]/12 bg-[#FFFFFF]/55 shadow-[0_8px_24px_rgba(10,10,10,0.06)]"
          }`}
        >
          <a href="#" className="group flex shrink-0 items-center gap-2.5">
            <BrandMark />
            <span className="hidden items-center gap-1.5 rounded-full border border-[#00C7AE]/40 bg-[#00C7AE]/10 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#008F7D] sm:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00C7AE] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00C7AE]" />
              </span>
              Live
            </span>
          </a>

          <nav className="hidden items-center gap-0.5 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[#0A0A0A] xl:flex">
            {navigation.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="group relative rounded-md px-3 py-2 transition hover:bg-[#0A0A0A]/5"
                >
                  <span className={isActive ? "text-[#0A0A0A]" : "text-[#0A0A0A]/70"}>
                    {item.label}
                  </span>
                  <span
                    className={`pointer-events-none absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-[#00C7AE] transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="hidden items-center gap-1.5 rounded-full border border-[#0A0A0A]/12 bg-[#FFFFFF]/60 px-2.5 py-1.5 text-[0.66rem] font-black uppercase tracking-[0.06em] text-[#0A0A0A] lg:inline-flex">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              1,200+
            </span>
            <a
              href="#download-app"
              className="inline-flex shrink-0 items-center justify-center rounded-md px-3 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#0A0A0A] transition hover:bg-[#0A0A0A]/5"
            >
              Login
            </a>
            <a
              href="#download-app"
              className="group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#0A0A0A] bg-[#0A0A0A] px-4 py-2.5 text-sm font-black uppercase tracking-[0.08em] text-[#FFFFFF] shadow-[4px_4px_0_#00F0D1] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#00F0D1]"
              style={{ color: "#FFFFFF" }}
            >
              <Download
                className="h-4 w-4 transition group-hover:translate-y-0.5"
                aria-hidden="true"
              />
              Join Waitlist
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#0A0A0A] bg-[#0A0A0A] text-[#FFFFFF] xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-[#0A0A0A] transition-opacity duration-300 xl:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col px-6 pb-10 pt-24">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00C7AE]/40 bg-[#00C7AE]/10 px-2.5 py-1 text-[0.66rem] font-black uppercase tracking-[0.1em] text-[#00C7AE]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00C7AE] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00C7AE]" />
              </span>
              Live in Moscow
            </span>
          </div>
          <nav className="grid gap-1 text-2xl font-black uppercase tracking-[0.04em] text-[#FFFFFF]">
            {navigation.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-[#FFFFFF]/12 py-5 transition hover:text-[#00F0D1]"
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                <span>{item.label}</span>
                <span className="text-sm font-bold text-[#757575]">
                  0{index + 1}
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-auto grid gap-3">
            <a
              href="#download-app"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#00F0D1] px-6 py-4 text-base font-black uppercase tracking-[0.08em] text-[#0A0A0A]"
            >
              <Radar className="h-5 w-5" aria-hidden="true" />
              Join Waitlist
            </a>
            <p className="text-center text-sm font-semibold text-[#9A9A9A]">
              Available soon on iOS and Android.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
