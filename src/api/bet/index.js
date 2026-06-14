import axios from "axios";


export async function checkBetNo(body) {

  const response = await axios.get(
    `${'http://192.168.1.202:8000/api/'}teller/betsetting?tellerId=${body?.tellerId}&betNo=${body?.betNo}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer 1|GGrM2hs21mLtWraEWWmFcasVLzSCJXpSLdJJFJYt`,
      },
    }
  );
  return response;
}



export async function postBet(body, token) {

  console.log(token, ' token');
  const response = await axios.post(
    `${'http://192.168.1.202:8000/api/'}teller/bet`,
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


export async function getBets(auth) {



  const response = await axios.get(
    `${'http://192.168.1.202:8000/api/'}teller/bet?tellerId=${auth?.tellerId}&from=${auth?.from}&to=${auth?.to}`,
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


export async function getBetbyId(id, auth) {

  const response = await axios.get(
    `${'http://192.168.1.202:8000/api/'}accountant/claim/${id}`,
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


export async function voidBet(body, auth) {
  console.log(auth);

  const response = await axios.put(
    `${'http://192.168.1.202:8000/api/'}teller/bet/${body?.transactionId}`,
    {
      voidDate: body?.voidDate,
      isVoid: body?.isVoid,
      isrePrint: body?.isrePrint
    },
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