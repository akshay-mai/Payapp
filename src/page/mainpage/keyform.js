import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import "./main.css";
import axios from 'axios';
import { axiosInstance } from '../../api.ts';

const KeyForm = () => {
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [appId, setAppId] = useState('');
  const [env, setEnv] = useState('');


  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
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
    e.preventDefault();

    console.log('Public Key:', publicKey);
    console.log('Secret Key:', secretKey);
    console.log('App id:', appId);
    try{

      let res=await axios.post(`${process.env.REACT_APP_BASE_URL}auth/generate-token/${appId}`,{
        "accessKey": publicKey,
         "secretKey": secretKey
         
     })
      localStorage.setItem('access_token',res?.data?.result?.accessToken)
      localStorage.setItem('refresh_token',res?.data?.result?.refreshToken)
      localStorage.setItem('appId',appId)
      localStorage.setItem('publicKey',publicKey)
      localStorage.setItem('secretKey',secretKey)


      navigate('/secondpage');

    }catch(e){
      console.log(e)
    }
    
  };

  const handleChange=(e)=>{
    setEnv(e?.target?.value)
    validateForm(publicKey,secretKey, appId,e?.target?.value);


    
  }

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
        <label htmlFor="appId">App Id</label>
        <input
          type="password"
          id="secretKey"
          value={appId}
          onChange={handleAppIdChange}
          required
        />
      </div>
      <div>
        <label htmlFor="appId">Envorment</label>
        <select onChange={handleChange}>
        <option value=''>Select</option>
          <option value='DEV'>DEV</option>
          <option value='QA'>QA</option>
          <option value='STAGE_SANDBOX'>STAGGE SANDBOX</option>
          <option value='STAGE_LIVE'>STAGE LIVE</option>


        </select>
        {/* <input
          type="password"
          id="secretKey"
          value={appId}
          onChange={handleAppIdChange}
          required
        /> */}
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
