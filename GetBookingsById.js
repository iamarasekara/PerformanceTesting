import { check } from 'k6';
import http from 'k6/http';
import { BASEURL,bookingId } from './config.js';  

const client_id = __ENV.CLIENT_ID;
const client_secret = __ENV.CLIENT_SECRET;
const x_api_key = __ENV.X_API_KEY;
const loginHeaders = {
  'Content-Type': 'application/json',
};

const loginUrl = "https://intrepidgroup-test.au.auth0.com/oauth/token";

const loginPayload = JSON.stringify({
  grant_type: 'client_credentials',
  client_id: client_id,
  client_secret: client_secret,
  audience: 'customer-app-api-dev-identifier',
});

export function setup() {
  const loginRes = http.post(loginUrl, loginPayload, { headers: loginHeaders });

  check(loginRes, {
    'response code was 200': (r) => r.status === 200,
  });

  if (loginRes.status !== 200) {
    console.error('Login request failed');
    return {}; 
  }

  const authToken = loginRes.json('access_token');
  

  return { authToken }; 
}

export default function (data) {
  
const getHeaders = {
    Authorization: `Bearer ${data.authToken}`,
    'x-api-key': x_api_key,
    'Content-Type': 'application/json',
  };

  const res = http.get(`${BASEURL}/bookings/${bookingId}`, { headers: getHeaders });

  check(res, {
    'GET request status 200': (r) => r.status === 200,
  });

  if (res.status !== 200) {
    console.error(`Failed GET request: ${res.status}`);
    return;
  }

  console.log('GET response body:', res.body);
}
