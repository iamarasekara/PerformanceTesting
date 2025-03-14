import { check } from 'k6';
import http from 'k6/http';
import { USERNAME, PASSWORD, BASEURL } from './data.js';

export default function () {
  // Define the URL and payload using data.js
  const url = `${BASEURL}/api/users/token/login`;
  const payload = JSON.stringify({
    username: USERNAME,  
    password: PASSWORD,  
  });


  // Define headers
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Send a POST request and save the response
  const res = http.post(url, payload, params);

  // Check that the response status is 200
  check(res, {
    'response code was 200': (res) => res.status == 200,
  });
}
