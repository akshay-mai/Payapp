import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import "./main.css";

const KeyForm = () => {
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate(); 

  const handlePublicKeyChange = (e) => {
    setPublicKey(e.target.value);
    validateForm(e.target.value, secretKey);
  };

  const handleSecretKeyChange = (e) => {
    setSecretKey(e.target.value);
    validateForm(publicKey, e.target.value);
  };

  const validateForm = (publicKeyValue, secretKeyValue) => {
    if (publicKeyValue && secretKeyValue) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Public Key:', publicKey);
    console.log('Secret Key:', secretKey);
    
  
    navigate('/secondpage');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="publicKey">Public Key</label>
        <input
          type="text"
          id="publicKey"
          value={publicKey}
          onChange={handlePublicKeyChange}
          required
        />
      </div>
      <div>
        <label htmlFor="secretKey">Secret Key</label>
        <input
          type="password"
          id="secretKey"
          value={secretKey}
          onChange={handleSecretKeyChange}
          required
        />
      </div>
      <div>
        <button type="submit" disabled={isButtonDisabled}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default KeyForm;
