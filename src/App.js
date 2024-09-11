import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KeyForm from './page/mainpage/keyform'; 
import SecondPage from './page/secondpage/SecondPage'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<KeyForm />} />
          <Route path="/secondpage" element={<SecondPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
