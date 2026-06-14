import axios from "axios";


export async function postPrivateTransaction(auth, body) {
    
  const response = await axios.post(
    `${'http://192.168.1.202:8000/api/'}private_transaction/private_ls`,
    body,
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

export async function getLatestPrivateTransaction(auth) {
  const response = await axios.get(
    `${'http://192.168.1.202:8000/api/'}private_transaction/latest`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${auth?.token}`,
      },
    }
  );

  return response;
}

export async function getComputedPrivateTransaction(auth) {
  const response = await axios.get(
    `${'http://192.168.1.202:8000/api/'}private_transaction/compute_latest`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${auth?.token}`,
      },
    }
  );
  return response;
}




