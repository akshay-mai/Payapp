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
];

const SecondPage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD'); 
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(''); 
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
  }); 

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleCardDetailChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleCheckout = () => {
    if (selectedPaymentMethod === 'Card') {
      
      alert(`Checkout initiated with card: ${cardDetails.cardNumber}`);
    } else {
      alert('Please select a payment method and fill out the details.');
    }
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
            <div className="card-content">
              <h2 className="product-name">{product.name}</h2>
              <p className="price">
                Price: {product.prices[selectedCurrency].symbol}
                {product.prices[selectedCurrency].price}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="payment-method-container">
        <label>Select Payment Method: </label>
        <select value={selectedPaymentMethod} onChange={handlePaymentMethodChange} className="payment-method-dropdown">
          <option value="">-- Select Payment Method --</option>
          <option value="Card">Card</option>
        </select>
      </div>

      
      {selectedPaymentMethod === 'Card' && (
        <div className="card-form">
          <h3>Enter Card Details:</h3>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={cardDetails.cardNumber}
            onChange={handleCardDetailChange}
          />
          <input
            type="text"
            name="expiryDate"
            placeholder="Expiry Date (MM/YY)"
            value={cardDetails.expiryDate}
            onChange={handleCardDetailChange}
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={cardDetails.cvv}
            onChange={handleCardDetailChange}
          />
          <input
            type="text"
            name="cardHolder"
            placeholder="Cardholder Name"
            value={cardDetails.cardHolder}
            onChange={handleCardDetailChange}
          />
        </div>
      )}

    
      <button onClick={handleCheckout} className="checkout-button">
        Checkout
      </button>
    </div>
  );
};

export default SecondPage;
