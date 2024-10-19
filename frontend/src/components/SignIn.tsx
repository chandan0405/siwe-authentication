import React, { useContext } from 'react';
import { ethers } from 'ethers'; // Adjust import for ethers v6
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const SignIn: React.FC = () => {
  const { address } = useContext(AuthContext);

  const connectWallet = async (): Promise<string | undefined> => {
    if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', []);
      return accounts[0];
    } else {
      alert('Please install MetaMask');
      return undefined;
    }
  };

  const signIn = async () => {
    const address = await connectWallet();
    if (!address) return;
  
    try {
      // Update the URL to point to the correct backend port (4000)
      const { data } = await axios.get('http://localhost:4000/api/nonce', { withCredentials: true });
      const nonce = data.nonce;
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const message = `I am signing my one-time nonce: ${nonce}`;
      const signature = await signer.signMessage(message);
      console.log("signature", signature)
      await axios.post('http://localhost:4000/api/login', { address, signature }, { withCredentials: true });
      console.log('Signed in successfully');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };
  
  

  return (
    <div>
      {!address ? (
        <button onClick={signIn}>Sign in with Ethereum</button>
      ) : (
        <p>Signed in as: {address}</p>
      )}
    </div>
  );
};

export default SignIn;
