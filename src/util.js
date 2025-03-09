import axios from "axios";
import { axiosInstance, axiosInstanceDEV, axiosInstanceLIVE, axiosInstanceQA, axiosInstanceSANDBOX, axiosInstanceSTGLIVE, axiosInstanceSTGSANDBOX } from "./api";

async function getStatusById(id, headers) {
  const urlbase={
    dev:process.env.REACT_APP_BASE_URL_DEV,
    qa:process.env.REACT_APP_BASE_URL_QA,
    SANDBOX:process.env.REACT_APP_BASE_URL_SANDBOX,
    LIVE:process.env.REACT_APP_BASE_URL_LIVE,
    STG_SANDBOX:process.env.REACT_APP_BASE_URL_STG_SANDBOX,
    STG_LIVE:process.env.REACT_APP_BASE_URL_STG_LIVE,


  }
  const env=localStorage.getItem('env')

    try {
      let url = `transaction/txnId/${id}`;
      return await callApi(url)
      // return await axios.get(urlbase[env]+url);
    } catch (error) {
      const errorResponse = error;
      console.log({ errorResponse });
    }
  }


  function callApi(url,payload={},headers={}){
const env=localStorage.getItem('env')
console.log({headers},env)

if(env=='dev'){ 
if(Object.keys(payload).length!=0){
  return axiosInstanceDEV.post(url,payload,headers)

}
  return axiosInstanceDEV(url)
  
}else if(env=='qa'){
  if(Object.keys(payload).length!=0){
    console.log({headers})
    return axiosInstanceQA.post(url,payload,headers) 
  
  }else if(Object.keys(headers).length!=0){
    console.log('from utils',{headers})

  return axiosInstanceQA(url,{...headers})

  }
  return axiosInstanceQA(url)

  
}else if(env=='SANDBOX'){
  if(Object.keys(payload).length!=0){
    return axiosInstanceSANDBOX.post(url,payload)
  
  }
  return axiosInstanceSANDBOX(url)

  
}else if(env=='LIVE'){
  if(Object.keys(payload).length!=0){
    return axiosInstanceLIVE.post(url,payload)
  
  }
  
  return axiosInstanceLIVE(url)

}else if(env=='STG_LIVE'){
  if(Object.keys(payload).length!=0){
    return axiosInstanceSTGLIVE.post(url,payload)
  
  }
  
  return axiosInstanceSTGLIVE(url)

}else if(env=='STG_SANDBOX'){
  if(Object.keys(payload).length!=0){
    return axiosInstanceSTGSANDBOX.post(url,payload)
  
  }
  
  return axiosInstanceSTGSANDBOX(url)

}
  }

export {getStatusById,callApi}