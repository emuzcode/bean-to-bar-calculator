import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.cacaocalc.app",
  appName: "Cacao Calculator",
  webDir: "out",
  server: {
    // Enable for local dev with live reload (comment out for production)
    // url: "http://127.0.0.1:3000",
    // cleartext: true,
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "Cacao Calculator",
  },
};

export default config;

