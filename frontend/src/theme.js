import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8B5E3C",
    },
    divider: "rgba(255, 255, 255, 0.4)",
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
      h4: { color: "rgba(180, 140, 100, 0.9)" },
  h5: { color: "rgba(180, 140, 100, 0.9)" },
  h6: { color: "rgba(180, 140, 100, 0.9)" },

  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "rgba(180, 140, 100, 0.5)",
        },
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(180, 140, 100, 0.5)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(180, 140, 100, 0.9)",
          },
        },
      },
    },
    MuiMobileDatePicker: {
      defaultProps: {
        slotProps: {
          textField: {
            sx: {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(180, 140, 100, 0.5)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(180, 140, 100, 0.9)",
              },
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "36px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#2a1f1a",
          color: "rgba(180, 140, 100, 0.9)",
        },
      },
    },
    MuiTableRow: {
  styleOverrides: {
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
      },
      "&:hover": {
        backgroundColor: "rgba(180, 140, 100, 0.08) !important",
      },
    },
  },
},
MuiTableCell: {
  styleOverrides: {
    head: {
      backgroundColor: "#2a1f1a",
      color: "rgba(180, 140, 100, 0.9)",
    },
    body: {
      color: "rgba(220, 200, 180, 0.9)",
    },
  },
},
MuiTablePagination:{
    styleOverrides:{
        selectLabel:{
            color: "rgba(180, 140, 100, 0.9)",
        },
        selectIcon:{
            color: "rgba(220, 200, 180, 0.9)"
        },
        displayedRows:{
            color: "rgba(220, 200, 180, 0.9)"
        }
    }
},
MuiSelect:{
    styleOverrides:{
        select:{
            color: "rgba(220, 200, 180, 0.9)"
        }
    }
},
MuiListItemIcon:{
    styleOverrides:{
        root:{
            minWidth: "36px",
            color: "rgba(180, 140, 100, 0.9)"
        }
    }
}
  },
  
  
});

export default theme;
