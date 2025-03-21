import { check } from 'k6';
import http from 'k6/http';


const client_id = __ENV.CLIENT_ID;  
const client_secret = __ENV.CLIENT_SECRET;  
const loginUrl = "https://intrepidgroup-test.au.auth0.com/oauth/token";  


const loginPayload = JSON.stringify({
  grant_type: 'client_credentials',
  client_id: client_id,  
  client_secret: client_secret,  
  audience: 'customer-app-api-dev-identifier', 
});

const loginHeaders = {
  'Content-Type': 'application/json', 
};

export default function () {

  const loginRes = http.post(loginUrl, loginPayload, { headers: loginHeaders });

  
  check(loginRes, {
    'response code was 200': (r) => r.status === 200,
  });

  
const authToken = loginRes.json('access_token');

  if (!authToken) {
    console.error('Authentication token not found!');
    return;
  }

  console.log('Auth Token:', authToken); 

  
}
