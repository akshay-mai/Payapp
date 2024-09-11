import React, { useState } from 'react';
import './SecondPage.css'; 

const productData = [
  {
    id: 1,
    name: 'Product A',
    prices: {
      USD: { symbol: '$', price: 100 },
      EUR: { symbol: '€', price: 90 },
      GBP: { symbol: '£', price: 80 },
      INR: { symbol: '₹', price: 7500 },
      JPY: { symbol: '¥', price: 11000 },
    },
  },
  {
    id: 2,
    name: 'Product B',
    prices: {
      USD: { symbol: '$', price: 150 },
      EUR: { symbol: '€', price: 135 },
      GBP: { symbol: '£', price: 120 },
      INR: { symbol: '₹', price: 11000 },
      JPY: { symbol: '¥', price: 16500 },
    },
  },
  {
    id: 3,
    name: 'Product C',
    prices: {
      USD: { symbol: '$', price: 200 },
      EUR: { symbol: '€', price: 180 },
      GBP: { symbol: '£', price: 160 },
      INR: { symbol: '₹', price: 15000 },
      JPY: { symbol: '¥', price: 22000 },
    },
  },
];

const SecondPage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD'); 

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value); 
  };



  return (
    <div className="container">
      <h1>Checkout Page</h1>

     
      <div className="dropdown-container">
        <label htmlFor="currency">Select Currency: </label>
        <select id="currency" value={selectedCurrency} onChange={handleCurrencyChange} className="dropdown">
          {Object.keys(productData[0].prices).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      
      <div className="cards-container">
        {productData.map((product) => (
          <div key={product.id} className="card">
            <h2>{product.name}</h2>
            <p>
              Price: {product.prices[selectedCurrency].symbol}
              {product.prices[selectedCurrency].price}
            </p>
          
          </div>
        ))}
      </div>
      <button
      className="checkout-button">
             Checkout
           </button>
    </div>
  );
};

export default SecondPage;
