import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Loading...</div>; // Handle case where context is not yet available
  }

  const { address, signOut } = authContext;

  return (
    <div>
      {address ? (
        <>
          <p>Connected with address: {address}</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
};

export default Dashboard;
