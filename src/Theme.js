import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#eee',
    },
    background: {
      default: '#dee5ec', 
    },
  },
});

export default theme;
