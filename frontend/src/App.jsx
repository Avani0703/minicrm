import React, { useState } from 'react';
import Signup from './Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './home';
import Audience from './Audience';
import AddAudience from './AddAudience';
import Message from './Message';
import CampaignHistory from './CampaignHistory';
import Header from './Header';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Signup />} ></Route>
        <Route path="/login" element={<Login />} ></Route>
        <Route path="/home" element={<Home />} ></Route>
        <Route path="/audience-size" element={<Audience />} ></Route>
        <Route path="/add-audience" element={<AddAudience />} ></Route>
        <Route path="/send-messages" element={<Message />} ></Route>
        <Route path="/campaign-history" element={<CampaignHistory />} ></Route>
        <Route path="/Header" element={<Header />} ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
