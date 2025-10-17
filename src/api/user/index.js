import axios from "axios";
// import {REACT_APP_API_URL} from '@env';


export  async function loginUser(params) {

console.log(params,' params');
  const response = axios.post(
    `http://192.168.1.157:8000/api/collector/login`,
    params,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
    
  );
  return response;
}