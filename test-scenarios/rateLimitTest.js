// Rate Limiting Test Scenario

// Scenario Name: API Rate Limiting Under Load
// Description: This test simulates a high volume of requests to an API endpoint that implements rate limiting.
// It helps identify how the system behaves when the rate limit is exceeded, ensuring that legitimate users
// are not overly impacted while preventing abuse. The test expects some requests to fail (HTTP 429) due to
// rate limiting, which is normal behavior.
// Real-life application: Social media APIs, payment gateways, or any service with usage quotas.

import http from "k6/http";
import { sleep, check } from "k6";

// Test for API rate limiting: Simulates multiple requests to an endpoint with rate limits
export const options = {
    vus: 50,
    duration: '1m',
    thresholds: {
        http_req_failed: ['rate<0.1'], // Allow some failures due to rate limiting
        http_req_duration: ['p(95)<2000'],
    },
};

export default function () {
    const response = http.get('https://quickpizza.grafana.com/api/rate-limited-endpoint');
    check(response, {
        'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
    });
    sleep(0.1);
}