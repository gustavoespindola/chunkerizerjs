/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: true,
	},
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			sharp$: false,
			"onnxruntime-node$": false,
		};
		return config;
	},
};

export default nextConfig;
