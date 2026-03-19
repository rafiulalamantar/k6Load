
import { check } from 'k6';
import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'https://quickpizza.grafana.com';
const USERNAME= "Antar"
const PASSWORD= "12345678"

export const options = {
    vus: 1,
    duration: '3s',


}

export default function () {

    let userRegistered = false;
    const registerPayLoad={
        username: USERNAME,
        password: PASSWORD
    }
    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = http.post(`${BASE_URL}/api/users`, JSON.stringify(registerPayLoad),params);
    console.log(response.body);
    userRegistered = check(response, {
        'is status 201': (r) => {
            return response.status === 201
        }
    
    });

    if(!userRegistered){
        console.error(`User registration failed. ${response.status}-${response.body}`);
    }
    sleep(1);


}
