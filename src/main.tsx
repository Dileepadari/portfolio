/**
 * Browser entry point. Mounts the app and pulls in the global stylesheet.
 *
 * @module app
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
