import axios from "axios";
import { axiosInstance, axiosInstanceDEV, axiosInstanceLIVE, axiosInstanceQA, axiosInstanceSANDBOX } from "./api";

async function getStatusById(id, headers) {
  const urlbase={
    dev:process.env.REACT_APP_BASE_URL_DEV,
    qa:process.env.REACT_APP_BASE_URL_QA,
    SANDBOX:process.env.REACT_APP_BASE_URL_SANDBOX,
    LIVE:process.env.REACT_APP_BASE_URL_LIVE,


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


  function callApi(url,payload={}){
const env=localStorage.getItem('env')
if(env=='dev'){
if(Object.keys(payload).length!=0){
  return axiosInstanceDEV.post(url,payload)

}
  return axiosInstanceDEV(url)
  
}else if(env=='qa'){
  if(Object.keys(payload).length!=0){
    return axiosInstanceQA.post(url,payload)
  
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

}
  }

export {getStatusById,callApi}