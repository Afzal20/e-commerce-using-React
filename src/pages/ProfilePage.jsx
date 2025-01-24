import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const parsedToken = JSON.parse(token); // Parse the JSON string
        console.log('User Details:', parsedToken.user); // Log user details
        console.log('Access Token:', parsedToken.access); // Log access token
      } catch (error) {
        console.error('Error parsing token:', error);
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
