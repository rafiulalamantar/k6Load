// CDN Performance Test Scenario

// Scenario Name: Content Delivery Network Efficiency
// Description: This test simulates multiple users loading static assets (CSS, JS, images) simultaneously
// to evaluate CDN performance and caching effectiveness. It helps ensure that global users receive
// fast content delivery regardless of their geographic location.
// Real-life application: Global websites, media streaming services, or any site serving static content to worldwide users.

import http from "k6/http";
import { sleep, check } from "k6";

// Test for CDN performance: Simulates requests to static assets from different regions
export const options = {
    vus: 100,
    duration: '1m',
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<500'],
    },
};

export default function () {
    // Simulate loading static assets
    const responses = http.batch([
        ['GET', 'https://quickpizza.grafana.com/static/css/main.css'],
        ['GET', 'https://quickpizza.grafana.com/static/js/app.js'],
        ['GET', 'https://quickpizza.grafana.com/static/images/logo.png'],
    ]);

    responses.forEach((res, index) => {
        check(res, { [`asset ${index} loaded`]: (r) => r.status === 200 });
    });

    sleep(0.5);
}