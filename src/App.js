import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


import { SearchPage } from './app/components/search-page/SearchPage';
import { NavBar } from './app/components/nav-bar/NavBar';
import { DetailsPage } from './app/components/tv-show-details/DetailsPage';

import './App.css';
function App() {
  return (
    <Router>
      <div>
        <NavBar></NavBar>
        <Routes>
          <Route path="/search-page" element={<SearchPage />} />
          <Route path='*' exact={true} element={<SearchPage />} />
          <Route path='tv-show/:id' exact={true} element={<DetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
