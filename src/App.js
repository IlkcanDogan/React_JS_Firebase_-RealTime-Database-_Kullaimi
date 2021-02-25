import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import LoginPage from './components/login/LoginPage';
import { AuthProvider } from './components/extra/auth';
import PrivateRoute from './components/extra/privateRoute'
import Dashboard from './components/dashboard/Dashboard';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Route exact path='/' component={LoginPage}/>
          <PrivateRoute exact path='/dashboard' component={Dashboard}/>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
