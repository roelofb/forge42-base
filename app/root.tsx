import { useTranslation } from "react-i18next"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import type { LinksFunction } from "react-router"
import { useChangeLanguage } from "remix-i18next/react"
import type { Route } from "./+types/root"
import { LanguageSwitcher } from "./library/language-switcher"
import tailwindcss from "./tailwind.css?url"

export async function loader({ context }: Route.LoaderArgs) {
	if (!context) throw new Error("No context")
	const { lang, clientEnv } = context
	return { lang, clientEnv }
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: tailwindcss }]

export const handle = {
	i18n: "common",
}

export default function App({ loaderData }: Route.ComponentProps) {
	const { lang, clientEnv } = loaderData
	const { i18n } = useTranslation()
	useChangeLanguage(lang)

	return (
		<html className="overflow-y-auto overflow-x-hidden" lang={lang} dir={i18n.dir()}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="w-full h-full">
				<LanguageSwitcher />
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: We set the window.env variable to the client env */}
				<script dangerouslySetInnerHTML={{ __html: `window.env = ${JSON.stringify(clientEnv)}` }} />
			</body>
		</html>
	)
}
