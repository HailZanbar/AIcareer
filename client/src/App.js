import React, { useState } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from "./pages/ProfilePage";
import AdminPage from './pages/AdminPage';
import {Route, Routes} from "react-router-dom";
import axios from "axios";
import {UserContextProvider} from "./UserContext";
import Layout from "./Layout";

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  const [currentForm, setCurrentForm] = useState('login')

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  return (
    <div className="App">
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>   
        </Routes>
      </UserContextProvider>
    </div>
  );
}

export default App;
