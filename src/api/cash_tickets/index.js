import axios from "axios";


export async function getCashTickets(auth) {
    
  const response = await axios.get(
    `${'http://192.168.1.157:8000/api/'}collector/cash_ticket`,
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


export async function postCashTicket(body, token) {

  console.log(token, ' token');
  const response = await axios.post(
    `${'http://192.168.1.157:8000/api/'}collector/dispense_cash_ticket`,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

