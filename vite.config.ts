/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // Only our own tests. Without this, vitest also walks node_modules and
    // tries to run other packages' suites.
    include: ["src/**/*.test.{ts,tsx}"],
    // `integrations/supabase/client.ts` throws at module load when these are
    // missing, so any test that transitively imports it fails without them.
    // Defined here rather than left to a local .env, because a suite that
    // passes only on a machine with a .env is not a suite: this is exactly how
    // it went green locally and red on the first CI run.
    env: {
      VITE_SUPABASE_URL: "http://127.0.0.1:54321",
      VITE_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
      VITE_SUPABASE_PROJECT_ID: "test",
    },
  },
}));
