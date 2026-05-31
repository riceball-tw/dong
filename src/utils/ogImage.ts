import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "@vercel/og";

const fontCache = new Map<number, ArrayBuffer>();

async function loadFullGoogleFont(weight: number) {
	if (fontCache.has(weight)) {
		return fontCache.get(weight)!;
	}

	const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@${weight}`;
	const css = await fetch(url).then((res) => res.text());
	const resource = css.match(/src: url\((.+)\) format\('(.+)'\)/);

	if (resource?.[1]) {
		const response = await fetch(resource[1]);
		if (response.status === 200) {
			const buffer = await response.arrayBuffer();
			fontCache.set(weight, buffer);
			return buffer;
		}
	}
	throw new Error(`Failed to load full font weight ${weight}`);
}

const LOGO_SVG = fs.readFileSync(
	path.resolve("./src/assets/images/brand/logo.svg"),
	"utf-8",
);
const LOGO_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString("base64")}`;

function logo() {
	return {
		type: "div",
		props: {
			style: {
				display: "flex",
				position: "absolute",
				top: "-2rem",
				left: "3rem",
				width: "8rem",
				height: "8rem",
			},
			children: [
				{
					type: "img",
					props: {
						src: LOGO_DATA_URI,
						style: { width: "100%", height: "100%" },
					},
				},
			],
		},
	};
}

function ogCard(title: string, content: string) {
	return {
		type: "div",
		props: {
			style: {
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				padding: "2rem",
				backgroundImage:
					"linear-gradient(135deg, rgb(20, 0, 57) 0%, rgb(137, 105, 255) 100%)",
			},
			children: [
				{
					type: "div",
					props: {
						style: {
							position: "absolute",
							top: 0,
							left: 0,
							width: "300%",
							height: "300%",
							background:
								"linear-gradient(120deg, rgb(146, 224, 82) 10%, rgb(82, 105, 224) 15%, rgb(82, 84, 224) 20%, rgb(82, 224, 141) 25%, rgb(82, 84, 224) 30%)",
							opacity: 0.3,
							filter: "blur(20px)",
						},
					},
				},
				{
					type: "div",
					props: {
						style: {
							flex: 1,
							display: "flex",
							flexDirection: "column",
							padding: "3rem",
							backgroundColor: "rgba(255, 255, 255, 0.1)",
							borderRadius: "1rem",
							border: "2px solid rgba(255, 255, 255, 0.2)",
							position: "relative",
						},
						children: [
							logo(),
							{
								type: "div",
								props: {
									style: { display: "flex", flexDirection: "column" },
									children: [
										{
											type: "div",
											props: {
												style: {
													marginTop: "3.5rem",
													display: "flex",
													fontWeight: 900,
													lineHeight: 1.1,
													color: "white",
													fontSize: "4rem",
												},
												children: title,
											},
										},
										{
											type: "div",
											props: {
												style: {
													display: "flex",
													fontWeight: 500,
													marginTop: "2rem",
													lineHeight: 1.5,
													color: "white",
													letterSpacing: "1.4px",
													fontSize: "1.5rem",
												},
												children: content,
											},
										},
									],
								},
							},
						],
					},
				},
			],
		},
	};
}

const CACHE_DIR = path.resolve("./public/og-cache");

export async function generateOgImage(title: string, content: string) {
	const hash = crypto
		.createHash("md5")
		.update(title + content)
		.digest("hex");
	const cachePath = path.join(CACHE_DIR, `${hash}.png`);

	if (fs.existsSync(cachePath)) {
		return new Response(fs.readFileSync(cachePath), {
			headers: { "Content-Type": "image/png" },
		});
	}

	const [fontBoldData, fontRegularData] = await Promise.all([
		loadFullGoogleFont(900),
		loadFullGoogleFont(500),
	]);

	// biome-ignore lint/suspicious/noExplicitAny: @vercel/og accepts plain objects but types expect ReactElement
	const imageResponse = new ImageResponse(ogCard(title, content) as any, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: "font-family",
				data: fontBoldData,
				weight: 900,
				style: "normal",
			},
			{
				name: "font-family",
				data: fontRegularData,
				weight: 500,
				style: "normal",
			},
		],
	});

	const buffer = Buffer.from(await imageResponse.arrayBuffer());
	fs.mkdirSync(CACHE_DIR, { recursive: true });
	fs.writeFileSync(cachePath, buffer);

	return new Response(buffer, { headers: { "Content-Type": "image/png" } });
}
