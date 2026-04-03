// File Upload Under Load Test Scenario

// Scenario Name: Concurrent File Upload Stress
// Description: This test simulates multiple users uploading files simultaneously, which can strain
// server resources, storage systems, and network bandwidth. It helps identify bottlenecks in file
// processing pipelines and ensures that uploads remain reliable even during peak usage.
// Real-life application: Photo sharing apps, document management systems, or cloud storage services during busy periods.

import http from "k6/http";
import { sleep, check } from "k6";

// Test for file upload under load: Simulates uploading files during high traffic
export const options = {
    vus: 10,
    duration: '2m',
    thresholds: {
        http_req_failed: ['rate<0.05'],
        http_req_duration: ['p(95)<10000'],
    },
};

export default function () {
    const fileData = 'data:text/plain;base64,' + btoa('Sample file content for upload test');
    const response = http.post('https://quickpizza.grafana.com/api/upload', {
        file: http.file(fileData, 'test.txt'),
    });
    check(response, { 'upload successful': (r) => r.status === 200 });
    sleep(2);
}