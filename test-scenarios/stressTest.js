
//Spike Test Scenario

//Scenario Name: E - commerce Flash Sale Spike
//Description: This test simulates a sudden traffic spike on an e - 
//commerce website's API endpoint 
//(e.g., product menu retrieval) during a flash sale announcement. 
//The load starts at a normal baseline, spikes dramatically to simulate user frenzy during the sale reveal, 
//maintains the high load briefly, and then drops back to normal. 
//This helps evaluate the system's ability to 
//handle unexpected load surges without service degradation or failures.


import http from "k6/http";
import { sleep } from "k6";

export const options = {
    scenarios: {
        spike_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '1m', target: 10 }, // Normal load: 10 users
                { duration: '30s', target: 1000 }, // Spike: sudden increase to 1000 users
                { duration: '30s', target: 1000 }, // Maintain spike for 30 seconds
                { duration: '1m', target: 10 }, // Drop back to normal
            ],
            tags: { test_type: 'spike' },
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1000ms during spike
        http_req_failed: ['rate<0.05'], // Less than 5% failure rate
    },
};

export default function () {
    const response = http.get('https://quickpizza.grafana.com/api/menu'); // Example endpoint
    sleep(Math.random() * 2 + 1); // Random sleep between 1-3 seconds
}