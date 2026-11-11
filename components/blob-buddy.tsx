type BlobBuddyProps = {
  tone: "acid" | "aqua";
  size?: "sm" | "md";
};

const palette = {
  acid: {
    body: "from-[#FFEE00] via-[#FFEE00] to-[#FFFFFF]",
    glow: "shadow-[0_18px_35px_rgba(255,238,0,0.35)]",
  },
  aqua: {
    body: "from-[#00F0D1] via-[#00F0D1] to-[#FFFFFF]",
    glow: "shadow-[0_18px_35px_rgba(0,240,209,0.3)]",
  },
};

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-16 w-16",
};

export function BlobBuddy({ tone, size = "md" }: BlobBuddyProps) {
  return (
    <span
      className={[
        "relative inline-flex items-center justify-center rounded-[38%] bg-gradient-to-br",
        "before:absolute before:bottom-3 before:left-[-12%] before:h-3 before:w-4 before:rounded-full before:bg-inherit",
        "after:absolute after:bottom-3 after:right-[-12%] after:h-3 after:w-4 after:rounded-full after:bg-inherit",
        palette[tone].body,
        palette[tone].glow,
        sizeMap[size],
      ].join(" ")}
      aria-hidden="true"
    >
      <span className="absolute left-[31%] top-[36%] h-1.5 w-1.5 rounded-full bg-[#0A0A0A]" />
      <span className="absolute right-[31%] top-[36%] h-1.5 w-1.5 rounded-full bg-[#0A0A0A]" />
      <span className="absolute top-[50%] h-2 w-5 rounded-full border-b-2 border-[#0A0A0A]" />
    </span>
  );
}
