const axios = require('axios');

// Replace these values with your actual credentials and API endpoints
const clientId = 'E5t8THqOBzaFVmAJS0TZJDzMTybULU_s6egSniBXoGY=';
const clientSecret = '_TwFnBaQJNQqbrNJPDY9yhnudD3yHcgVJ6aDjN0eXlo=';
const scope = 'accounts';
const tokenUrl = 'https://ob.sandbox.natwest.com/token';
const apiUrlPrefix = 'https://ob.sandbox.natwest.com';
const consentUrl = 'https://api.sandbox.natwest.com/authorize';

// Request parameters for obtaining an access token
const tokenPayload = {
  grant_type: 'client_credentials',
  client_id: clientId,
  client_secret: clientSecret,
  scope: scope,
};

// Step 1: Make an API request to obtain an access token
axios.post(tokenUrl, new URLSearchParams(tokenPayload), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})
  .then(tokenResponse => {
    // Obtain the access token
    const accessToken = tokenResponse.data.access_token;
    console.log("Access Token ", accessToken);
    // Define the API endpoint and request body for step 2
    const apiUrl = `${apiUrlPrefix}/open-banking/v3.1/aisp/account-access-consents`;
    const requestBody = {
      Data: {
        Permissions: [
          "ReadAccountsDetail",
          "ReadBalances",
          "ReadTransactionsCredits",
          "ReadTransactionsDebits",
          "ReadTransactionsDetail"
        ]
      },
      Risk: {}
    };

    // Step 2: Make an API call using the obtained access token
    axios.post(apiUrl, requestBody, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(apiResponse => {
        // Handle the API response for step 2 as needed
        console.log('Step 2 - API Response Status:', apiResponse.status);
        console.log('Step 2 - API Response Data:', apiResponse.data);

        // Extract the consent ID from the API response for Step 3
        const consentId = apiResponse.data.Data.ConsentId;

        // Step 3: Replace URL with variables

        const consentUrlWithVariables = `${consentUrl}?client_id=${clientId}&response_type=code id_token&scope=openid accounts&redirect_uri=https://localhost:8080&request=${consentId}`;

        // Print the URL with variables
        console.log('Step 3 - Consent URL with Variables:', consentUrlWithVariables);
      })
      .catch(error => {
        console.error('Step 2 - Error making API call:', error.message);
      });
  })
  .catch(error => {
    console.error('Step 1 - Error obtaining access token:', error.message);
  });
