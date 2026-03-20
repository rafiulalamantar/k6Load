import { type } from "wd/lib/commands";
import browser from k6 / browser;

export const options = {
    scenarios: {
        ui: {
            executor: 'shared-iterations',
            exec: "browserTest",
            vus: 2,
            maxDuration: '1m',
            iterations: 3,
            options: {
                browser: {
                    headless: true,
                    type: "chromium",
                }

            },
            backend: {
                exec: "backendTest",
                vus: 1,
                duration: '1m',

            }
        }
    }
}

export async function browserTest() {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('');
    await page.locator("#inputUsername").type("Rafiul")
    await page.locator("#inputPassword").type("")
    await page.locator("button[type='submit']").click();

    await page.waitForTimeout(2000);

    const pageTitle = await page.locator("h1").first().textContent();

    check(pageTitle, {

        header: (text) => {
            return text.includes("Welcome")
        }
    });

}

export async function backendTest() {

}