import {
  Apple,
  Camera,
  Globe,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Network,
  Phone,
  Play,
  Smartphone,
  Sparkles,
  Video,
  type LucideIcon,
} from "lucide-react";

const companyLinks = [
  { label: "What is Parkantir?", href: "#radar" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Coverage", href: "#coverage" },
  { label: "Early access", href: "#pricing" },
];

const legalLinks = [
  { label: "Terms and conditions", href: "#" },
  { label: "Privacy policy", href: "#" },
  { label: "Cookie policy", href: "#" },
];

const socialLinks: { label: string; Icon: LucideIcon }[] = [
  { label: "TikTok", Icon: Music2 },
  { label: "Community", Icon: MessageCircle },
  { label: "Instagram", Icon: Camera },
  { label: "LinkedIn", Icon: Network },
  { label: "YouTube", Icon: Video },
];

function FooterButton({
  title,
  eyebrow,
  accent,
  Icon = Smartphone,
}: {
  title: string;
  eyebrow: string;
  accent?: "aqua" | "yellow";
  Icon?: LucideIcon;
}) {
  return (
    <a
      href="#download-app"
      className={`inline-flex w-full max-w-[360px] items-center justify-center gap-3 rounded-full border border-[#0A0A0A] px-6 py-4 text-[#FFFFFF] transition hover:-translate-y-0.5 sm:w-auto ${
        accent === "aqua" ? "bg-[#00F0D1] text-[#0A0A0A]" : "bg-[#0A0A0A]"
      }`}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFFFF] text-[#0A0A0A]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-left leading-none">
        <span className="block text-[0.65rem] font-black uppercase tracking-[0.08em]">
          {eyebrow}
        </span>
        <span className="mt-1 block text-lg font-black tracking-normal">
          {title}
        </span>
      </span>
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="company-links"
      className="snap-start border-t border-[#0A0A0A] bg-[#F4F4F0] text-[#0A0A0A]"
    >
      <div className="mx-auto grid w-full max-w-[1480px] gap-x-14 gap-y-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_1fr_1fr_1fr] lg:px-8 lg:py-20">
        <div>
          <img
            src="/logopkr.png"
            alt="Parkantir"
            className="block h-14 w-auto sm:h-16"
          />
          <p className="mt-8 max-w-[330px] text-3xl font-black leading-tight tracking-normal">
            Your best way to find parking first.
          </p>

          <div className="mt-8 grid gap-4">
            <FooterButton eyebrow="Available soon on" title="Web App" Icon={Globe} />
          </div>

          <p className="mt-12 text-2xl font-black">Coming soon</p>
          <div className="mt-6 grid gap-4">
            <FooterButton eyebrow="Download on the" title="App Store" Icon={Apple} />
            <FooterButton eyebrow="Get it on" title="Google Play" Icon={Play} />
          </div>
        </div>

        <div className="grid content-start gap-16">
          <div>
            <h2 className="text-2xl font-black tracking-normal">
              Company
            </h2>
            <nav className="mt-7 grid gap-5 text-lg font-bold">
              {companyLinks.map((link) => (
                <a key={link.label} href={link.href} className="hover:text-[#757575]">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-normal">
              Join early access
            </h2>
            <div className="mt-7">
              <FooterButton
                eyebrow="Reserve your spot from"
                title="Free access"
                accent="aqua"
                Icon={Sparkles}
              />
            </div>
          </div>
        </div>

        <div className="grid content-start gap-16">
          <div>
            <h2 className="text-2xl font-black tracking-normal">
              Contact
            </h2>
            <div className="mt-7 grid gap-6 text-lg font-bold leading-7">
              <p className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
                San Francisco, CA
              </p>
              <a
                href="mailto:hello@parkantir.com"
                className="flex items-start gap-3 hover:text-[#757575]"
              >
                <Mail className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
                hello@parkantir.com
              </a>
              <a
                href="tel:+14155550192"
                className="flex items-start gap-3 hover:text-[#757575]"
              >
                <Phone className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
                +1 415 555 0192
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-normal">
              Follow us
            </h2>
            <div className="mt-7 flex flex-wrap gap-3">
              {socialLinks.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0A0A0A] text-sm font-black uppercase text-[#FFFFFF] transition hover:-translate-y-0.5 hover:bg-[#242424]"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid content-start gap-16">
          <div>
            <h2 className="text-2xl font-black tracking-normal">
              Terms
            </h2>
            <nav className="mt-7 grid gap-5 text-lg font-bold">
              {legalLinks.map((link) => (
                <a key={link.label} href={link.href} className="hover:text-[#757575]">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-normal">
              Support
            </h2>
            <a
              href="mailto:support@parkantir.com"
              className="mt-7 inline-flex w-full max-w-[320px] items-center justify-center gap-3 rounded-lg border border-[#0A0A0A] bg-[#FFFFFF] px-6 py-5 text-center text-lg font-black text-[#00A996] shadow-[6px_6px_0_#0A0A0A] transition hover:-translate-y-0.5"
            >
              <Headphones className="h-5 w-5" aria-hidden="true" />
              Help center
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1480px] px-4 pb-10 text-center text-base font-semibold text-[#757575] sm:px-6 lg:px-8">
        Parkantir © All rights reserved 2026.
      </div>
    </footer>
  );
}
