/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        edublue: "#1E5EFF",
        edulightblue: "#E5EDFF",
      },
      fontSize: {
        titles: "18px",
      },
      fontFamily: {
        inter: ["InterRegular-18", "san-serif"],
        "inter-medium": ["Inter-Medium", "san-serif"],
        "inter-semibold": ["InterSemiBold-24", "san-serif"],
        "inter-bold": ["InterBold-24", "san-serif"],
        "inter-light": ["Inter-Light", "san-serif"],
        "inter-black": ["Inter-Black", "san-serif"],
      },
    },
  },

  plugins: [],
};
