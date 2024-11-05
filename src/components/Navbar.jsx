import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import { Box, Typography } from '@mui/material';
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip"; // Import Tooltip
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import logo from "../assets/img/logo-2-300x124.png";
import { BaseUrls } from "../env";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("lg")]: {
    marginLeft: theme.spacing(3),
    width: "60%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#E7C400",
  border: `1px solid #E7C400`,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const drawerWidth = 240;

const NavbarWithDrawer = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [checkedFilters, setCheckedFilters] = React.useState([]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [filterOptions, setFilterOptions] = React.useState([]);

  

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BaseUrls}categories/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFilterOptions(data.map(category => category.name));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);


  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checkedFilters.indexOf(value);
    const newChecked = [...checkedFilters];

    if (currentIndex === -1) {
      newChecked.push(value);
      newChecked.forEach(element => {
        console.log(element); // Log the selected filter value
      });
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedFilters(newChecked);
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem component={NavLink} to="/">
        <IconButton size="large" aria-label="home" color="inherit">
          <HomeIcon sx={{ color: "#E7C400" }} />
        </IconButton>
      </MenuItem>
      <MenuItem component={NavLink} to="/cart">
        <IconButton
          size="large"
          aria-label="show 4 items in cart"
          color="inherit"
        >
          <Badge badgeContent={4} color="error">
            <ShoppingCartIcon sx={{ color: "#E7C400" }} />
          </Badge>
        </IconButton>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle sx={{ color: "#E7C400" }} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Tooltip title="Open Filters">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              sx={{ mr: 2, borderRadius: 2 }} // Adjust the borderRadius as needed
            >
              <Typography variant="button" sx={{ color: "#E7C400", mr: 1 }}>
                Filter by
              </Typography>
              <ArrowForwardIosIcon sx={{ color: "#E7C400" }} />
            </IconButton>

          </Tooltip>
          <NavLink to="/" style={{ display: { xs: "none", sm: "block" } }}>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ height: 50, mr: 2, display: { xs: "none", sm: "block" } }}
            />
          </NavLink>
          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: "#E7C400" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton size="large" color="inherit" component={NavLink} to="/">
              <HomeIcon sx={{ color: "#E7C400" }} />
            </IconButton>

            <IconButton
              size="large"
              aria-label="show 4 items in cart"
              color="inherit"
              component={NavLink}
              to="/cart"
            >
              <Badge badgeContent={4} color="error">
                <ShoppingCartIcon sx={{ color: "#E7C400" }} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              color="inherit"
              component={NavLink}
              to="/profile"
            >
              <AccountCircle sx={{ color: "#E7C400" }} />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon sx={{ color: "#E7C400" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        aria-label="Filter Drawer" // Accessible label for screen readers
      >
        <DrawerHeader>
          <Box display="flex" alignItems="center">
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ height: 50, mr: 2, display: { xs: "none", sm: "block" } }}
            />
            <Tooltip title="Close Drawer">
              <IconButton onClick={handleDrawerClose} aria-label="Close Drawer">
                {theme.direction === "ltr" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </DrawerHeader>

        <Divider />
        {filterOptions.map((filter, index) => (
          <ListItem key={filter} sx={{ paddingLeft: "20px" }} disablePadding>
            <Checkbox
              edge="start"
              checked={checkedFilters.indexOf(filter) !== -1}
              tabIndex={-1}
              disableRipple
              onChange={handleToggle(filter)}
              sx={{ color: "#E7C400" }}
              aria-label={`Filter by ${filter}`} // Aria-label for each filter checkbox
            />
            <ListItemText primary={filter} sx={{ color: "#E7C400" }} />
          </ListItem>
        ))}
        <Divider />
      </Drawer>
    </Box>
  );
};

export default NavbarWithDrawer;
