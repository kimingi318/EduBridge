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
    },
  },
  plugins: [],
};
