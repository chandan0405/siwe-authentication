import React, { useContext, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const SignIn: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { address, setAddress } = authContext;
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false); // New state to track sign-in status

  // Function to connect MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setAddress(accounts[0]);
        setIsWalletConnected(true);
        setIsSignedIn(false); // Reset sign-in status on new connection
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('MetaMask is not installed');
    }
  };

  // Sign in function that sends the address and signature to the backend
  const signIn = async () => {
    if (!address) return;

    try {
      const { data } = await axios.get('http://localhost:4000/api/nonce', { withCredentials: true });
      const nonce = data.nonce;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const message = `I am signing my one-time nonce: ${nonce}`;
      const signature = await signer.signMessage(message);

      await axios.post(
        'http://localhost:4000/api/login',
        { address, signature },
        { withCredentials: true }
      );
      setIsSignedIn(true); // Set signed-in status to true after successful sign-in
      console.log('Signed in successfully');
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  // Sign-out function
  const signOut = async () => {
    try {
      await axios.post('http://localhost:4000/api/logout', {}, { withCredentials: true });
      setAddress(null);
      setIsWalletConnected(false);
      setIsSignedIn(false); // Reset sign-in status
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      {!isWalletConnected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          {!isSignedIn ? (
            <button onClick={signIn}>Sign In</button> // Show "Sign In" after wallet connection
          ) : (
            <>
              <p>Signed in as: {address}</p>
              <button onClick={signOut}>Sign Out</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SignIn;
