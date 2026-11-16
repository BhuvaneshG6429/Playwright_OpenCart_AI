/**
 * Test Case: Login Flow (Data Driven using External File)
 *
 * Tags: @master @datadriven @regression
 *
 * Steps:
 * 1) Load test data from external file
 * 2) For each row, create an independent test
 * 3) Open the application
 * 4) Enter email and password from data row
 * 5) Submit the login form
 * 6) Validate result based on expected value
 */

import { test, expect } from '../../fixtures/pageFixtures';
import type { HomePage } from '../../pages/HomePage';
import type { LoginPage } from '../../pages/LoginPage';
import { DataProvider } from '../../utils/DataReader';
import path from 'path';

interface LoginDataRow {
    testName: string;
    email: string;
    password: string;
    expected: string;
}

const loginData: LoginDataRow[] = DataProvider.readJson(path.resolve(__dirname, '../../testdata/opencart_logindata.json'));

async function submitLogin(homePage: HomePage, loginPage: LoginPage, email: string, password: string): Promise<void> {
    await test.step('1) Open the application and navigate to login', async () => {
        await homePage.navigateTo(process.env.WEB_APP_URL || 'http://localhost/opencart/upload/');
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('2) Enter credentials from test data', async () => {
        await loginPage.setEmail(email);
        await loginPage.setPassword(password);
    });

    await test.step('3) Submit the login form', async () => {
        await loginPage.clickLogin();
    });
}

loginData.forEach((data, index) => {
    const email = data.email.trim();
    const password = data.password.trim();
    const title = `Login Data Driven - ${data.testName} [row ${index + 1}] @datadriven @master @web`;

    if (data.expected === 'success') {
        test(title, async ({ homePage, loginPage, myAccountPage }) => {
            await submitLogin(homePage, loginPage, email, password);

            await test.step('4) Validate successful login', async () => {
                const isMyAccount = await myAccountPage.isMyAccountPageExists();
                expect(isMyAccount, 'My Account page should be displayed').toBeTruthy();
            });
        });
    } else {
        test(title, async ({ homePage, loginPage }) => {
            await submitLogin(homePage, loginPage, email, password);

            await test.step('4) Validate login failure', async () => {
                const isWarning = await loginPage.isWarningMessageVisible();
                expect(isWarning, 'Warning message should be displayed').toBeTruthy();

                const warningText = await loginPage.getWarningMessage();
                expect(warningText).toContain('Warning');
            });
        });
    }
});
