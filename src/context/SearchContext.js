import React, { createContext, useContext, useState } from 'react';

// Create a context for search
const SearchContext = createContext();

// Search provider component
export const SearchProvider = ({ children }) => {
    // State for search term
    const [searchTerm, setSearchTerm] = useState('');
    // State for setting max results
    const [maxResults, setMaxResults] = useState(10);

    // Function to update search term
    const updateSearchTerm = (newTerm) => {
        setSearchTerm(newTerm);
    };

    // Function to update max results
    const updateMaxResults = (newMaxResults) => {
        setMaxResults(newMaxResults);
    };

    return (

        { children }
    );
};

// Custom hook to use the search context
export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};