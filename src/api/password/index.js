
import axios from "axios";



export async function ApiUpdatePassword(body) {

   
    const response = await axios.put(
      `${'http://192.168.1.202:8000/api/'}teller/updatePassword/${body.user.tellerId}`,
      {
        password:body?.password
      },
      {
        headers: {
          'Content-Type' : 'application/json',
          'Accept' : 'application/json',
         Authorization: `Bearer ${body.user.token}`,
        },
      }
    );
    return response;
    }