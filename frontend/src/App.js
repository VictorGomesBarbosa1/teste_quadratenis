import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import CourtList from './components/CourtList';
import CourtForm from './components/CourtForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<CourtList />} />
          <Route path="/add" element={<CourtForm />} />
          <Route path="/edit/:id" element={<CourtForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

