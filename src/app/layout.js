import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#fafaf8",
};

export const metadata = {
  title: "PickIt - Decision Wheel",
  description:
    "A clean, minimal, single-viewport, open-source decision wheel. Enter options, spin the wheel, and let fate decide.",
  applicationName: "PickIt",
  keywords: [
    "decision wheel",
    "random picker",
    "spin wheel",
    "open source",
    "open source decision wheel",
    "fate",
    "food picker",
    "picker wheel",
    "wheel of decisions",
  ],
  authors: [{ name: "PickIt" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "PickIt - Decision Wheel",
    description:
      "A clean, minimal, single-viewport, open-source decision wheel. Enter options, spin the wheel, and let fate decide.",
    siteName: "PickIt",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "PickIt - Decision Wheel",
    description:
      "A clean, minimal, single-viewport decision wheel. Enter options, spin the wheel, and let fate decide.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body
        suppressHydrationWarning
        className="h-full h-dvh overflow-hidden bg-app text-primary selection:bg-[#B7A7D9]/30 selection:text-[#20201F]"
      >
        {children}
      </body>
    </html>
  );
}
