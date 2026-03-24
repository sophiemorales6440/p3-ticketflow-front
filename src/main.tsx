import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import AuthProvider from "./context/AuthContext.tsx";

// biome-ignore lint/style/noNonNullAssertion: root is always present in index.html
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<CssBaseline />
				<App />
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>,
);
