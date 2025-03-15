import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import ChannelsList from './components/ChannelsList';
import ChannelDetail from './components/ChannelDetail';
import MessageDetail from './components/MessageDetail';
import Search from './components/Search';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Landing</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/channels">Channels</Link> |{" "}
        <Link to="/search">Search</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/channels" element={<ChannelsList />} />
        <Route path="/channel/:channelId" element={<ChannelDetail />} />
        <Route path="/message/:messageId" element={<MessageDetail />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
