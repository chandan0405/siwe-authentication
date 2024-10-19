import React from 'react';
import { AuthProvider } from './context/AuthContext';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div>
        <SignIn />
        <Dashboard />
      </div>
    </AuthProvider>
  );
};

export default App;




