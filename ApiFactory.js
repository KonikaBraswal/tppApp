// ApiFactory.js
import axios from "axios";
import config from "./config.json";
import sandboxConfig from "./Sandbox.json";
import { Linking } from "react-native";
import { TextInput, Button, View, Text } from "react-native";

let permissions = [];
class ApiFactory {
  constructor() {
    this.baseUrl = config.baseUrl;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.commonHeaders = config.contentType;
  }

  createApiClient(type) {
    switch (type) {
      case "sandbox":
        return new SanboxApiClient(
          this.baseUrl,
          this.clientId,
          this.clientSecret,
          this.commonHeaders
        );
      // Add other cases if needed
      case "local":
        return new RestApiClient(
          this.baseUrl,
          this.clientId,
          this.clientSecret,
          this.headers
        );
      case "sit":
        return new RestApiClient(
          this.baseUrl,
          this.clientId,
          this.clientSecret,
          this.headers
        );
      default:
        throw new Error(`Invalid API client type: ${type}`);
    }
  }
}

class SanboxApiClient {
  constructor(baseUrl, clientId, clientSecret, commonHeaders) {
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.commonHeaders = commonHeaders;
  }

  async retrieveAccessToken(permission) {
    permissions = permission;

    try {
      const body = {
        grant_type: sandboxConfig.grant_type,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: sandboxConfig.scope,
      };
      const headers = {
        ...this.commonHeaders,
      };

      const response = await axios.post(
        `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
        null,
        {
          headers: headers,
          params: body,
        }
      );
      //console.log(response.data.access_token);
      return this.accountRequest(response.data.access_token);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  async accountRequest(accessToken) {
    try {
      const body = {
        Data: {
          Permissions: permissions,
        },
        Risk: {},
      };
      const headers = {
        ...this.commonHeaders,
        Authorization: "Bearer " + accessToken,
      };
      const response = await axios.post(
        `${this.baseUrl}/${sandboxConfig.accountRequestEndpoint}`,
        body,
        {
          headers: headers,
        }
      );
      //console.log(response.data);
      return this.userConsent(response.data.Data.ConsentId);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
  async userConsent(consentId) {
    let consentUrlWithVariables = `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid accounts&redirect_uri=${sandboxConfig.redirectUri}&request=${consentId}`;
    console.log(consentUrlWithVariables);

    //redirecting but not sure how to fetch consent id using the
      try {
          const supported = await Linking.canOpenURL(consentUrlWithVariables);

          if (supported) {
            let something=await Linking.openURL(consentUrlWithVariables);
            console.log("Something",something);
          } else {
            console.error("Cannot open the link");
          }
        } catch (error) {
          console.error("Error opening the link:", error);
        }

    return consentUrlWithVariables;
  }

  async exchangeAccessToken(authToken) {

    try {
        const body = {
          
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri:sandboxConfig.redirectUri,
          grant_type: "authorization_code",
          code:authToken,
        };
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        };
  
        const response = await axios.post(
          `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
          null,
          {
            headers: headers,
            params: body,
          }
        );
        console.log("Api access token",response.data.access_token);
       
        return this.fetchAccounts(response.data.access_token);
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
      }

  }
  async fetchAccounts(apiAccessToken){
    try {
        const headers = {
            ...this.commonHeaders,
            Authorization:`Bearer ${apiAccessToken}`,
        };
  
        const accountResponse = await axios.get(
          `${this.baseUrl}/${sandboxConfig.accountsEndpoint}`,
          {
            headers: headers
          }
        );
        //console.log(response.data.access_token);
        return (accountResponse.data.Data);
      } catch (error) {
        throw new Error(`Failed to fetch data for accounts: ${error.message}`);
      }

  }
}

export default ApiFactory;
