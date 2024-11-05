import React from "react";
import Allproducts from "../components/Allproducts";
import NavbarWithDrawer from "../components/Navbar";

const HomePage = () => {
  return (
    <>
      <NavbarWithDrawer/>
      <Allproducts />
    </>
  );
};

export default HomePage;
