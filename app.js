const axios = require("axios");
const puppeteer = require("puppeteer");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Replace these values with your actual credentials and API endpoints
const clientId = "E5t8THqOBzaFVmAJS0TZJDzMTybULU_s6egSniBXoGY=";
// const clientId="p-yfLlaNpRN8UYyAVIUmAQt9_T3J6LR-M6plcLMDeOQ=";//demo app
// const clientSecret="f7wpQw3FhkzlGokoLvI4aP1EocqmYI8QXUNTW_2in_A="; //demp app
const clientSecret = "_TwFnBaQJNQqbrNJPDY9yhnudD3yHcgVJ6aDjN0eXlo=";
const scope = "accounts";
const tokenUrl = "https://ob.sandbox.natwest.com/token";
const apiUrlPrefix = "https://ob.sandbox.natwest.com";
const consentUrl = "https://api.sandbox.natwest.com/authorize";
// const redirectUri = encodeURIComponent("https://474d555f-6a31-40f8-8ee8-ee72699f1f74.example.org/redirect");
const redirectUri = encodeURIComponent("http://localhost:8080");
// Request parameters for obtaining an access token
const tokenPayload = {
  grant_type: "client_credentials",
  client_id: clientId,
  client_secret: clientSecret,
  scope: scope,
};

const step1 = async () => {
  try {
    // Step 1: Make an API request to obtain an access token
    const tokenResponse = await axios.post(
      tokenUrl,
      new URLSearchParams(tokenPayload),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // Obtain the access token
    const accessToken = tokenResponse.data.access_token;
    console.log("Access Token ", accessToken);
    step2(accessToken);
  } catch (error) {
    console.error("error in step1", error.message);
  }
};

const step2 = async (accessToken) => {
  // Define the API endpoint and request body for step 2
  const apiUrl = `${apiUrlPrefix}/open-banking/v3.1/aisp/account-access-consents`;
  const requestBody = {
    Data: {
      Permissions: [
        "ReadAccountsDetail",
        "ReadBalances",
        "ReadTransactionsCredits",
        "ReadTransactionsDebits",
        "ReadTransactionsDetail",
      ],
    },
    Risk: {},
  };
  try {
    // Step 2: Make an API call using the obtained access token
    const apiResponse = await axios.post(apiUrl, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Extract the consent ID from the API response for Step 3
    const consentId = apiResponse.data.Data.ConsentId;
    console.log("Consent ID: " + consentId);
    step3(consentId);
  } catch {
    console.error("error in step2", error.message);
  }
};
const step3 = async (consentId) => {
  try {
    // Step 3: Replace URL with variables
    const consentUrlWithVariables = `${consentUrl}?client_id=${clientId}&response_type=code id_token&scope=openid accounts&redirect_uri=${redirectUri}&request=${consentId}`;

    // Print the URL with variables
    console.log(
      "Step 3 - Consent URL with Variables:",
      consentUrlWithVariables
    );
    step4(consentUrlWithVariables);
  } catch {
    console.error("error in step3", error.message);
  }
};

const step4 = async (consentUrlWithVariables) => {
  // Step 4: Automate interaction with the URL using Puppeteer
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto(consentUrlWithVariables);

    // Add any necessary interactions here
    await page.waitForSelector("#customer-number");
    await page.type("#customer-number", "123456789012");
    await page.waitForTimeout(500);
    await page.click("#customer-number-login");
    await page.waitForTimeout(500);

    // Enter password
    await page.waitForSelector("#pin-1");
    await page.type("#pin-1", "5"); // Enter "5" into the input field

    await page.waitForSelector("#pin-2");
    await page.type("#pin-2", "7");

    await page.waitForSelector("#pin-3");
    await page.type("#pin-3", "2");

    await page.waitForTimeout(500);
    await page.waitForSelector("#password-1");
    await page.type("#password-1", "4");

    await page.waitForSelector("#password-2");
    await page.type("#password-2", "3");

    await page.waitForSelector("#password-3");
    await page.type("#password-3", "6");

    await page.click("#login-button");

    await page.waitForSelector("dd.action.col-size-1 button");
    await page.click("dd.action.col-size-1 button");

    await page.waitForSelector("#approveButton");
    await page.click("#approveButton");

    // Wait for 10 seconds before asking for the authorization code
    await page.waitForTimeout(10000);

    const bodyContent = await page.evaluate(() => {
      // This code runs in the browser context
      const body = document.querySelector("#fragmentContent");
      return body.textContent.trim();
    });

    console.log("code:" ,bodyContent);
    const fragmentContent=bodyContent;
    const startIndex = fragmentContent.indexOf("="); // Start after "code="
    console.log(startIndex);
    const endIndex = fragmentContent.indexOf("&");

    const splitFragment = fragmentContent.substring(startIndex+1, endIndex);

    console.log("SPLIT",splitFragment);

    // Close the browser
    browser.close();

    // Ask the user to enter the authorization code
    // rl.question("Enter authorization code: ", (authCode) => {
    //   rl.close();
    //   console.log("Authorization Code:", authCode);
    // });
    // const url = bodyContent;
    // const code = url.hash.split("code=")[1].split("&id_token")[0];
    // console.log("Extracted Code:", code);
     step5(splitFragment);
  } catch (interactionError) {
    console.error(
      "Error during step 4 Puppeteer interactions:",
      interactionError.message
    );
  }
};

const step5 = async (code) => {
  try {
    // Step 5: Make a POST request to the token endpoint to exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri, // Replace with your actual redirect URI
        code: code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Obtain and print the access token from the response
    const accessToken = tokenResponse.data.access_token;
    console.log("Access Token:", accessToken);
    step6(accessToken);

    // You can perform additional actions with the access token as needed
  } catch (error) {
    console.error("Error in Step 5:", error.message);
  }
};

const step6 = async (accessToken) => {
  try {
    // Step 6: Make a GET request to the specified endpoint with the access token in the header
    const accountsResponse = await axios.get(
      `${apiUrlPrefix}/open-banking/v3.1/aisp/accounts`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Print the response or perform additional actions as needed
    console.log("List Accounts", accountsResponse.data.Data);
    const accountId = accountsResponse.data.Data.Account[0].AccountId;
    console.log(accountId);
    step7(accountId, accessToken);
  } catch (error) {
    console.error("Error in Step 6:", error.message);
  }
};

const step7 = async (accountId, accessToken) => {
  try {
    const transactionsResponse = await axios.get(
      `${apiUrlPrefix}/open-banking/v3.1/aisp/accounts/${accountId}/transactions`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Print the response or perform additional actions as needed
    console.log("List Transactions", transactionsResponse.data.Data);
  } catch (error) {
    console.error("Error in Step7:", error.message);
  }
};

const main = async () => {
  step1();
};
// Invoke the main function
main();
