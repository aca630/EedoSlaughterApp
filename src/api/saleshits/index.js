import axios from "axios";


export async function GetCollectorTotalCashTicketsPerDay(auth) {
  console.log(auth,' auth');
  
  const response = await axios.get(
    `${'http://192.168.1.157:8000/api/'}collector/CollectorTotalCashTicketsPerDay?id=${auth?.id}&from=${auth?.from}&to=${auth?.to}`,
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


export async function getWinReportsPerDrawCashier(auth) {
  const response = await axios.get(
    `${'http://192.168.1.157:8000/api/'}gencoordinator/OverAllWinReportsCashier?supervisorId=${auth?.supervisorId}&from=${auth?.from}&to=${auth?.to}&drawTime=${auth.drawTime}`,
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


export async function getWinReportsPerDraw(auth) {
  const response = await axios.get(
    `${'http://192.168.1.157:8000/api/'}gencoordinator/OverAllWinReports?cashierId=${auth?.cashierId}&from=${auth?.from}&to=${auth?.to}&drawTime=${auth.drawTime}`,
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


export async function getTallyPerDraw(auth) {
  const response = await axios.get(
    `${'http://192.168.1.157:8000/api/'}gencoordinator/CoorTallySheetPerDraw?from=${auth?.from}&to=${auth?.to}&drawTime=${auth.drawTime}`,
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



// export async function getTallySheet(body) {
//   console.log(body, ' body');

//   const response = await axios.get(
//     `https://magdash.stl-gaming.net/?p=tallysheet&draw_date=${body?.date}&draw_time=${body?.draw_time}&spvr_id=${body?.supervisorId}&fbclid=IwAR0kRL9xo_inwxnqHLBf1WS1Y4-xL7gOyzi9sWwgopPnPYvkc0sHrrTPDx8`,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         Authorization: `Bearer 1|GGrM2hs21mLtWraEWWmFcasVLzSCJXpSLdJJFJYt`,
//       },
//     }
//   );
//   return response;
// }


export async function getGrossPerCashier(auth) {
  console.log(auth,' AUTH');
  const response = await axios.get(
    `${'http://192.168.1.157:8000/api/'}gencoordinator/OverlAllGrossPerCashier?accountantId=${auth?.accountantId}&from=${auth?.from}&to=${auth?.to}`,
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

export async function AdminOverlAllGrossPerAccountant(auth) {
  const response = await axios.get(
    `${'http://192.168.1.157:8000/api/'}admin/AdminOverlAllGrossPerAccountant?&from=${auth?.from}&to=${auth?.to}`,
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



export async function getOverlAllGrossPerSuperVisor(auth) {
  console.log(auth,' AUTHsssss');
  const response = await axios.get(
    `${'http://192.168.1.157:8000/api/'}gencoordinator/OverlAllGrossPerSuperVisor?cashierId=${auth?.cashierId}&from=${auth?.from}&to=${auth?.to}&drawTime=${auth.drawTime}`,
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


export async function getOverlAllGrossPerTeller(auth) {
  const response = await axios.get(
    `${'http://192.168.1.157:8000/api/'}gencoordinator/OverlAllGrossPerTeller?supervisorId=${auth?.supervisorId}&from=${auth?.from}&to=${auth?.to}&drawTime=${auth.drawTime}`,
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




export async function getOverlAllGrossTellerPerDraw(auth) {
  const response = await axios.get(
    `${'http://192.168.1.157:8000/api/'}gencoordinator/OverlAllGrossTellerPerDraw?supervisorId=${auth?.supervisorId}&from=${auth?.from}&to=${auth?.to}&drawTime=${auth.drawTime}`,
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







