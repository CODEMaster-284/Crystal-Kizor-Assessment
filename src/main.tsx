import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "./styles/tokens.css";
import "./styles/global.css";
import App from "./app/App";
import { initAnalytics } from "./lib/analytics";
initAnalytics();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
