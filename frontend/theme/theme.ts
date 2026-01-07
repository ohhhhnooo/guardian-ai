import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    safetyGreen: string;
    safetyYellow: string;
    safetyRed: string;
  }
  interface PaletteOptions {
    safetyGreen?: string;
    safetyYellow?: string;
    safetyRed?: string;
  }
}

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3b82f6"
    },
    secondary: {
      main: "#6366f1"
    },
    background: {
      default: "#020617",
      paper: "#020617"
    },
    text: {
      primary: "#e5e7eb",
      secondary: "#9ca3af"
    },
    safetyGreen: "#22c55e",
    safetyYellow: "#eab308",
    safetyRed: "#ef4444"
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 3
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 16
        }
      }
    },
    MuiButton: {
      defaultProps: {
        variant: "contained"
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 999,
          fontWeight: 500
        }
      }
    }
  },
  typography: {
    fontFamily: [
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "SF Pro Text",
      "Segoe UI",
      "Roboto",
      "sans-serif"
    ].join(","),
    h1: { fontSize: "2.6rem", fontWeight: 700 },
    h2: { fontSize: "2.1rem", fontWeight: 600 },
    h3: { fontSize: "1.6rem", fontWeight: 600 }
  }
});


