import React, { createContext, useContext, useState } from 'react';

// Create the context
const NavigationContext = createContext();

// Provider component
export const NavigationProvider = ({ children }) => {
  const [navigationData, setNavigationData] = useState({
    productId: null,
    color: '',
    size: '',
    quantity: 1,
  });

  const updateNavigation = (productId, color, size, quantity) => {
    setNavigationData({ productId, color, size, quantity });
  };

  return (
    <NavigationContext.Provider value={{ navigationData, updateNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook for easier consumption
export const useNavigation = () => useContext(NavigationContext);
