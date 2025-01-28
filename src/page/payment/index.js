import React from 'react'
import { useLocation } from 'react-router-dom'
import Gateways from 'ks-pay-package-pvt'


export default function Payment() {
    const location=useLocation()
    let data=JSON.parse(location.state)
    const {payload,headers,transactionStatusCallback}=data
    console.log(payload,headers,transactionStatusCallback)

  return (
    <Gateways  payload={payload} headers={headers} transactionStatusCallback={transactionStatusCallback}/>
  )
}
