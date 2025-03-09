import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import "./main.css";
import axios from 'axios';
import { getStatusById } from '../../util';
import { Bounce, toast } from 'react-toastify';
// import { axiosInstance } from '../../api';

const KeyForm = () => {
  const getStatus=async()=>{
    try{

      let res1=await getStatusById(params.get('txnId'))
      console.log({res1})
      if(res1){
        window.location.href=`/success?payload=${JSON.stringify({txnId:params.get('txnId'),status:res1?.data?.result?.status})}`
      }
      
    }catch(err){
      console.log(err)
    }

    // console.log(res1)




  }
  const url = new URL(window.location.href);

    // Get the search parameters
    const params = new URLSearchParams(url.search);
    
    // Access individual parameters
    const param1 = params.get('txnId'); // "value1"
    // const param2 = JSON.parse(param1) // "value2"
    if(param1){
  
      
getStatus()
     
      // console.log(res1)

    //  window.location.href=`/success?payload=${JSON.stringify({txnId:params.get('txnId'),status:'Pending'})}`
    }

   
    
    // console.log(param2);
  const [publicKey, setPublicKey] = React.useState('');
  const [secretKey, setSecretKey] = React.useState('');
  const [appId, setAppId] = React.useState('');
  const [env, setEnv] = React.useState('');
  // const navigate=useNavigate()

  


  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
  const navigate = useNavigate(); 

  const handlePublicKeyChange = (e) => {
    setPublicKey(e.target.value);
    validateForm(e.target.value, secretKey,appId,env);
  };

  const handleSecretKeyChange = (e) => {
    setSecretKey(e.target.value);
    validateForm(publicKey, e.target.value,appId,env);
  };
  const handleAppIdChange = (e) => {
    setAppId(e.target.value);
    validateForm(publicKey,secretKey, e.target.value,env);
  };

  const validateForm = (publicKeyValue, secretKeyValue,appId,env) => {
    console.log(publicKeyValue, secretKeyValue,appId,env)
    if (publicKeyValue && secretKeyValue && appId && env) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const handleSubmit = async(e) => {
    const url={
      dev:process.env.REACT_APP_BASE_URL_DEV,
      qa:process.env.REACT_APP_BASE_URL_QA,
      SANDBOX:process.env.REACT_APP_BASE_URL_SANDBOX,
      LIVE:process.env.REACT_APP_BASE_URL_LIVE,
      STG_SANDBOX:process.env.REACT_APP_BASE_URL_STG_SANDBOX,
      STG_LIVE:process.env.REACT_APP_BASE_URL_STG_LIVE,


    }
    e.preventDefault();

    console.log('Public Key:', publicKey);
    console.log('Secret Key:', secretKey);
    console.log('App id:', appId);
    try{

      let res=await axios.post(`${url[env]}auth/generate-token/${appId}`,{
        "accessKey": publicKey,
         "secretKey": secretKey
         
     })
      localStorage.setItem('access_token',res?.data?.result?.accessToken)
      localStorage.setItem('refresh_token',res?.data?.result?.refreshToken)
      localStorage.setItem('appId',appId)
      localStorage.setItem('publicKey',publicKey)
      localStorage.setItem('secretKey',secretKey)
      localStorage.setItem('env',env)



      navigate('/secondpage');

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
    
  };

  const handleChange=(e)=>{
    setEnv(e?.target?.value)
    validateForm(publicKey,secretKey, appId,e?.target?.value);


    
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <div className='mb-3'>
        <label htmlFor="publicKey">Public Key</label>
        <input
          type="text"
          id="publicKey"
          value={publicKey}
          onChange={handlePublicKeyChange}
          required
        />
      </div>
      <div className='mb-3'>
        <label htmlFor="secretKey">Secret Key</label>
        <input
          type="password"
          id="secretKey"
          value={secretKey}
          onChange={handleSecretKeyChange}
          required
        />
      </div>
      <div className='mb-3'>
        <label htmlFor="appId">App Id</label>
        <input
          type="text"
          id="appId"
          value={appId}
          onChange={handleAppIdChange}
          required
        />
      </div>
      <div className='mb-3'>
        <label htmlFor="env">Envorment</label>
        <select onChange={handleChange} id='env'>
        <option value=''>Select</option>
          <option value='dev'>DEV</option>
          <option value='qa'>QA</option>
          <option value='STG_SANDBOX'>Stage SANDBOX</option>
          <option value='STG_LIVE'>Stage  LIVE</option>
          <option value='SANDBOX'>Live SANDBOX</option>
          <option value='LIVE'> LIVE</option>


        </select>
        {/* <input
          type="password"
          id="secretKey"
          value={appId}
          onChange={handleAppIdChange}
          required
        /> */}
      </div>
      <div className='mb-3'>
        <button type="submit" disabled={isButtonDisabled}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default KeyForm;
