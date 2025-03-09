import React, { useEffect, useState } from 'react'
import { json, useLocation } from 'react-router-dom'
import './style.css'
import axios from 'axios';
import { callApi } from '../../util';

export default function Success() {
    const url = new URL(window.location.href);
    const [data,setData]=useState(null)

    // Get the search parameters
    const params = new URLSearchParams(url.search);
    
    // Access individual parameters
    const ks_id = params.get('kspay_id'); // "value1"
    const status = params.get('payment_status'); // "value1"
    const pay_id = params.get('provider_payment_id'); // "value1"
    console.log('=====',ks_id,status,pay_id)
  
    // const param2 = JSON.parse(param1) // "value2"
    
    
    const getStatusById=async ()=> {
      let headers={
        // "x-signature":localStorage.getItem('sign'),
        "authorization":`Bearer ${localStorage.getItem('access_token')}`
      } 
      
      try{

        let res= await callApi(`transaction/txnId/${ks_id}`)
        // let res= await axios.get(`${process.env.REACT_APP_BASE_URL_QA}transaction/txnId/${param1}`,{headers})
        console.log(res)
        setData(res?.data?.result)
      }catch(e){
        console.log(e)
      }
     
     
    }
    useEffect(()=>{
      if(ks_id&&status&&pay_id){
        setData({})
       } 
      getStatusById()
    },[]) 
     return (

    <div class="container">
    {
      data &&
<>
{status}

      {status==='PENDING'? <div class="pending-icon">⌛</div> :status==='Success'? <div class="success-icon">✔️</div>:<div class="failed-icon">⚠️</div>
      }
        {/* <div class="success-icon">✔️</div>
        <div class="pending-icon">⌛</div>
        <div class="failed-icon">⚠️</div> */}


        <h1>Transaction is {status} !</h1>
        <p>Your transaction is {status}.</p>
        <a href="/" class="home-button" style={{marginBottom:'1rem'}}>Return to Home</a>
        <a href="/trans" class="home-button">All Transaction</a>
        <a href="/secondpage" class="home-button">another transaction</a>
</>
    }




    </div>
  )
}
