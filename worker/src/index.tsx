import React from "react";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
import satori from "satori";
//@ts-ignore
import resvgWasm from "../node_modules/@resvg/resvg-wasm/index_bg.wasm";
import Calendar from "calendar-pages/app/components/Calendar"

// initialize resvg
await initWasm(resvgWasm);

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const fontData = await getGoogleFont();
		const svg = await satori(
			<Calendar />,
			{
				width: 400,
				fonts: [
					{
						name: "Roboto",
						data: fontData,
						weight: 400,
						style: "normal",
					},
				],
			},
		);

		const resvg = new Resvg(svg, {
			fitTo: {
				mode: "original",
			},
		});

		const pngData = resvg.render();
		const pngBuffer = pngData.asPng();
		return new Response(pngBuffer);
	},
};

const Component = () => {
	return (<div>Hello World!</div>);
}

async function getGoogleFont() {
	try {
		const familyResp = await fetch(
			"https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700",
		);
		if (!familyResp.ok) {
			throw new Error("Failed to load font data");
		}
		const css = await familyResp.text();
		const resource = css.match(
			/src: url\((.+)\) format\('(opentype|truetype)'\)/,
		);
		if (!resource) {
			throw new Error("Failed to parse font data");
		}

		const fontDataResp = await fetch(resource[1]);
		if (!fontDataResp.ok) {
			throw new Error("Failed to fetch font data.")
		}
		return await fontDataResp.arrayBuffer();
	} catch (error) {
		console.error(error)
		throw new Error("Failed to get google font")
	}
}