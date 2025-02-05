// src/api.js or src/utils/api.js
import { BaseUrls } from "../env";

export const fetchItems = async () => {
  try {
    const response = await fetch(`${BaseUrls}api/items/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error; // Rethrow the error so it can be caught by the caller if needed
  }
};

export const fetchCategories = async () => {
  const response = await fetch(`${BaseUrls}api/categories/`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};
