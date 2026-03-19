import { check, group } from 'k6';
import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'https://quickpizza.grafana.com';
const USERNAME = "Antar";
const PASSWORD = "12345678";

export const options = {
    vus: 1,
    duration: '3s',
};

export default function () {

    let userRegistered = false;

    group('User Registration', function () {

        const registerPayLoad = {
            username: USERNAME,
            password: PASSWORD
        };

        const params = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = http.post(`${BASE_URL}/api/users`, JSON.stringify(registerPayLoad), params);
        console.log(response.body);

        userRegistered = check(response, {
            'is status 201': (r) => r.status === 201
        });

        if (!userRegistered) {
            console.error(`User registration failed. ${response.status}-${response.body}`);
        }

        sleep(1);
    });

    group('User Login', function () {

        let userAuthenticated = false;

        const loginPayLoad = {
            username: USERNAME,
            password: PASSWORD
        };

        const params = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = http.post(`${BASE_URL}/api/users/token/login`, JSON.stringify(loginPayLoad), params);
        console.log(response.body);

        userAuthenticated = check(response, {
            'is status 200': (r) => r.status === 200
        });

        if (!userAuthenticated) {
            console.error(`Login failed. ${response.status}-${response.body}`);
        }

        sleep(1);
    });
}