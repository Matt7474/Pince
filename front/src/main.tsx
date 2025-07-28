import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./i18n";
import * as Sentry from "@sentry/react";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Element with id 'root' not found");
}

Sentry.init({
	dsn: "https://16f6109be42abd681f9b894e49c2034c@o4509746116624384.ingest.de.sentry.io/4509746119376976",
	// Setting this option to true will send default PII data to Sentry.
	// For example, automatic IP address collection on events
	sendDefaultPii: true,
});

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
