import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import KeyForm from './page/mainpage/keyform'; 
import SecondPage from './page/secondpage/SecondPage'; 
import Success from './page/Success';
import Transaction from './page/Transaction/index';
import Payment from './page/payment';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<KeyForm />} />
          <Route path="/secondpage" element={<SecondPage />} />
          <Route path="/success" element={<Success />} />
          <Route path="/trans" element={<Transaction />} />
          <Route path="*" element={<Navigate to="/secondpage" replace />} />
          {/* <Route path="/pay" element={<Payment />} /> */}

        </Routes>
      </div>
    </Router>
  );
}

const NotFound = () => {
  // You can customize this component as needed
  return <h1>404 - Not Found</h1>;
};
export default App;
