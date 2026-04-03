
// Basic Load Test Scenario

// Scenario Name: Simple API Load Test
// Description: This is a basic load test that sends a constant number of virtual users to a single
// API endpoint for a short duration. It establishes baseline performance metrics and ensures the
// application can handle moderate, steady traffic without issues.
// Real-life application: Monitoring basic API health or testing small-scale applications.

import http from "k6/http"
import { sleep } from "k6";

export const options = {
    vus: 3,
    duration: '10s',

    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.01'] // less than 1% of requests should fail


    }
}

export default function () {
    http.get("https://quickpizza.grafana.com");
    sleep(1)
}

//http_req_duration -> time taken for request + Time takedn response