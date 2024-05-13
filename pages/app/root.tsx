import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	json,
	useLoaderData,
} from "@remix-run/react";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

export async function loader({ request }: { request: Request }) {
	const acceptLanguage = request.headers.get("accept-language");
	const locale = acceptLanguage?.split(",")?.[0];
	return json({ locale: locale || "en" });
}

export function Layout({ children }: { children: React.ReactNode }) {
	const { locale } = useLoaderData<typeof loader>();
	i18n.changeLanguage(locale);
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<I18nextProvider i18n={i18n}>
			<Outlet />
		</I18nextProvider>
	);
}
