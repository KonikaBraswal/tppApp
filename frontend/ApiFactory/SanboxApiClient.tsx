import axios, {AxiosResponse} from 'axios';
import config from '../configs/config.json';
import sandboxConfig from '../configs/Sandbox.json';
import {Linking, Alert} from 'react-native';
import { addDetails } from '../database/Database';
import { updateDetails } from '../database/Database';

interface BodyData {
  Data: {
    Permissions: string[];
  };
  Risk: {}; // Adjust this if Risk has a specific structure
}

interface ResponseData {
  access_token: string;
  Data?: {
    ConsentId?: string;
  };
}

// const userIdToUpdate = 1001;

class SanboxApiClient {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private commonHeaders: any; // Replace 'any' with the actual type of commonHeaders
  private permissions: string[] = [];
  private apiAccess: string = '';
  constructor(
    baseUrl: string,
    clientId: string,
    clientSecret: string,
    commonHeaders: any,
  ) {
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.commonHeaders = commonHeaders;
  }

  async retrieveAccessToken(permission: string[]): Promise<string> {
    this.permissions = permission;
    try {
      const body: Record<string, string> = {
        grant_type: sandboxConfig.grant_type,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: sandboxConfig.scope,
      };
      const headers = {...this.commonHeaders};

      const response: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
        null,
        {
          headers: headers,
          params: body,
        },
      );
      
      const scope= response.data.scope;

      const details1 = {
        userId: 1001,
        scope: scope
      }; 

      addDetails(details1);

      console.log('Access token', response.data.access_token);
      return this.accountRequest(response.data.access_token);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async accountRequest(accessToken: string): Promise<string> {
    try {
      const body: BodyData = {
        Data: {
          Permissions: this.permissions,
        },
        Risk: {},
      };
      const headers = {
        ...this.commonHeaders,
        Authorization: 'Bearer ' + accessToken,
      };

      const response: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.accountRequestEndpoint}`,
        body,
        {
          headers: headers,
        },
      );
       
      const Status= response.data.Data?.Status;
      const Payload= response.data.Data
      const ConsentId = response.data.Data?.ConsentId || '';

      const updatedDetails1 = {
        bankname: 'Natwest',
        consentid: ConsentId,
        status: Status,
        consentpayload: JSON.stringify(Payload),

      };

      const columnsToUpdate1 = ['bankname', 'consentid', 'consentpayload'];

      await updateDetails(updatedDetails1, 1001, columnsToUpdate1);
      // const details1 = {
      //   userId: 1001,
      //   // scope: 'Aisp',
      //   bankname: 'Natwest', 
      //   consentid: ConsentId,
      //   status: Status,
      //   consentpayload: JSON.stringify(Payload),
      // };     
      // // Call the addDetails function with the details object
      // addDetails(details1);


      return response.data.Data?.ConsentId || '';
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async manualUserConsent(consentId: string): Promise<string> {
    console.log('manual consent');
    let consentUrlWithVariables = `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid accounts&redirect_uri=${sandboxConfig.redirectUri}&request=${consentId}`;
    Linking.openURL(consentUrlWithVariables);
    return consentUrlWithVariables;
  }
  async userConsentProgammatically(consentId: string): Promise<string> {
    try {
      console.log('ConsentID:', consentId);
      const accountResponse: AxiosResponse<any> = await axios.get(
        `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid accounts&redirect_uri=${sandboxConfig.redirectUri}&state=ABC&request=${consentId}&authorization_mode=AUTO_POSTMAN&authorization_username=${sandboxConfig.psu}`,
      );
      return this.exchangeAccessToken(accountResponse.data.redirectUri);
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }

  async exchangeAccessToken(authTokenUrl: string): Promise<string> {
    try {
      const start = authTokenUrl.indexOf('=') + 1;
      const end = authTokenUrl.indexOf('&');
      const authToken = authTokenUrl.slice(start, end);
      console.log('AuthToken', authToken);
      const body: Record<string, string> = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: sandboxConfig.redirectUri,
        grant_type: 'authorization_code',
        code: authToken,
      };
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const response: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
        null,
        {
          headers: headers,
          params: body,
        },
      );

      const RefreshToken = response.data.refresh_token;
      const consentExpiresIn= response.data.expires_in;
      const Scope= response.data.scope;
      
      const updatedDetails2 = {
        refreshedtoken: RefreshToken,
        status: 'Authorised',
        consentexpiry: consentExpiresIn

      };

      const columnsToUpdate2 = ['refreshedtoken', 'status', 'consentexpiry'];

      await updateDetails(updatedDetails2, 1001, columnsToUpdate2);

      console.log('Api access token', response.data.access_token);

      return this.fetchAccounts(response.data.access_token);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async fetchAccounts(apiAccessToken: string): Promise<any> {
    try {
      const headers = {
        ...this.commonHeaders,
        Authorization: `Bearer ${apiAccessToken}`,
      };

      const accountResponse: AxiosResponse<any> = await axios.get(
        `${this.baseUrl}/${sandboxConfig.accountsEndpoint}`,
        {
          headers: headers,
        },
      );



      const acDetails=accountResponse.data.Data;
      const accountIds = acDetails.Account.map(account => account.AccountId);
      const allAccountDetails = acDetails.Account;

      const updatedDetails3 = {
        account_customer_consented: accountIds,
        account_details: JSON.stringify(allAccountDetails)

      };

      const columnsToUpdate3 = ['account_customer_consented', 'account_details'];

      await updateDetails(updatedDetails3, 1001, columnsToUpdate3);




      this.apiAccess = apiAccessToken;
      return accountResponse.data.Data;
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }
  async allCalls(endPoint: string): Promise<any> {
    try {
      const headers = {
        ...this.commonHeaders,
        Authorization: `Bearer ${this.apiAccess}`,
      };

      const accountResponse: AxiosResponse<any> = await axios.get(
        `${this.baseUrl}/${sandboxConfig.accountsEndpoint}/${endPoint}`,
        {
          headers: headers,
        },
      );
      return accountResponse.data.Data;
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }
}


export default SanboxApiClient;
