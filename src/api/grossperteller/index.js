import axios from "axios";


export async function getGrossPerTeller(auth) {
  const response = await axios.get(
    `${'http://192.168.1.157:8000/api/'}gencoordinator/GrossPerTeller?supervisorsId=${auth?.supervisorsId}&from=${auth?.from}&to=${auth?.to}&drawTime=${auth.drawTime}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${auth?.token}`,
      },
    },

  );
  return response;
}



