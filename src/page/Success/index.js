import React from 'react'
import { json, useLocation } from 'react-router-dom'
import './style.css'

export default function Success() {
    const url = new URL(window.location.href);

    // Get the search parameters
    const params = new URLSearchParams(url.search);
    
    // Access individual parameters
    const param1 = params.get('payload'); // "value1"
    const param2 = JSON.parse(param1) // "value2"
    
    console.log(param2);
  return (

    <div class="container">
      {param2?.status==='PENDING'? <div class="pending-icon">⌛</div> :param2?.status==='SUCCESS'? <div class="success-icon">✔️</div>:<div class="failed-icon">⚠️</div>
      }
        {/* <div class="success-icon">✔️</div>
        <div class="pending-icon">⌛</div>
        <div class="failed-icon">⚠️</div> */}


        <h1>Transaction is {param2?.status} !</h1>
        {/* <p>Your transaction is {param2?.status}.</p> */}
        <a href="/" class="home-button" style={{marginBottom:'1rem'}}>Return to Home</a>
        <a href="/trans" class="home-button">All Transaction</a>
        <a href="/secondpage" class="home-button">another transaction</a>


    </div>
  )
}
