import React from 'react';
import './SecondPage.css'; 
import { axiosInstance } from '../../api';
// import Gateways from "payment-p2epl";
import Gateways from 'ks-pay-package-pvt'
import { useNavigate } from 'react-router-dom';
const productData = [
  {
    id: 1,
    name: 'Product A',
    prices: 200,
  },
  {
    id: 2,
    name: 'Product B',
    prices: 100,
  },
];

const SecondPage = () => {
  console.log({Gateways})
  const [selectedCurrency, setSelectedCurrency] = React.useState(null); 
  const [allCurrency, setCurrency] = React.useState([]); 
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(null); 
  const [allPaymentMethod, setAllPaymentMethod] = React.useState([]); 
  const[selectedProduct,setSelectedroduct]=React.useState(null)
  const[sign,setSign]=React.useState('')
  const navigate=useNavigate()


  // const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(''); 
  const [cardDetails, setCardDetails] = React.useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
  }); 
  const getCurrecny=async ()=>{
    try{

      let res= await axiosInstance.get('/currencies')
      // console.log({res})
      if(res?.status==200)
      setCurrency(res?.data?.result)
    setSelectedCurrency(res?.data?.result[0])
    }catch(e){
      console.log(e)
    }

  }
  const getMethod=async ()=>{
    try{

      let res= await axiosInstance.get(`/${selectedCurrency?.id}/payment-methods`)
      // console.log({res})
      if(res?.status==200)
        setAllPaymentMethod(res?.data?.result)
      // setSelectedPaymentMethod(res?.data?.result[0])
    }catch(e){
      console.log(e)
    }

  }
  const getSignature=async ()=>{
    let payload={
      "accessKey": localStorage.getItem('publicKey'),
       "secretKey": localStorage.getItem('secretKey')
   }
    try{

      let res= await axiosInstance.post(`auth/generate-signature/${localStorage.getItem('appId')}`,payload)
      console.log({res})
      
      

        setSign(res?.data?.result)
    
        // setAllPaymentMethod(res?.data?.result)
      // setSelectedPaymentMethod(res?.data?.result[0])
    }catch(e){
      console.log(e)
    }

  }

  React.useEffect(()=>{
    getCurrecny()
  },[])
  React.useEffect(()=>{
    if(selectedCurrency){
      getMethod()
    }
    console.log({selectedCurrency})
  },[selectedCurrency])

  const handleCurrencyChange = (e) => {
    // console.log(e?.target?.value)
    let value=JSON.parse(e?.target?.value)
    setSelectedCurrency(value);
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleCardDetailChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleCheckout = () => {
    if (selectedPaymentMethod && selectedCurrency &&selectedProduct) {
      
      // alert(`Checkout initiated with card: ${cardDetails.cardNumber}`);
      getSignature()
    } else {
      alert('Please select all details.');
    }
  };
  // const payload = {
  //   referenceNumber: "REFRENCE_NUMBER",
  //   amount: "AMOUNT",
  //   currencyId: "CURRENCY_ID",
  //   paymentMethodId: "PAYMENT_METHOD_ID"
  // };

  // const headers = {
  //   x-signature: "YOUR_APP_SIGNATURE",
  //   environment: "URL"
  // };

  // const transactionStatusCallback = (payload) => {
  //   setTransactionPayload(payload);
  // };
  const payload = {
    referenceNumber: generateRandomString(),
    amount: Number(selectedProduct),
    currencyId: selectedCurrency?.id,
    paymentMethodId: selectedPaymentMethod ,
    // redirect_url:'local'
  };

  function generateRandomString(length = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }
  const transactionStatusCallback = (payload) => {
    console.log('payload ::: from main call back', payload);
    navigate('/success',{state:payload})
    window.location.href=`/success?payload=${JSON.stringify(payload)}`
  };

  const getEnvironmentUrl = (env) => {
    const baseUrls = {
      local: 'http://localhost:8002',
      qa: 'https://qa-ks-pay-openapi.p2eppl.com',
      dev: 'https://dev-ks-pay-openapi.p2eppl.com',
      SANDBOX: 'https://stg-ks-pay-sandboxapi.p2eppl.com',
      LIVE: 'https://stg-ks-pay-liveapi.p2eppl.com',

    };
    return baseUrls[env];
  };
const headers = {
  "content-type": "application/json",
  "x-signature": sign,
  environment:localStorage.getItem('env')
};
  return (
    <div className="container">
      <h1>Checkout Page</h1>

    
      <div className="dropdown-container">
        <label htmlFor="currency">Select Currency: </label>
        <select id="currency"  onChange={handleCurrencyChange} className="dropdown">
      
          {allCurrency.map((currency) => (
            <option key={currency}  value={JSON.stringify(currency)}>
              {currency?.name}
            </option>
          ))}
        </select>
      </div>

    
      <div className="cards-container">
        {productData.map((product) => (
          <div key={product.id} onClick={()=>setSelectedroduct(product?.prices)} className={`card ${selectedProduct===product?.prices && 'selected-card'}`}>
            <div className="card-content">
              <h2 className="product-name">{product.name}</h2>
              <p className="price" style={{color:'white'}}>
                Price: {selectedCurrency?.symbol}
                {product?.prices}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="payment-method-container">
        <label>Select Payment Method: </label>
        <select value={selectedPaymentMethod} onChange={handlePaymentMethodChange} className="payment-method-dropdown">
          <option value="">-- Select Payment Method --</option>
          {
            allPaymentMethod.map((method,index)=>
              <option key={method?.id} value={method?.id}>{method?.name}</option>
            )
          }
        </select>
      </div>



      
      {/* {selectedPaymentMethod === 'Card' && (
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
      )} */}

    
      <button onClick={handleCheckout} className="checkout-button">
        Checkout
      </button>
      {/* {sign? <div>hello</div>:<div>bye</div>} */}
     

      {
        // sign && React.createElement(Gateways,{payload:payload,headers:headers,transactionStatusCallback:transactionStatusCallback}) 
        sign &&  <Gateways  payload={payload} headers={headers} transactionStatusCallback={transactionStatusCallback}/>
      }
    </div>
  );
};

export default SecondPage;
