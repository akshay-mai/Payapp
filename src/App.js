import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KeyForm from './page/mainpage/keyform'; 
import SecondPage from './page/secondpage/SecondPage'; 
import Success from './page/Success';
import Transaction from './page/Transaction/index';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<KeyForm />} />
          <Route path="/secondpage" element={<SecondPage />} />
          <Route path="/success" element={<Success />} />
          <Route path="/trans" element={<Transaction />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
