
import axios from "axios";



export async function ApiBindeDevice(body) {

    console.log(body);

    const response = await axios.put(
        `${'http://192.168.1.157:8000/api/'}teller/bindDevice/${body.user.tellerId}`,
        {
            deviceId: body?.deviceId
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${body.user.token}`,
            },
        }
    );
    return response;
}