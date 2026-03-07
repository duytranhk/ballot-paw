import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BallotProvider } from "./context/BallotProvider.tsx";
import { analytics } from "./analytics";

// Initialize analytics when app starts
analytics.initialize().catch(console.error);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BallotProvider>
      <App />
    </BallotProvider>
  </StrictMode>,
);
