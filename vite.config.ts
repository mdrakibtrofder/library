import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Relative base + HashRouter => works on GitHub Pages (user site or project
// site) and from any sub-folder without extra configuration.
export default defineConfig({
  base: "./",
  server: { host: "::", port: 8080 },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
