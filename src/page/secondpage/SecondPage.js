import React, { useEffect } from 'react';
import './SecondPage.css'; 
import { axiosInstance } from '../../api';
// import Gateways from "payment-p2epl";
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import axios from 'axios';
import { callApi } from '../../util';
import Gateways from 'ks-pay-package-pvt'

const productData = [
  {
    id: 1,
    name: 'Product A',
    prices: 1,
  },
  {
    id: 2,
    name: 'Product B',
    prices: 2,
  },
];

const SecondPage = () => {
  // console.log({Gateways})
  const urlbase={
    dev:process.env.REACT_APP_BASE_URL_DEV,
    qa:process.env.REACT_APP_BASE_URL_QA,
    SANDBOX:process.env.REACT_APP_BASE_URL_SANDBOX,
    LIVE:process.env.REACT_APP_BASE_URL_LIVE,


  }
  const env=localStorage.getItem('env')
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
      console.log('cuure')

      // let res= await axios.get(`${urlbase[env]}currencies`)
      let res = await callApi('currencies')
      console.log({res})
      if(res?.status==200)
      setCurrency(res?.data?.result)
    setSelectedCurrency(res?.data?.result[0])
    }catch(error){
      console.log(error)
      if(typeof error !=='string'){
  
        toast.error(error?.response?.data?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          // onClose:()=>window.location.reload()
          });
      }
    }

  }
  const getMethod=async ()=>{
    try{

      // let res= await axios.get(`${urlbase[env]}${selectedCurrency?.id}/payment-methods`)
      let res = await callApi(`${selectedCurrency?.id}/payment-methods`)
      // console.log({res})
      if(res?.status==200)
        setAllPaymentMethod(res?.data?.result)
      // setSelectedPaymentMethod(res?.data?.result[0])
    }catch(error){
      // console.log(e)
      if(typeof error !=='string'){
  
        toast.error(error?.response?.data?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          // onClose:()=>window.location.reload()
          });
      }
    }

  }
 const getSignature=async ()=>{
    let payload={
      "accessKey": localStorage.getItem('publicKey'),
       "secretKey": localStorage.getItem('secretKey')
   }
    try{

      // let res= await axios.post(`${urlbase[env]}auth/generate-signature/${localStorage.getItem('appId')}`,payload)
      let res =await callApi(`auth/generate-signature/${localStorage.getItem('appId')}`,payload)
      // console.log({res})
      
      

        setSign(res?.data?.result)
        // console.log('hello')
        let allData={
          payload:mainPayload,
          headers:headers,
          transactionStatusCallback:transactionStatusCallback
        }

        // navigate('/pay',{state:JSON.stringify(allData)})
        // navigate('/pay')

    
        // setAllPaymentMethod(res?.data?.result)
      // setSelectedPaymentMethod(res?.data?.result[0])
    }catch(error){
      // console.log(e)
      if(typeof error !=='string'){
  
        toast.error(error?.response?.data?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          // onClose:()=>window.location.reload()
          });
      }
    }

  } 

  React.useEffect(()=>{
    getCurrecny()
  },[])
  React.useEffect(()=>{
    if(selectedCurrency){
      getMethod()
    }
    // console.log({selectedCurrency})
  },[selectedCurrency])
  useEffect(()=>{
console.log(sign)
  },[sign])

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
    if ( selectedCurrency &&selectedProduct) {
      
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
  const mainPayload = {
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
    // console.log('payload ::: from main call back', payload);
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
  environment:localStorage.getItem('env'),
  "x-token":`Bearer ${localStorage.getItem('access_token')}`
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

      {/* <div className="payment-method-container">
        <label>Select Payment Method: </label>
        <select value={selectedPaymentMethod} onChange={handlePaymentMethodChange} className="payment-method-dropdown">
          <option value="">-- Select Payment Method --</option>
          {
            allPaymentMethod.map((method,index)=>
              <option key={method?.id} value={method?.id}>{method?.name}</option>
            )
          }
        </select>
      </div> */}



      
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
      //   // sign && React.createElement(Gateways,{payload:payload,headers:headers,transactionStatusCallback:transactionStatusCallback}) 
        sign &&  <Gateways  payload={mainPayload} headers={headers} transactionStatusCallback={transactionStatusCallback}/>
      }
      {/* {
        sign && console.log('hello 1')
      } */}
    </div>
  );
};

export default SecondPage;
