import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MoreIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/AccountCircle';
import logo from "../assets/img/logo-2-300x124.png";

const Search = styled('div')(({ theme }) => ({
    color: "#E7C400",
    border: `1px solid #E7C400`,
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(8)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "30ch",
        },
    },
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function Navbar() {
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const token = localStorage.getItem('authToken');
    const [cartItems, setCartItems] = React.useState([]);

    const [totalCartItems, setTotalCartItems] = React.useState(0);
    
    React.useEffect(() => {
        const fetchCartItems = async () => {
          try {
            const response = await fetch("http://localhost:8000/api/cart/", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
    
            if (!response.ok) {
              throw new Error("Failed to fetch cart data");
            }
    
            const data = await response.json();
            setCartItems(data.items || []); // Assuming API returns { items: [...] }
            setTotalCartItems(data.length || 0);
            console.log("Cart Data:", data.length);
          } catch (error) {
            console.error("Error fetching cart items:", error);
          }
        };
    
        fetchCartItems();
      }, [token]);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem component={Link} to="/">
                <IconButton size="large" aria-label="home" color="inherit" sx={{ color: "#E7C400" }}>
                    <Badge>
                        <HomeIcon sx={{ color: "#E7C400" }} />
                    </Badge>
                </IconButton>
                <p>Home</p>
            </MenuItem>
            <MenuItem component={Link} to="/cart">
                <IconButton size="large" aria-label="cart" color="inherit" sx={{ color: "#E7C400" }}>
                    <Badge badgeContent={totalCartItems} color="error">
                        <ShoppingCartIcon sx={{ color: "#E7C400" }} />
                    </Badge>
                </IconButton>
                <p>Cart</p>
            </MenuItem>
            <MenuItem component={Link} to="/profile">
                <IconButton size="large" aria-label="profile" color="inherit" sx={{ color: "#E7C400" }}>
                    <PersonIcon sx={{ color: "#E7C400" }} />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: "#010414" }}>
                <Toolbar>
                    <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="logo" style={{ height: '40px', marginRight: '8px' }} />
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon sx={{ color: "#E7C400" }} />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton size="large" aria-label="home" color="inherit" component={Link} to="/" sx={{ color: "#E7C400" }}>
                            <Badge>
                                <HomeIcon sx={{ color: "#E7C400" }} />
                            </Badge>
                        </IconButton>
                        <IconButton size="large" aria-label="cart" color="inherit" component={Link} to="/cart" sx={{ color: "#E7C400" }}>
                            <Badge badgeContent={totalCartItems} color="error">
                                <ShoppingCartIcon sx={{ color: "#E7C400" }} />
                            </Badge>
                        </IconButton>
                        <IconButton size="large" aria-label="profile" color="inherit" component={Link} to="/profile" sx={{ color: "#E7C400" }}>
                            <PersonIcon sx={{ color: "#E7C400" }} />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon sx={{ color: "#E7C400" }} />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
        </Box>
    );
}
