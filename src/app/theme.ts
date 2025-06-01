"use client";

import { createTheme } from "@mui/material/styles";
import { Lato, Roboto_Condensed } from "next/font/google";

const lato = Lato({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const roboto = Roboto_Condensed({
  weight: ["400"],
  subsets: ["latin"],
});

const theme = createTheme({
  typography: {
    fontFamily: lato.style.fontFamily,
  },
  components: {
    MuiSkeleton: {
      styleOverrides: {
        rounded: {
          borderRadius: "1em",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        body1: {
          fontSize: "1.5em",
          fontFamily: roboto.style.fontFamily,
        },
      },
    },
  },
});

export default theme;
