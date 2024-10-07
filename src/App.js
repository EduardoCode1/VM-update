import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegisterClient from './componentes/RegisterClient';
import ClientList from './componentes/ClientList';
import SearchClient from './componentes/SearchClient';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Register Client</Link>
            </li>
            <li>
              <Link to="/clients">Client List</Link>
            </li>
            <li>
              <Link to="/search">Search Client</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<RegisterClient />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/search" element={<SearchClient />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
