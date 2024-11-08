// src/api.js or src/utils/api.js
import { BaseUrls } from "../env";

export const fetchItems = async () => {
  const response = await fetch(`${BaseUrls}items/`);
  if (!response.ok) throw new Error('Failed to fetch items');
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${BaseUrls}categories/`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};
