import { Details } from "@mui/icons-material";
import React, { useEffect, useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Store cart items state
  const itemArray = [];
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjo0ODkxNTgzMDI0LCJpYXQiOjE3Mzc5ODMwMjQsImp0aSI6ImIzMzU4MjczZDFjZjQ4YzY4OTc3N2ZhMWJjMDg3OTgwIiwidXNlcl9pZCI6Mn0.RN4ONI5MELM_tiHfLj3EiGMjfbqPu2v4TFZXdqoIPow";

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/cart/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        setCartItems(data); // Set cart items data in state
        console.log("Cart Data:", data);
        console.log('item', data);
        console.log('number of cart', data.length);
        data.forEach(element => {
            console.log('quantity', element.quantity);
            console.log('id', element.id);
        });
        console.log('number of cart', data.length);
  
        const items = data.map(element => element.item); // Extract items into an array
        return items;
      } catch (error) {
        console.error("Error fetching cart details:", error);
        return [];
      }
    };
  
    const fetchProductDetails = async (items) => {
      try {
        for (const element of items) {
          const response = await fetch(`http://localhost:8000/api/product/${element}/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
  
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
  
          const data = await response.json();
          console.log("Product Data:", data);
          console.log('titke',data.title)
          console.log('price',data.price)
          console.log('image',data.image)
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
  
    const fetchData = async () => {
      const items = await fetchCartDetails(); // Wait for cart details to fetch
      if (items.length > 0) {
        await fetchProductDetails(items); // Fetch product details based on cart items
      }
    };
  
    fetchData();
  }, [token]);
  

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((cartItem) => (
            <li key={cartItem.id}>
              <div>
                <h3>{cartItem.item.title}</h3>
                <p>Color: {cartItem.item_color_code}</p>
                <p>Size: {cartItem.item_size}</p>
                <p>Quantity: {cartItem.quantity}</p>
                <p>Price: ${cartItem.item.price}</p>
                <p>Total: ${(cartItem.quantity * cartItem.item.price).toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;

