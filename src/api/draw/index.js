import axios from "axios";



export async function getDraw(token) {
  
  console.log(token);
  const response = await axios.get(
    `${'http://192.168.1.202:8000/api/'}teller/draw`,
    {
      headers: {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
       Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
  }