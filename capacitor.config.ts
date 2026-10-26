import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.voibee.holidays",
  appName: "Voibee Holidays",
  // Capacitor needs a local asset directory for native project sync. Runtime
  // navigation is served by the URL below because this Next.js app is dynamic.
  webDir: "public",
  server: {
    // The app intentionally uses the live Next.js service: Voibee relies on
    // server-rendered, authenticated and database-backed routes.
    url: process.env.CAPACITOR_SERVER_URL || "https://www.voibee.com",
    cleartext: false,
  },
};

export default config;
