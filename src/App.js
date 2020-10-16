import React from "react";
import "./App.css";
import LoginPage from "./components/LoginPage";
import Editor from "./components/Editor";
import Profile from "./components/Profile";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
