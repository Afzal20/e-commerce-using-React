import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000',
    },
    // background: {
    //   default: '#f3e6af', 
    // },
  },
});

export default theme;
