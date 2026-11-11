import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parkantir — парковка в Москве на карте",
  description:
    "Parkantir помогает заранее оценить доступность парковок в Москве и выбрать место рядом с пунктом назначения.",
  keywords: [
    "parking",
    "smart parking",
    "real-time parking",
    "parking app",
    "parking intelligence",
    "Moscow parking",
    "Parkantir",
  ],
  authors: [{ name: "Parkantir" }],
  openGraph: {
    title: "Parkantir — парковка в Москве на карте",
    description:
      "Парковки Москвы на одной понятной карте.",
    type: "website",
    locale: "ru_RU",
    siteName: "Parkantir",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parkantir — парковка в Москве на карте",
    description:
      "Парковки Москвы на одной понятной карте.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
