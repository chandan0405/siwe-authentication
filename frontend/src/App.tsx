import React from 'react';
import { AuthProvider } from './context/AuthContext';
import SignIn from './components/SignIn';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastContainer autoClose={2000} />
        <SignIn />
    </AuthProvider>
  );
};

export default App;




