import axios from "axios";


export async function SearchTeller(body) {


    
  const response = await axios.get(
    `${'http://192.168.1.157:8000/api/'}reset/teller?username=${body?.username}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${body?.token}`,
      },
    }
  );
  return response;
}

export async function ResetTeller(body) {

    console.log(body,' xx');
   
    const response = await axios.put(
      `${'http://192.168.1.157:8000/api/'}reset/teller/${body.id}`,
      {
        
      },
      {
        headers: {
          'Content-Type' : 'application/json',
          'Accept' : 'application/json',
         Authorization: `Bearer ${body?.token}`,
        },
      }
    );
    return response;
    }

    export async function DeactivateTeller(body) {
 
      const response = await axios.put(
        `${'http://192.168.1.157:8000/api/'}teller/updateStatus/${body.id}`,
        {
          isActive:0
        },
        {
          headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
           Authorization: `Bearer ${body?.token}`,
          },
        }
      );
      return response;
      }

      export async function ActivateTeller(body) {
 
        const response = await axios.put(
          `${'http://192.168.1.157:8000/api/'}teller/updateStatus/${body.id}`,
          {
            isActive:1
          },
          {
            headers: {
              'Content-Type' : 'application/json',
              'Accept' : 'application/json',
             Authorization: `Bearer ${body?.token}`,
            },
          }
        );
        return response;
        }