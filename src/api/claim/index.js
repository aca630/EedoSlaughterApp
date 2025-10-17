import axios from "axios";


        export async function ClaimWinApi(body) {
   
          
          const response = await axios.put(
            `${'http://192.168.1.157:8000/api/'}accountant/claim/${body.id}`,
            {},
            {
              headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
               Authorization: `Bearer ${body.token}`,
              },
            }
          );
          return response;
          }