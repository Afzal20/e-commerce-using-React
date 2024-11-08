import React, {useState} from "react";
import AllProducts from "../components/Allproducts";
import NavbarWithDrawer from "../components/Navbar";
import PersistentDrawerLeft from "../components/Drawer";
import { Button, Box } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ProductPage = () => {
  const [open, setOpen] = useState(false); // Initially closed
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
  };

  return (
    <div>
      <NavbarWithDrawer/>
      <Box display="flex" justifyContent="space-between" p={2}>
        <Button 
        sx={{
          backgroundColor: "#D2b332",
          color: "white",
          cursor: "pointer",
        }}
          variant="contained" 
          onClick={handleDrawerOpen}
          endIcon ={<ArrowForwardIosIcon />}
        >
          Open Filter
        </Button>
      </Box>
      
      <PersistentDrawerLeft 
        open={open} 
        handleDrawerClose={handleDrawerClose} 
        onCategorySelect={handleCategorySelect} 
      />
      
      <AllProducts selectedCategories={selectedCategories} />
    </div>
  );
};

export default ProductPage