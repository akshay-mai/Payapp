import axios from "axios";
import { axiosInstance } from "./api";

async function getStatusById(id, headers) {

    try {
      let url = `/transaction/txnId/${id}`;
      return await axiosInstance.get(url);
    } catch (error) {
      const errorResponse = error;
      console.log({ errorResponse });
    }
  }
export {getStatusById}