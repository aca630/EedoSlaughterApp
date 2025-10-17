import axios from "axios";



export async function postOccupantMonthlyPayment(body, token) {

  console.log(token, ' token');
  const response = await axios.post(
    `${'http://192.168.1.157:8000/api/'}collector/occupant_monthly_payment`,
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

