"use client";

import { createTheme } from "@mui/material/styles";
import { Lato } from "next/font/google";

const font = Lato({
  variable: "--font-main",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const theme = createTheme({
  typography: {
    fontFamily: font.style.fontFamily,
  },
  components: {
    MuiSkeleton: {
      styleOverrides: {
        rounded: {
          borderRadius: "1em",
        },
      },
    },
  },
});

export default theme;
