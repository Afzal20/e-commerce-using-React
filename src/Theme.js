import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#eee',
    },
    background: {
      default: '#f3e6af', 
    },
  },
});

export default theme;
