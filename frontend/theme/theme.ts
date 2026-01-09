import { createTheme, alpha } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    safetyGreen: string;
    safetyYellow: string;
    safetyRed: string;
    glow: {
      cyan: string;
      green: string;
      yellow: string;
      red: string;
    };
  }
  interface PaletteOptions {
    safetyGreen?: string;
    safetyYellow?: string;
    safetyRed?: string;
    glow?: {
      cyan: string;
      green: string;
      yellow: string;
      red: string;
    };
  }
}

// Aviation Command Center color palette
const colors = {
  // Base colors - deep slate/navy
  background: {
    primary: "#0a0e14",
    secondary: "#0d1117",
    tertiary: "#151b23",
    card: "#12181f",
    elevated: "#1a222d",
  },
  // Accent - cyan/teal (HUD/radar aesthetic)
  accent: {
    primary: "#00d9ff",
    secondary: "#0891b2",
    muted: "#164e63",
  },
  // Text
  text: {
    primary: "#e6edf3",
    secondary: "#8b949e",
    muted: "#6e7681",
  },
  // Safety status colors
  safety: {
    green: "#00ff88",
    greenMuted: "#166534",
    yellow: "#fbbf24",
    yellowMuted: "#854d0e",
    red: "#ff4757",
    redMuted: "#991b1b",
  },
  // Borders and lines
  border: {
    default: "#21262d",
    muted: "#30363d",
    accent: "#00d9ff33",
  },
};

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colors.accent.primary,
      light: colors.accent.primary,
      dark: colors.accent.secondary,
    },
    secondary: {
      main: "#a78bfa",
      light: "#c4b5fd",
      dark: "#7c3aed",
    },
    background: {
      default: colors.background.primary,
      paper: colors.background.card,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    divider: colors.border.default,
    safetyGreen: colors.safety.green,
    safetyYellow: colors.safety.yellow,
    safetyRed: colors.safety.red,
    glow: {
      cyan: colors.accent.primary,
      green: colors.safety.green,
      yellow: colors.safety.yellow,
      red: colors.safety.red,
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "2.5rem",
      fontWeight: 600,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "2rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1.1rem",
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "1rem",
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "0.938rem",
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    caption: {
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: "0.75rem",
      letterSpacing: "0.02em",
      textTransform: "uppercase",
    },
    overline: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: "0.7rem",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
    button: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 500,
      letterSpacing: "0.02em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

        :root {
          --glow-cyan: ${colors.accent.primary};
          --glow-green: ${colors.safety.green};
          --glow-yellow: ${colors.safety.yellow};
          --glow-red: ${colors.safety.red};
        }

        body {
          background: ${colors.background.primary};
          background-image:
            radial-gradient(ellipse at top, ${alpha(colors.accent.primary, 0.03)} 0%, transparent 50%),
            linear-gradient(180deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%);
          min-height: 100vh;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${colors.background.primary};
        }
        ::-webkit-scrollbar-thumb {
          background: ${colors.border.muted};
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${colors.text.muted};
        }

        /* Glow animation keyframes */
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @keyframes data-flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.8; }
          94% { opacity: 1; }
        }

        .mono-data {
          font-family: "JetBrains Mono", monospace;
          font-variant-numeric: tabular-nums;
        }

        .glow-text-cyan {
          text-shadow: 0 0 10px ${alpha(colors.accent.primary, 0.5)};
        }

        .glow-text-green {
          text-shadow: 0 0 10px ${alpha(colors.safety.green, 0.5)};
        }

        .glow-text-yellow {
          text-shadow: 0 0 10px ${alpha(colors.safety.yellow, 0.5)};
        }

        .glow-text-red {
          text-shadow: 0 0 10px ${alpha(colors.safety.red, 0.5)};
        }
      `,
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.default}`,
          borderRadius: 12,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${alpha(colors.accent.primary, 0.3)}, transparent)`,
            borderRadius: "12px 12px 0 0",
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.default}`,
          borderRadius: 12,
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            borderColor: colors.border.muted,
            boxShadow: `0 0 20px ${alpha(colors.accent.primary, 0.05)}`,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
          padding: "10px 20px",
          transition: "all 0.2s ease",
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
          color: colors.background.primary,
          boxShadow: `0 0 20px ${alpha(colors.accent.primary, 0.3)}`,
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
            boxShadow: `0 0 30px ${alpha(colors.accent.primary, 0.5)}`,
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderColor: colors.accent.primary,
          color: colors.accent.primary,
          "&:hover": {
            borderColor: colors.accent.primary,
            backgroundColor: alpha(colors.accent.primary, 0.1),
            boxShadow: `0 0 15px ${alpha(colors.accent.primary, 0.2)}`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: colors.background.tertiary,
            borderRadius: 8,
            "& fieldset": {
              borderColor: colors.border.default,
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            },
            "&:hover fieldset": {
              borderColor: colors.border.muted,
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.accent.primary,
              boxShadow: `0 0 10px ${alpha(colors.accent.primary, 0.2)}`,
            },
          },
          "& .MuiInputLabel-root": {
            color: colors.text.secondary,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: colors.accent.primary,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.tertiary,
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(colors.background.secondary, 0.8),
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${colors.border.default}`,
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background.secondary,
          borderRight: `1px solid ${colors.border.default}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "2px 8px",
          padding: "10px 16px",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: alpha(colors.accent.primary, 0.08),
          },
          "&.Mui-selected": {
            backgroundColor: alpha(colors.accent.primary, 0.15),
            borderLeft: `2px solid ${colors.accent.primary}`,
            "&:hover": {
              backgroundColor: alpha(colors.accent.primary, 0.2),
            },
            "& .MuiListItemIcon-root": {
              color: colors.accent.primary,
            },
            "& .MuiListItemText-primary": {
              color: colors.accent.primary,
              fontWeight: 600,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: alpha(colors.accent.primary, 0.15),
          color: colors.accent.primary,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid",
        },
        standardError: {
          backgroundColor: alpha(colors.safety.red, 0.1),
          borderColor: alpha(colors.safety.red, 0.3),
          color: colors.safety.red,
        },
        standardWarning: {
          backgroundColor: alpha(colors.safety.yellow, 0.1),
          borderColor: alpha(colors.safety.yellow, 0.3),
          color: colors.safety.yellow,
        },
        standardSuccess: {
          backgroundColor: alpha(colors.safety.green, 0.1),
          borderColor: alpha(colors.safety.green, 0.3),
          color: colors.safety.green,
        },
        standardInfo: {
          backgroundColor: alpha(colors.accent.primary, 0.1),
          borderColor: alpha(colors.accent.primary, 0.3),
          color: colors.accent.primary,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.border.default,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background.elevated,
          border: `1px solid ${colors.border.default}`,
          borderRadius: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          margin: "2px 4px",
          "&:hover": {
            backgroundColor: alpha(colors.accent.primary, 0.1),
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: colors.accent.primary,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.tertiary,
          borderRadius: 4,
        },
        bar: {
          backgroundColor: colors.accent.primary,
          borderRadius: 4,
        },
      },
    },
  },
});

// Export colors for use in components
export { colors };
