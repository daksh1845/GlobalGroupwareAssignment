import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import Login from './components/Login';
import UsersList from './components/UsersList';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <UsersList />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;