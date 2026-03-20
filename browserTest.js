import { browser } from "k6/browser";
import http from "k6/http";
import { check } from "k6";

export const options = {
    scenarios: {
        ui: {
            executor: 'shared-iterations',
            exec: "browserTest",
            vus: 2,
            maxDuration: '1m',
            iterations: 4,
            options: {
                browser: {
                    type: "chromium",
                    headless: false,
                }

            }
        },
        backendTest: {
            executor: 'shared-iterations',
            exec: "backendTest",
            vus: 1,
            iterations: 4,
            startTime: '0s'

        }
    },
    thresholds: {
        'checks': ['rate===1.0'],    // 90% of checks should pass
    }
}

export async function browserTest() {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('');
    await page.locator("#inputUsername").type("Rafiul")
    await page.locator("input[placeholder='Password']").type("")
    await page.locator("button[type='submit']").click();

    await page.waitForTimeout(2000);

    const pageTitle = await page.locator("h1").textContent();

    check(pageTitle, {

        header: (text) => {
            return text.includes("Welcome")
        }
    });

    await context.close();

}

export async function backendTest() {

    const res = http.get("");

    check(res, {
        'is status 200': (r) => r.status === 200
    });


}