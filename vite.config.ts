import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
const now = new Date();
const pad = (n: number) => String(n).padStart(2, "0");
const appVersion = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

export default defineConfig({
  base: "/ballot-paw/",
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(appVersion),
    "import.meta.env.VITE_GA_MEASUREMENT_ID": JSON.stringify(
      process.env.VITE_GA_MEASUREMENT_ID || "",
    ),
    "import.meta.env.VITE_ENABLE_ANALYTICS": JSON.stringify(
      process.env.VITE_ENABLE_ANALYTICS || "false",
    ),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        name: "Ballot Counter",
        short_name: "Ballot",
        description: "Offline ballot counting app",
        theme_color: "#ffffff",
        display: "standalone",
        start_url: "/ballot-paw/",
        icons: [
          {
            src: "/ballot-paw/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/ballot-paw/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/main.tsx", "src/test/**"],
    },
  },
});
