import React from 'react';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AdminDashboard from './components/Admin/Dashboard';
import OperatorDashboard from './components/Operator/Dashboard';
import ParentDashboard from './components/Parent/Dashboard';

function App() {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Login />;
  }

  switch (currentUser.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'operator':
      return <OperatorDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <div style={{textAlign: 'center', marginTop: '2rem'}}><h1>Unknown Role error.</h1></div>;
  }
}

export default App;
