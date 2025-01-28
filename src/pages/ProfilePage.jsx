import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      // Use the provided access token directly
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjo0ODkxNTgzMDI0LCJpYXQiOjE3Mzc5ODMwMjQsImp0aSI6ImIzMzU4MjczZDFjZjQ4YzY4OTc3N2ZhMWJjMDg3OTgwIiwidXNlcl9pZCI6Mn0.RN4ONI5MELM_tiHfLj3EiGMjfbqPu2v4TFZXdqoIPow';

      try {
        // Fetch user details using the access token
        const response = await axios.get('http://localhost:8000/dj-rest-auth/user/', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

        setUserDetails(response.data); // Update state with user details
        console.log('User Details:', response.data);
      } catch (err) {
        console.error('Error fetching user details:', err.response?.data || err.message);

        // Handle errors like token expiration or invalid token
        if (err.response?.status === 401) {
          setError('Token is invalid or expired. Please log in again.');
        } else {
          setError('Failed to fetch user details. Please try again later.');
        }
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Profile Page</h1>
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : userDetails ? (
          <div>
            <p>
              <strong>Username:</strong> {userDetails.first_name || 'set a username'}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email || 'N/A'}
            </p>
            {/* Add other user fields if required */}
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
