import { check, group } from 'k6';
import http from 'k6/http';
import { sleep } from 'k6';
import { Rate } from 'k6/metrics';

const BASE_URL = 'https://quickpizza.grafana.com';
const PASSWORD = "password123";

const authenticationRate = new Rate('authentication_rate');

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
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        'checks': ['rate>0.9'],    // 90% of checks should pass
        'iteration_duration': ['p(95)<8000'], // 95% of iterations should be below 500ms
        'group_duration{group:::User Registration}': ['p(95)<2000'], // 95% of User Registration groups should be below 2000ms
        'group_duration{group:::User Login}': ['p(95)<2000'], // 95% of User Login groups should be below 2000ms
        'group_duration{group:::Order Management}': ['p(95)<3000'], // 95% of Order Management groups should be below 3000ms
        'group_duration{group:::Retrieve Order}': ['p(95)<2000'], // 95% of Retrieve Order groups should be below 2000ms
        'authentication_rate': ['rate>0.9'], // 90% of authentication attempts should succeeds
    }
};

export default function () {

    let userRegistered = false;
    let userAuthenticated = false;
    let authToken = '';
    let orderCreated = false;
    let orderId

    let USERNAME = `Antar${generateRandomString(5)}1`;

    // Global counters and lists
    if (!globalThis.registeredUsers) {
        globalThis.registeredUsers = [];
        globalThis.authenticatedUsers = [];
        globalThis.orderIds = [];
    }

    group('User Registration', function () {
        console.log('\n========== USER REGISTRATION ==========');

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

        console.log('Response:', response.body);

        userRegistered = check(response, {
            'is status 201': (r) => r.status === 201
        });

        if (!userRegistered) {
            console.error(`✗ Registration failed: ${response.status} - ${response.body}`);
        } else {
            console.log('✓ Registration successful');
        }

        sleep(1);
    });

    group('User Login', function () {
        console.log('\n========== USER LOGIN ==========');

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

        console.log('Response:', response.body);

        userAuthenticated = check(response, {
            'is status 200': (r) => r.status === 200,
            'login response contains token': (r) => r.json('token') !== undefined,
            'token valid string': (r) => r.json('token').length > 10
        });

        if (userAuthenticated) {
            authenticationRate.add(1);
            authToken = response.json('token');
            console.log('✓ Login successful');
            console.log(`Token: ${authToken}`);
            console.log(`Authentication Rate: ${(authenticationRate.rate * 100).toFixed(1)}%`);
        } else {
            authenticationRate.add(0);
            console.error(`✗ Login failed: ${response.status} - ${response.body}`);
            console.log(`Authentication Rate: ${(authenticationRate.rate * 100).toFixed(1)}%`);
        }

        sleep(1);
    });

    group('Order Management', function () {
        console.log('\n========== ORDER MANAGEMENT ==========');

        const params = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            }
        };

        const orderPayLoad = {
            maxCaloriesPerSlice: 1000,
            mustBeVegetarian: true,
            excludedIngredients: ["Pizza curtur"],
            maxNumberOfToppings: 9,
            minNumberOfToppings: 2,
            customName: "John Doe"
        };

        const createOrderResponse = http.post(`${BASE_URL}/api/pizza`, JSON.stringify(orderPayLoad), params);

        orderCreated = check(createOrderResponse, {
            'Status is 200': (r) => r.status === 200,
            'Response has pizza ID': (r) => r.json('pizza.id') !== undefined,
            'Pizza name matches request': (r) => r.json('pizza.name') === orderPayLoad.customName
        });

        if (orderCreated) {
            orderId = createOrderResponse.json('pizza.id');
            console.log('✓ Order created successfully');
            console.log(`Order ID: ${orderId}`);
        } else {
            console.error(`✗ Order failed: ${createOrderResponse.status} - ${createOrderResponse.body}`);
        }

        sleep(1);

    });

    // Retrieve Order Details
    group('Retrieve Order', function () {
        console.log('\n========== RETRIEVE ORDER ==========');

        if (orderId) {
            const params = {
                headers: {
                    'Authorization': `Token ${authToken}`
                }
            };

            const retrieveResponse = http.get(`${BASE_URL}/api/pizza/${orderId}`, params);

            const orderRetrieved = check(retrieveResponse, {
                'Retrieve status is 200': (r) => r.status === 200,
                'Pizza ID matches': (r) => r.json('id') === orderId,
            });

            if (orderRetrieved) {
                console.log('✓ Order retrieved successfully');
            } else {
                console.error(`✗ Order retrieval failed: ${retrieveResponse.status} - ${retrieveResponse.body}`);
            }
        } else {
            console.log('⚠ No order ID available to retrieve');
        }

        sleep(1);
    });
}