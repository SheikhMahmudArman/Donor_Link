import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import FindDonor from "./pages/FindDonor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/find-donor" element={<FindDonor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;