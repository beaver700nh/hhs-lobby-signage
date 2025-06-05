import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "hsl(4, 80%, 32%)",
    },
    secondary: {
      main: "hsl(42, 80%, 32%)",
    },
  },
  typography: {
    fontFamily: "Roboto Condensed",
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
        h1: {
          fontSize: "2.5em",
          fontFamily: "Lato",
        },
        body1: {
          fontSize: "1.75em",
        },
        body2: {
          fontSize: "1.25em",
        },
      },
    },
  },
});

export default theme;
