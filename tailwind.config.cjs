/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: [
    "./*.{html,js,css} ",
    "./**/**/*.ejs",
    "./views/user.ejs",
    "./views/login.ejs",
    "./views/formnew.ejs",
  ],
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
