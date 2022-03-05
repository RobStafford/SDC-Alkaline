import http from 'k6/http';
import { sleep } from 'k6';

//change this to test api for 'products' or 'styles'
const apiToTest = 'styles';

//use this to generate random product id in the allowed range
let getRandomSKUId = function(min = 900000, max = 1000000) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export const options = {
  //use 'vus' to set the number of simultaneous virtual users
  vus: 200,
  duration: '30s',
};

const params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function() {

  let id = getRandomSKUId();
  http.get(`http://127.0.0.1:3001/${apiToTest}/${id}`, {
    tags: { name: `get${apiToTest}URL` },
  });

}

