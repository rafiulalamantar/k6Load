import { check, group } from 'k6';
import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'https://quickpizza.grafana.com';
const PASSWORD = "password123";

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const options = {
    stages: [
        { duration: '5s', target: 2 }, // Ramp up to 2 VUs over 5 seconds
        { duration: '5s', target: 4 }, // Stay at 4 VUs for 5 seconds
        { duration: '3s', target: 0 }, // Ramp down to 0 VUs over 3 seconds
    ],
    thresholds: {
        http_req_duration: ['p(95)<350'], // 95% of requests should be below 500ms
        'checks': ['rate>0.9'],    // 90% of checks should pass
        'iteration_duration': ['p(95)<8000'] // 95% of iterations should be below 500ms
    }
};

export default function () {

    let userRegistered = false;
    let userAuthenticated = false;
    let authToken = '';

    let USERNAME = `Antar${generateRandomString(5)}1`;

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

        // ✅ Correct template string
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
            'is status 200': (r) => r.status === 200,
            'login response contains token': (r) => r.json('token') !== undefined,
            'token valid string': (r) => r.json('token').length > 10
        });

        if (userAuthenticated) {
            authToken = response.json('token');   // ✅ FIXED (declared earlier)
            console.log(`User authenticated successfully. Token: ${authToken}`);
        } else {
            console.error(`User authentication failed. ${response.status}-${response.body}`);
        }

        sleep(1);
    });
}