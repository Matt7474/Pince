module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#E2EEFA", // ou une variable CSS si tu préfères
				secondary: "#9333EA",
				accent: "#F59E0B",
			},
			fontFamily: {
				custom: ['"Poppins"', "sans-serif"],
			},
		},
	},
	plugins: [require("daisyui")],
};
