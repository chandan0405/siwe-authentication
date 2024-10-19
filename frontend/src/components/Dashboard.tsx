import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { address, signOut } = useContext(AuthContext);

  return (
    <div>
      <p>Signed in as: {address}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default Dashboard;
