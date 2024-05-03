import axios, {AxiosResponse} from 'axios';
import {Linking, Alert} from 'react-native';
import * as Keychain from 'react-native-keychain';
import config from '../configs_AISP/config.json';
import sandboxConfig from '../configs_AISP/Sandbox.json';
import {addDetails} from '../database/Database';
import {updateDetails, fetchRefreshedToken} from '../database/Database';
const { generateHeaders, generateBody, generateBodyForExchange, generateBodyForRefresh } = require('../ConfigFiles/apiUtils.tsx');
//DB
var refreshTokenExists = false;

interface ResponseData {
  refresh_token: string;
  access_token: string;
  scope: string;
  expires_in: number;
  Data?: {
    ConsentId?: string;
    Status: string;
  };
}
//DB
interface CommonHeaders {
  [key: string]: string;
}
interface UserCredentials {
  username: string;
  password: string;
}

class SanboxApiClient {
  
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private commonHeaders: any; 
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
  private generateHeaders(endpoint: string,accessToken: string | null = null): CommonHeaders {
    return generateHeaders(endpoint,accessToken, this.commonHeaders);
 }

 private generateBody(endpoint: string, data: Record<string, any>): Record<string, any> {
    return generateBody(endpoint, data, this.permissions);
 }

 private generateBodyForExchange(authToken: string): Record<string, string> {
    return generateBodyForExchange(authToken, this.clientId, this.clientSecret);
 }

 private generateBodyForRefresh(refreshToken: string): Record<string, string> {
    return generateBodyForRefresh(refreshToken, this.clientId, this.clientSecret);
 }

  async  eCommQuickCheckout(accessToken: string): Promise<any> {
    console.log(accessToken);
    try{
      const headers = this.generateHeaders(sandboxConfig.accountRequestEndpoint,accessToken);

      const checkoutResponse: AxiosResponse<any> = await axios.get(
        `${this.baseUrl}/${sandboxConfig.eCommCheckoutEndpoint}`,
        {
          headers: headers,
        },
      );

      const data = checkoutResponse.data.data;
      console.log(data);

    }catch(error) {
      throw new Error(`Failed to fetch details of customer:  ${error}`);
    }
  }

  async retrieveAccessToken(permission: string[]): Promise<string> {
    this.permissions = permission;
    try {
      const body = this.generateBody(sandboxConfig.tokenEndpoint, {});

      const headers = {...this.commonHeaders};

      const response: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
        null,
        {
          headers: headers,
          params: body,
        },
      );
      //store
      //storing scope in database
      const scope = response.data.scope;

      const details1 = {
        userId: 1001,
        scope: scope,
      };

      addDetails(details1);
      // store
      console.log('Access token', response.data.access_token);
      await this.eCommQuickCheckout(response.data.access_token);
      return this.accountRequest(response.data.access_token);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async accountRequest(accessToken: string): Promise<string> {
    try {
      const body = this.generateBody(sandboxConfig.accountRequestEndpoint, {});

      const headers = this.generateHeaders(sandboxConfig.accountsEndpoint,accessToken);

      const response: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.accountRequestEndpoint}`,
        body,
        {
          headers: headers,
        },
      );
      //store
      const Status = response.data.Data?.Status;
      const Payload = response.data.Data;
      const ConsentId = response.data.Data?.ConsentId || '';

      const updatedDetails1 = {
        bankname: 'Natwest',
        consentid: ConsentId,
        status: Status,
        consentpayload: JSON.stringify(Payload),
      };

      const columnsToUpdate1 = ['bankname', 'consentid', 'consentpayload'];

      await updateDetails(updatedDetails1, 1001, columnsToUpdate1);
      //DB
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
      const body = generateBodyForExchange(
        this.clientId, 
        this.clientSecret,
        sandboxConfig.redirectUri,
        'authorization_code',
        authToken
      );
      const headers = this.generateHeaders(sandboxConfig.tokenEndpoint);

      const response: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
        null,
        {
          headers: headers,
          params: body,
        },
      );
      //store
      const RefreshToken = response.data.refresh_token;
      const consentExpiresIn = response.data.expires_in;
      const Scope = response.data.scope;

      const updatedDetails2 = {
        refreshedtoken: RefreshToken,
        status: 'Authorised',
        consentexpiry: consentExpiresIn,
      };

      const columnsToUpdate2 = ['refreshedtoken', 'status', 'consentexpiry'];

      await updateDetails(updatedDetails2, 1001, columnsToUpdate2);

      //store

      //setting flag after storing refresh token in db
      refreshTokenExists = true;

      return this.fetchAccounts(response.data.access_token);
      //console.log('Api access token', response.data.access_token);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }
  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const body = generateBodyForRefresh(
        this.clientId,
        this.clientSecret,
        'refresh_token',
        refreshToken
      );
      const headers = this.generateHeaders(sandboxConfig.tokenEndpoint);
      const responseRefresh: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
        null,
        {
          headers: headers,
          params: body,
        },
      );

      console.log('Refresh call response', responseRefresh.data);
      const RefreshToken = responseRefresh.data.refresh_token;
      //console.log(refreshToken);
      const updatedDetails3 = {
        refreshedtoken: RefreshToken,
      };

      const columnsToUpdate3 = ['refreshedtoken'];

      await updateDetails(updatedDetails3, 1001, columnsToUpdate3);

      //return this.fetchAccounts(responseRefresh.data.access_token);
      return responseRefresh.data.access_token;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async  fetchAge(apiAccessToken: string): Promise<any> {
    
    try{
      const headers = this.generateHeaders(sandboxConfig.accountsEndpoint,apiAccessToken);

      const ageResponse: AxiosResponse<any> = await axios.get(
        `${this.baseUrl}/${sandboxConfig.ageEndpoint}`,
        {
          headers: headers,
        },
      );

      const age = ageResponse.data.data[0].age;
      console.log(age);

    }catch(error) {
      throw new Error(`Failed to fetch data for age:  ${error}`);
    }
  }

  async fetchAccounts(apiAccessToken: string): Promise<any> {
    try {
      const headers = this.generateHeaders(sandboxConfig.accountsEndpoint,apiAccessToken);

      const accountResponse: AxiosResponse<any> = await axios.get(
        `${this.baseUrl}/${sandboxConfig.accountsEndpoint}`,
        {
          headers: headers,
        },
      );
      //store
      const acDetails = accountResponse.data.Data;
      const accountIds = acDetails.Account.map(
        (account: any) => account.AccountId,
      );
      const allAccountDetails = acDetails.Account;

      const updatedDetails3 = {
        account_customer_consented: accountIds,
        account_details: JSON.stringify(allAccountDetails),
      };

      const columnsToUpdate3 = [
        'account_customer_consented',
        'account_details',
      ];

      await updateDetails(updatedDetails3, 1001, columnsToUpdate3);
      //store
      this.apiAccess = apiAccessToken;
      await this.storeAccessToken(apiAccessToken);
      await this.fetchAge(apiAccessToken);
      return accountResponse.data.Data;
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }
  async allCalls(endPoint: string): Promise<any> {
    const access_token = await this.getAccessToken();
    if (access_token !== null) {
      this.apiAccess = access_token;
      //console.log(access_token);
    } else {
      console.log('No access token stored');
    }
    try {
      const headers = this.generateHeaders(sandboxConfig.accountsEndpoint,this.apiAccess);

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

  async storeAccessToken(accessToken: string) {
    try {
      await Keychain.setGenericPassword('access_token', accessToken);
      console.log('Access token stored or updated successfully for user');
    } catch (error) {
      console.error('Error storing or updating access token for user', error);
    }
  }

  async getAccessToken() {
    const key = 'access_token';
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.username === key) {
        // console.log('Access token:', credentials.password);
        return credentials.password;
      } else {
        console.log(`No access token stored`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving access token for user', error);
      return null;
    }
  }
  async fetchAccountsWithRefreshToken(access_token: string): Promise<any> {
    const apiAccessToken = access_token;
    try {
      const headers = this.generateHeaders(sandboxConfig.accountsEndpoint,apiAccessToken);

      const accountResponse: AxiosResponse<any> = await axios.get(
        `${this.baseUrl}/${sandboxConfig.accountsEndpoint}`,
        {
          headers: headers,
        },
      );

      return accountResponse.data.Data;
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }
  async allCallsWithRefreshToken(
    endPoint: string,
    access_token: string,
  ): Promise<any> {
    this.apiAccess = access_token;

    try {
      const headers = this.generateHeaders(sandboxConfig.accountsEndpoint,this.apiAccess);

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
