
import http from "k6/http"
import { sleep } from "k6";

export const options = {

    stages: [
        { duration: '4s', target: 2 }, // Ramp up to 2 VUs over 4 seconds
        { duration: '5s', target: 5 }, // Stay at 5 VUs for 5 seconds
        { duration: '3', target: 0 }, // Ramp down to 0 VUs over 10 seconds
    ],

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