import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Ensure the token is valid JSON
        const parsedToken = JSON.parse(token); 
        console.log('User Details:', parsedToken?.user || 'No user details'); 
        console.log('Access Token:', parsedToken?.access || 'No access token'); 
      } catch (error) {
        console.error('Error parsing token:', error);
        // Optional: Clear the invalid token
        localStorage.removeItem('token');
      }
    } else {
      console.log('No user is logged in.');
    }
  }, []);

  return (
    <>
      <Navbar />
      <div>ProfilePage</div>
    </>
  );
};

export default ProfilePage;
