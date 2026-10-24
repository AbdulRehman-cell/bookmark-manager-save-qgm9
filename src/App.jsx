import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <div className="nav-brand">Keep</div>
        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div className="nav-cta">
          <NavLink to="/dashboard" className="btn-primary">Start keeping</NavLink>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} Keep. A quiet archive.</p>
      </footer>
    </BrowserRouter>
  );
}