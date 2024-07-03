import axios, {AxiosResponse} from 'axios';
import {Linking, Alert} from 'react-native';
import * as Keychain from 'react-native-keychain';
import config from './ConfigFiles/config.json';
import sandboxConfig from './ConfigFiles/Nwb_Sandbox_AISP.json';
import sandboxConfigvrp from './ConfigFiles/Nwb_Sandbox_VRP.json';
import AndroidClient from '../DatabaseFactory/AndroidClientDb'; //importing database
import sandboxConfigPisp from './ConfigFiles/Nwb_Sandbox_PISP.json';
import uuid from 'react-native-uuid';
import ApiLogsDb from '../DatabaseFactory/ApiLogsDb';
import configVrp from './ConfigFiles/configvrp.json';
const {
  generateVrpAccountRequestHeaders,
  generateVrpPaymentBody,
  generateDomesticConsentHeaders,
  generateAccessTokenBody,
  generateAccountRequestHeaders,
  generateHeaders,
  generateBody,
  generateBodyForExchange,
  generateBodyForRefresh,
  generateBodyForPaymentRequest,
  generateHeadersForPisp,
  generateDomesticPaymentRequestBody,
  generatePaymentStatusHeaders,
} = require('./ConfigFiles/apiUtils.tsx');

const companyName = 'NWG'; // Replace "YourCompanyName" with the actual company name
const apiClient = 'Sandbox'; // Replace "YourApiClient" with the actual API client
const logClient = new ApiLogsDb('NWG', 'Sandbox', 'logs');

var consentID = '';

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
let vrpTransactToStore = {
  userId: '999999999',
  scope: 'vrp_transactions',
  consentId: '',
  vrpId: '',
  vrpPayload: '',
  status: '',
};
let pispToStore = {
  consentId: '',
  scope: '',
  payload: '',
  refreshtoken: '',
  paymentId: '',
  response: '',
  userId: '999999999',
};

let vrpToStore = {
  userId: '999999999',
  consentId: '',
  scope: 'vrp',
  refreshToken: '',
  consentPayload: '',
  consentExpiry: '',
  accountDetails: '',
  status: '',
};
let pispToUpdate = {
  userId: '7777777',
};
let androidClientAisp: AndroidClient;
let androidClientPisp: AndroidClient;
let androidClientVrp: AndroidClient;
let androidClientCA: AndroidClient;
let androidClientVrpTransact: AndroidClient;
let aispToStore = {
  userId: '999934356',
  scope: '',
  bankName: 'Natwest',
  consentId: '',
  consentPayload: '',
  refreshToken: '',
  accountsList: '',
};
const now = new Date();
let logData = {
  date: '',
  time: '',
  api_name: '',
  scope: '',
  status: '',
  response: '',
  bankName: 'Natwest',
};
interface CommonHeaders {
  [key: string]: string;
}
class SanboxApiFactory {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private commonHeaders: any; // Replace 'any' with the actual type of commonHeaders
  private permissions: string[] = [];
  private apiAccess: string = '';
  private scopeForThisCall: string = '';
  private DebtorAccount: any;
  private consentIdVrp: string = '';
  constructor(apiscope: string) {
    this.scopeForThisCall = apiscope;
    this.baseUrl = config.baseUrl;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.commonHeaders = config.contentType;
  }
  private generateHeaders(
    endpoint: string,
    accessToken: string | null = null,
  ): CommonHeaders {
    return generateHeaders(endpoint, accessToken, this.commonHeaders);
  }

  private generateBody(
    endpoint: string,
    data: Record<string, any>,
  ): Record<string, any> {
    return generateBody(endpoint, data, this.permissions);
  }

  private generateBodyForExchange(authToken: string): Record<string, string> {
    return generateBodyForExchange(authToken, this.clientId, this.clientSecret);
  }

  private generateBodyForRefresh(refreshToken: string): Record<string, string> {
    return generateBodyForRefresh(
      refreshToken,
      this.clientId,
      this.clientSecret,
    );
  }
  //starting function to call api factory which will decide the flow of code based on scope passed
  async callApiFactory(
    apiScope: string,
    permission: string[],
    DebtorAccount: any,
  ) {
    this.permissions = permission;
    this.scopeForThisCall = apiScope;
    this.DebtorAccount = DebtorAccount;
    await logClient.initDatabaseApi();
    switch (apiScope) {
      case 'accounts':
        androidClientAisp = new AndroidClient(companyName, apiClient, apiScope);
        console.log('******NWB SANDBOX ACCOUNTS CALL********');
        this.scopeForThisCall = 'accounts';
        let returnthisAisp = this.retrieveAccessToken();
        return returnthisAisp;
      case 'payments':
        androidClientPisp = new AndroidClient(companyName, apiClient, apiScope);
        console.log('******NWB SANDBOX PAYMENTS CALL********');
        this.scopeForThisCall = 'payments';
        let returnthisPisp = this.retrieveAccessToken();
        return returnthisPisp;
      case 'vrp':
        console.log('******NWB VRP CALL********');
        this.scopeForThisCall = 'vrp';
        let returnthisVrp = this.retrieveAccessToken();
        return returnthisVrp;
      default:
        console.log(
          'Wrong Scope: Sandbox has only three scopes, accounts, payments and vrp',
        );
    }
  }

  // call to retrieve access token for various scope
  async retrieveAccessToken() {
    if (this.scopeForThisCall == 'accounts') {
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
        aispToStore.scope = response.data.scope;
        //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Retreive Access Token',
          scope: this.scopeForThisCall,
          status: response.status.toString(),
          response: JSON.stringify(response),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        //Storing APILOGS
        return this.accountRequest(response.data.access_token);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Retreive Access Token',
            scope: this.scopeForThisCall,
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Retreive Access Token',
            scope: this.scopeForThisCall,
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);
        throw new Error(
          `Failed to fetch data Retreive Access Token accounts: ${error}`,
        );
      }
    }
    if (this.scopeForThisCall == 'payments') {
      try {
        const body = generateAccessTokenBody(
          sandboxConfig.grant_type,
          this.clientId,
          this.clientSecret,
          this.scopeForThisCall,
        );
        const header = generateHeaders(sandboxConfig.tokenEndpoint);

        const response: AxiosResponse<ResponseData> = await axios.post(
          `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
          null,
          {
            headers: header,
            params: body,
          },
        );
        pispToStore.scope = response.data.scope;
        //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Retreive Access Token',
          scope: this.scopeForThisCall,
          status: response.status.toString(),
          response: JSON.stringify(response),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        //Storing APILOGS
        return this.accountRequest(response.data.access_token);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Retreive Access Token',
            scope: this.scopeForThisCall,
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Retreive Access Token',
            scope: this.scopeForThisCall,
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);
        throw new Error(
          `Failed to fetch data Retreive Access Token payments: ${error}`,
        );
      }
    }
    if (this.scopeForThisCall == 'vrp') {
      try {
        const body = generateAccessTokenBody(
          sandboxConfig.grant_type,
          this.clientId,
          this.clientSecret,
          'payments',
        );

        const header = generateHeaders(sandboxConfig.tokenEndpoint);

        const response: AxiosResponse<ResponseData> = await axios.post(
          `${this.baseUrl}/${sandboxConfigvrp.tokenEndpoint}`,
          null,
          {
            headers: header,
            params: body,
          },
        );
        //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Retreive Access Token',
          scope: this.scopeForThisCall,
          status: response.status.toString(),
          response: JSON.stringify(response),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        //Storing APILOGS
        return this.accountRequest(response.data.access_token);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Retreive Access Token',
            scope: this.scopeForThisCall,
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Retreive Access Token',
            scope: this.scopeForThisCall,
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);
        throw new Error(
          `Failed to fetch data Retreive Access Token vrp: ${error}`,
        );
      }
    }
  }

  // call to request for consent id
  async accountRequest(accessToken: string) {
    if (this.scopeForThisCall == 'accounts') {
      try {
        const body = this.generateBody(
          sandboxConfig.accountRequestEndpoint,
          {},
        );

        const headers = this.generateHeaders(
          sandboxConfig.accountsEndpoint,
          accessToken,
        );

        const response: AxiosResponse<ResponseData> = await axios.post(
          `${this.baseUrl}/${sandboxConfig.accountRequestEndpoint}`,
          body,
          {
            headers: headers,
          },
        );
        aispToStore.consentId = response.data.Data?.ConsentId || '';
        aispToStore.consentPayload = JSON.stringify(body);
        //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Account Request',
          scope: this.scopeForThisCall,
          status: response.status.toString(),
          response: JSON.stringify(response),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        //Storing APILOGS
        return this.manualUserConsent(response.data.Data?.ConsentId || '');
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Account Request',
            scope: this.scopeForThisCall,
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Account Request',
            scope: this.scopeForThisCall,
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);
        throw new Error(
          `Failed to fetch data Account Request accounts: ${error}`,
        );
      }
    }
    if (this.scopeForThisCall == 'payments') {
      try {
        var accountRequestEndpoint =
          sandboxConfigPisp.accountRequestEndpointPisp;
        const id = uuid.v4();
        const body = generateBodyForPaymentRequest(
          this.DebtorAccount,
          true,
          '',
        );
        const headers = generateHeadersForPisp(
          accessToken,
          id,
          sandboxConfig.financialId,
          sandboxConfig.signatureJws,
        );
        const response: AxiosResponse<ResponseData> = await axios.post(
          `${this.baseUrl}/${accountRequestEndpoint}`,
          body,
          {
            headers: headers,
          },
        );
        // console.log(response.data);
        const consentId = response.data.Data?.ConsentId ?? ''; // Using nullish coalescing operator
        pispToStore.consentId = consentId; // Storing consent ID in toStore object
        pispToStore.payload = JSON.stringify(body);
        //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Account Request',
          scope: this.scopeForThisCall,
          status: response.status.toString(),
          response: JSON.stringify(response),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        //Storing APILOGS
        return response.data.Data?.ConsentId || '';
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Account Request',
            scope: this.scopeForThisCall,
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Account Request',
            scope: this.scopeForThisCall,
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);
        throw new Error(
          `Failed to fetch data Account Request payments: ${error}`,
        );
      }
    }
    if (this.scopeForThisCall == 'vrp') {
      try {
        const body = this.permissions;
        const headers = generateAccountRequestHeaders(accessToken);

        // console.log(body);
        const response: AxiosResponse<ResponseData> = await axios.post(
          `${this.baseUrl}/${sandboxConfigvrp.paymentRequestEndPoint}`,
          body,
          {
            headers: headers,
          },
        );
        //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Account Request',
          scope: this.scopeForThisCall,
          status: response.status.toString(),
          response: JSON.stringify(response),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        //Storing APILOGS
        return response.data;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Account Request',
            scope: this.scopeForThisCall,
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Account Request',
            scope: this.scopeForThisCall,
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);
        throw new Error(`Failed to fetch data Account Request vrp: ${error}`);
      }
    }
  }

  // redirect url to ask user for their consent

  async manualUserConsent(consentId: string) {
    let consentUrlWithVariables = '';

    // console.log('manual consent');
    if (this.scopeForThisCall == 'accounts') {
      consentUrlWithVariables = `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid accounts&redirect_uri=${sandboxConfig.redirectUri}&request=${consentId}`;
    }
    if (this.scopeForThisCall == 'payments') {
      consentID = consentId;
      consentUrlWithVariables = `${sandboxConfigPisp.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid payments&redirect_uri=${sandboxConfigPisp.redirectUri}&request=${consentId}`;
    }
    if (this.scopeForThisCall == 'vrp') {
      console.log('manuallu', consentId);

      consentUrlWithVariables = `${sandboxConfigvrp.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid payments&redirect_uri=${sandboxConfig.redirectUri}&request=${consentId}`;
    }
    Linking.openURL(consentUrlWithVariables);
    console.log(consentUrlWithVariables);
    return consentUrlWithVariables;
  }

  //alternative approach to get consent programmatically
  async userConsentProgammatically(consentId: string) {
    if (this.scopeForThisCall == 'accounts') {
      try {
        console.log('ConsentID:', consentId);
        const accountResponse: AxiosResponse<any> = await axios.get(
          `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid accounts&redirect_uri=${sandboxConfig.redirectUri}&state=ABC&request=${consentId}&authorization_mode=AUTO_POSTMAN&authorization_username=${sandboxConfig.psu}`,
        );
        return this.exchangeAccessToken(accountResponse.data.redirectUri, null);
      } catch (error) {
        throw new Error(`Failed to fetch data for accounts: ${error}`);
      }
    }
    if (this.scopeForThisCall == 'payments') {
    }
    if (this.scopeForThisCall == 'vrp') {
    }
  }

  // exchange token with user consent approved or denied code

  async exchangeAccessToken(authTokenUrl: string, consentData: any) {
    if (this.scopeForThisCall == 'accounts') {
      try {
        const start = authTokenUrl.indexOf('=') + 1;
        const end = authTokenUrl.indexOf('&');
        const authToken = authTokenUrl.slice(start, end);
        console.log('AuthToken', authToken);
        // const body: Record<string, string> = {
        //   client_id: this.clientId,
        //   client_secret: this.clientSecret,
        //   redirect_uri: sandboxConfig.redirectUri,
        //   grant_type: 'authorization_code',
        //   code: authToken,
        // };
        // const headers = {
        //   'Content-Type': 'application/x-www-form-urlencoded',
        // };
        const body = generateBodyForExchange(
          this.clientId,
          this.clientSecret,
          sandboxConfig.redirectUri,
          'authorization_code',
          authToken,
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
        aispToStore.refreshToken = response.data.refresh_token;
        //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Exchange Code for access token',
          scope: this.scopeForThisCall,
          status: response.status.toString(),
          response: JSON.stringify(response),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        //Storing APILOGS
        return this.fetchAccounts(response.data.access_token);
        //console.log('Api access token', response.data.access_token);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Exchange Code for access token',
            scope: this.scopeForThisCall,
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Exchange Code for access token',
            scope: this.scopeForThisCall,
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);
        throw new Error(
          `Failed to fetch data Exchange Code for access token aisp: ${error}`,
        );
      }
    }
    if (this.scopeForThisCall == 'payments') {
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
          authToken,
        );
        const headers = generateHeaders(sandboxConfig.tokenEndpoint);
        const response: AxiosResponse<ResponseData> = await axios.post(
          `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
          null,
          {
            headers: headers,
            params: body,
          },
        );
        console.log('Api access token', response.data.access_token);
        pispToStore.refreshtoken = response.data.refresh_token;
        //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Exchange Code for access token',
          scope: this.scopeForThisCall,
          status: response.status.toString(),
          response: JSON.stringify(response),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        //Storing APILOGS

        return this.domesticPayments(response.data.access_token);

        //return this.refreshToken(response.data.refresh_token);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Exchange Code for access token',
            scope: this.scopeForThisCall,
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Exchange Code for access token',
            scope: this.scopeForThisCall,
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);
        throw new Error(
          `Failed to fetch data Exchange Code for access token payments: ${error}`,
        );
      }
    }
    if (this.scopeForThisCall == 'vrp') {
      try {
        const start = authTokenUrl.indexOf('=') + 1;
        const end = authTokenUrl.indexOf('&');
        const authToken = authTokenUrl.slice(start, end);
        const body = generateBodyForExchange(
          this.clientId,
          this.clientSecret,
          sandboxConfig.redirectUri,
          'authorization_code',
          authToken,
        );
        const headers = generateHeaders(sandboxConfig.tokenEndpoint);
        const response: AxiosResponse<ResponseData> = await axios.post(
          `${this.baseUrl}/${sandboxConfigvrp.tokenEndpoint}`,
          null,
          {
            headers: headers,
            params: body,
          },
        );

        // console.log('Api access token', response.data.access_token);
        const RefreshToken = response.data.refresh_token;
        const consentExpiresIn = response.data.expires_in;

        const debitordetails = await this.getDomesticConsent(
          response.data.access_token,
          consentData.Links.Self,
        );
        const detailsCa = await this.getDetailsCA(response.data.access_token);
        //sending result to caller
        const result = {
          response: response.data,
          customerDetails: detailsCa,
          debitorDetails: debitordetails.Data,
        };
        androidClientVrp = new AndroidClient(companyName, apiClient, 'vrp');

        //inserting data in VRP table
        vrpToStore.consentId = consentData.Data.ConsentId;
        vrpToStore.accountDetails = JSON.stringify(debitordetails.Data);
        vrpToStore.consentPayload = JSON.stringify(consentData);
        vrpToStore.consentExpiry = String(consentExpiresIn);
        vrpToStore.refreshToken = RefreshToken;
        vrpToStore.status = 'Authorised';
        await androidClientVrp.insertDataVrp(vrpToStore);
        //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Exchange Code for access token',
          scope: this.scopeForThisCall,
          status: response.status.toString(),
          response: JSON.stringify(response),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        return result;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Exchange Code for access token',
            scope: this.scopeForThisCall,
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Exchange Code for access token',
            scope: this.scopeForThisCall,
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);
        throw new Error(
          `Failed to fetch data Exchange Code for access token vrp: ${error}`,
        );
      }
    }
  }
  async getDomesticConsent(accessToken: any, url: string) {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'x-fapi-financial-id': '0015800000jfwxXAAQ',
      };
      const allVrpResponse = await axios.get(url, {
        headers: headers,
      });
      console.log('allVrpResponse of  call', allVrpResponse.data);

      //Storing APILOGS
      logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'Get Domestic Consent',
        scope: 'VRP',
        status: allVrpResponse.status.toString(),
        response: JSON.stringify(allVrpResponse),
        bankName: 'Natwest',
      };
      await logClient.insertLog(logData);
      //Storing APILOGS
      return allVrpResponse.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Get Domestic Consent',
          scope: 'VRP',
          status: error.response?.status.toString() || 'unknown',
          response: JSON.stringify(error.response?.data || 'No response data'),
          bankName: 'Natwest',
        };
      } else {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Get Domestic Consent',
          scope: 'VRP',
          status: 'unknown',
          response: JSON.stringify(error.message || 'Unknown error'),
          bankName: 'Natwest',
        };
      }

      await logClient.insertLog(logData);
      throw new Error(
        `Failed to fetch data for get domestic consent: ${error}`,
      );
    }
  }
  async getDetailsCA(accessToken: any): Promise<any> {
    try {
      // const accessToken=this.accessTokenCA();
      // console.log("accesstoken",this.apiAccessToken);
      const headers = {
        Authorization: 'Bearer ' + accessToken,
      };
      const url =
        'zerocode/bankofapis.com/customer-checkout/v3/attributes/ecommerce-checkout';
      const response: AxiosResponse<ResponseData> = await axios.get(
        `${this.baseUrl}/${url}`,
        {
          headers: headers,
        },
      );
      //Storing APILOGS
      logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'Get CA Details',
        scope: 'CVRP',
        status: response.status.toString(),
        response: JSON.stringify(response),
        bankName: 'Natwest',
      };
      await logClient.insertLog(logData);
      //Storing APILOGS
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Get CA Details',
          scope: 'CVRP',
          status: error.response?.status.toString() || 'unknown',
          response: JSON.stringify(error.response?.data || 'No response data'),
          bankName: 'Natwest',
        };
      } else {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Get CA Details',
          scope: 'CVRP',
          status: 'unknown',
          response: JSON.stringify(error.message || 'Unknown error'),
          bankName: 'Natwest',
        };
      }

      await logClient.insertLog(logData);
      console.log('error in getting in vrp payments', error);
      throw new Error(`Failed to fetch data for get CA Details cvrp: ${error}`);
    }
  }

  async vrpPayments(
    apiAccessToken: string,
    consentid: string,
    formData: any,
  ): Promise<any> {
    try {
      // const headers = generateAccountRequestHeaders(apiAccessToken);

      // const body = generateVrpPaymentBody(formData, consentid);
      const id = uuid.v4();
      const headers = {
        ...configVrp.vrpHeaders,
        Authorization: `Bearer ${apiAccessToken}`,
        'x-idempotency-key': `${id}`,
      };
      const Identification = formData.accountNumber + formData.sortCode;
      console.log(Identification);
      const body = {
        Data: {
          ConsentId: `${consentid}`,
          PSUAuthenticationMethod: 'UK.OBIE.SCANotRequired',
          Initiation: {
            CreditorAccount: {
              SchemeName: 'SortCodeAccountNumber',
              Identification: Identification,
              Name: formData.firstName,
              SecondaryIdentification: 'secondary-identif',
            },
            RemittanceInformation: {
              Unstructured: 'Tools',
              Reference: formData.reference,
            },
          },
          Instruction: {
            InstructionIdentification: 'instr-identification',
            EndToEndIdentification: 'e2e-identification',
            InstructedAmount: {
              Amount: formData.amount,
              Currency: 'GBP',
            },
            CreditorAccount: {
              SchemeName: 'SortCodeAccountNumber',
              Identification: Identification,
              Name: formData.firstName,
              SecondaryIdentification: 'secondary-identif',
            },
            RemittanceInformation: {
              Unstructured: 'Tools',
              Reference: formData.reference,
            },
          },
        },
        Risk: {},
      };
      console.log('amount', body.Data.Instruction.InstructedAmount.Amount);

      console.log('head', headers);
      console.log('body', body);

      const vrpPaymentResponse: AxiosResponse = await axios.post(
        'https://ob.sandbox.natwest.com/open-banking/v3.1/pisp/domestic-vrps',
        body,
        {
          headers: headers,
        },
      );
      this.apiAccess = apiAccessToken;
      console.log('api', apiAccessToken);
      console.log('payments-->', vrpPaymentResponse.data.Links.Self);

      //Storing APILOGS
      logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'VRP Payments',
        scope: 'VRP',
        status: vrpPaymentResponse.status.toString(),
        response: JSON.stringify(vrpPaymentResponse),
        bankName: 'Natwest',
      };
      await logClient.insertLog(logData);
      //Storing APILOGS
      return this.getAllVrpPayments(vrpPaymentResponse.data.Links.Self);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'VRP Payments',
          scope: 'VRP',
          status: error.response?.status.toString() || 'unknown',
          response: JSON.stringify(error.response?.data || 'No response data'),
          bankName: 'Natwest',
        };
      } else {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'VRP Payments',
          scope: 'VRP',
          status: 'unknown',
          response: JSON.stringify(error.message || 'Unknown error'),
          bankName: 'Natwest',
        };
      }

      await logClient.insertLog(logData);

      throw new Error(`Failed to fetch data for vrp payments: ${error}`);
    }
  }

  async getAllVrpPayments(url: string): Promise<any> {
    try {
      const headers = generateVrpAccountRequestHeaders(
        this.apiAccess,
        '0015800000jfwxXAAQ',
      );
      const allVrpPaymentsResponse = await axios.get(url, {
        headers: headers,
      });
      console.log(
        'allVrpPaymentsResponse of final call',
        allVrpPaymentsResponse.data,
      );

      if (
        allVrpPaymentsResponse.data.Data.Status ===
        'AcceptedSettlementCompleted'
      ) {
        const payload = allVrpPaymentsResponse.data.Data;
        const id = allVrpPaymentsResponse.data.Data.ConsentId;

        //inserting data in VRP TRansactions Table
        vrpTransactToStore.consentId = id;
        vrpTransactToStore.vrpId =
          allVrpPaymentsResponse.data.Data.DomesticVRPId;
        vrpTransactToStore.vrpPayload = JSON.stringify(payload);
        vrpTransactToStore.status = allVrpPaymentsResponse.data.Data.Status;
        androidClientVrpTransact = new AndroidClient(
          companyName,
          apiClient,
          'vrp_transactions',
        );
        await androidClientVrpTransact.insertDataVrpTransact(
          vrpTransactToStore,
        );
      }
      //Storing APILOGS
      logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'Get All VRP Payments',
        scope: 'CVRP',
        status: allVrpPaymentsResponse.status.toString(),
        response: JSON.stringify(allVrpPaymentsResponse),
        bankName: 'Natwest',
      };
      await logClient.insertLog(logData);
      //Storing APILOGS
      return allVrpPaymentsResponse.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Get All VRP Payments',
          scope: 'CVRP',
          status: error.response?.status.toString() || 'unknown',
          response: JSON.stringify(error.response?.data || 'No response data'),
          bankName: 'Natwest',
        };
      } else {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Get All VRP Payments',
          scope: 'CVRP',
          status: 'unknown',
          response: JSON.stringify(error.message || 'Unknown error'),
          bankName: 'Natwest',
        };
      }

      await logClient.insertLog(logData);
      console.log('error in getting in vrp payments', error);
    }
  }

  async refreshToken(refreshToken: string, consentId: any): Promise<any> {
    if (this.scopeForThisCall === 'accounts') {
      try {
        const body = generateBodyForRefresh(
          this.clientId,
          this.clientSecret,
          'refresh_token',
          refreshToken,
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

        //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Refresh Token',
          scope: 'accounts',
          status: responseRefresh.status.toString(),
          response: JSON.stringify(responseRefresh),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        //Storing APILOGS
        return responseRefresh.data.access_token;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Refresh Token',
            scope: 'accounts',
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Refresh Token',
            scope: 'accounts',
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);
        throw new Error(
          `Failed to fetch data refresh token accounts: ${error}`,
        );
      }
    }
    if (this.scopeForThisCall == 'payments') {
    }

    if (this.scopeForThisCall == 'vrp') {
    }
  }
  async refreshTokenForVRP(
    refreshToken: any,
    grantedformData: any,
  ): Promise<any> {
    try {
      const body: Record<string, string> = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken.refreshToken,
      };
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      // console.log(body);
      const responseRefresh: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
        null,
        {
          headers: headers,
          params: body,
        },
      );
      const RefreshToken = responseRefresh.data.refresh_token;
      //updating refresh token in VRP table
      const details = {
        refreshToken: RefreshToken,
      };
      const columnsToUpdate = ['refreshToken'];

      const id = refreshToken.consentId;
      // console.log("id",id);
      // console.log("details-->",details);
      // console.log(id);
      androidClientVrp = new AndroidClient(companyName, apiClient, 'vrp');
      await androidClientVrp.updateDataByConsentId(
        id,
        details,
        columnsToUpdate,
      );

      // console.log('Refresh call response', responseRefresh.data);
      //Storing APILOGS
      logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'Refresh Token',
        scope: 'VRP',
        status: responseRefresh.status.toString(),
        response: JSON.stringify(responseRefresh),
        bankName: 'Natwest',
      };
      await logClient.insertLog(logData);

      return this.vrpPayments(
        responseRefresh.data.access_token,
        refreshToken.consentId,
        grantedformData,
      );
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Refresh Token',
          scope: 'VRP',
          status: error.response?.status.toString() || 'unknown',
          response: JSON.stringify(error.response?.data || 'No response data'),
          bankName: 'Natwest',
        };
      } else {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Refresh Token',
          scope: 'VRP',
          status: 'unknown',
          response: JSON.stringify(error.message || 'Unknown error'),
          bankName: 'Natwest',
        };
      }

      await logClient.insertLog(logData);
      throw new Error(`Failed to fetch data refresh token vrp: ${error}`);
    }
  }

  async domesticPayments(apiAccess: string) {
    try {
      const idd = uuid.v4();
      console.log('m here');
      const headers = generateHeadersForPisp(
        apiAccess,
        idd,
        sandboxConfig.financialId,
        sandboxConfig.signatureJws,
      );
      const requestBody = generateDomesticPaymentRequestBody(
        consentID,
        this.DebtorAccount,
        {
          SchemeName: 'IBAN',
          Identification: 'BE56456394728288',
          Name: 'ACME DIY',
          SecondaryIdentification: 'secondary-identif',
        },
        'EcommerceGoods',
      );
      const paymentResponse: AxiosResponse<any> = await axios.post(
        `${this.baseUrl}/${sandboxConfigPisp.domesticPaymentsEndpoint}`,
        requestBody,
        {
          headers: headers,
        },
      );

      console.log(paymentResponse.data);
      //Storing APILOGS
      logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'Domestic Payments',
        scope: 'payments',
        status: paymentResponse.status.toString(),
        response: JSON.stringify(paymentResponse),
        bankName: 'Natwest',
      };
      await logClient.insertLog(logData);
      //Storing APILOGS
      return this.getPaymentSatus(
        apiAccess,
        paymentResponse.data.Data.DomesticPaymentId,
      );
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Domestic Payments',
          scope: 'payments',
          status: error.response?.status.toString() || 'unknown',
          response: JSON.stringify(error.response?.data || 'No response data'),
          bankName: 'Natwest',
        };
      } else {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Domestic Payments',
          scope: 'payments',
          status: 'unknown',
          response: JSON.stringify(error.message || 'Unknown error'),
          bankName: 'Natwest',
        };
      }

      await logClient.insertLog(logData);
      throw new Error(
        `Failed to fetch data for accounts domestic payments pisp: ${error}`,
      );
    }
  }
  async getPaymentSatus(
    apiAccessToken: string,
    domesticPaymentsId: string,
  ): Promise<any> {
    try {
      // const headers = {
      //   Authorization: 'Bearer ' + apiAccessToken,
      //   'x-fapi-financial-id': sandboxConfigPisp.financialId,
      // };
      const headers = generatePaymentStatusHeaders(apiAccessToken);

      const payResponse: AxiosResponse<any> = await axios.get(
        `${this.baseUrl}/${sandboxConfigPisp.paymentSelfLink}/${domesticPaymentsId}`,
        {
          headers: headers,
        },
      );
      console.log(payResponse.data.Data);
      console.log('AllSet');
      pispToStore.response = JSON.stringify(payResponse);
      pispToStore.paymentId = payResponse.data.Data.DomesticPaymentId;
      console.log(pispToStore);

      await androidClientPisp.insertDataPisp(pispToStore);
      console.log('Storing this to the table');
      await androidClientPisp.displayData();
      //Storing APILOGS
      logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'Payment Status',
        scope: 'payments',
        status: payResponse.status.toString(),
        response: JSON.stringify(payResponse),
        bankName: 'Natwest',
      };
      await logClient.insertLog(logData);
      //Storing APILOGS
      return payResponse.data.Data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Payment Status',
          scope: 'payments',
          status: error.response?.status.toString() || 'unknown',
          response: JSON.stringify(error.response?.data || 'No response data'),
          bankName: 'Natwest',
        };
      } else {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Payment Status',
          scope: 'payments',
          status: 'unknown',
          response: JSON.stringify(error.message || 'Unknown error'),
          bankName: 'Natwest',
        };
      }

      await logClient.insertLog(logData);
      throw new Error(
        `Failed to fetch data for accounts payment status pisp: ${error}`,
      );
    }
  }
  async fetchAccounts(apiAccessToken: string) {
    try {
      // const headers = {
      //   ...this.commonHeaders,
      //   Authorization: `Bearer ${apiAccessToken}`,
      // };
      const headers = this.generateHeaders(
        sandboxConfig.accountsEndpoint,
        apiAccessToken,
      );

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

      this.apiAccess = apiAccessToken;
      await this.storeAccessToken(apiAccessToken);
      aispToStore.accountsList = JSON.stringify(accountResponse.data.Data);
      //print aispToSTore
      console.log(aispToStore);

      await androidClientAisp.insertDataAisp(aispToStore);

      await androidClientAisp.displayData();
      console.log('ACCOUNT ADDED SUCCESSFULLY');
      //Storing APILOGS
      logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'Fetch Accounts',
        scope: 'accounts',
        status: accountResponse.status.toString(),
        response: JSON.stringify(accountResponse),
        bankName: 'Natwest',
      };
      await logClient.insertLog(logData);
      //Storing APILOGS
      return accountResponse.data.Data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Fetch Accounts',
          scope: this.scopeForThisCall,
          status: error.response?.status.toString() || 'unknown',
          response: JSON.stringify(error.response?.data || 'No response data'),
          bankName: 'Natwest',
        };
      } else {
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Fetch Accounts',
          scope: this.scopeForThisCall,
          status: 'unknown',
          response: JSON.stringify(error.message || 'Unknown error'),
          bankName: 'Natwest',
        };
      }

      await logClient.insertLog(logData);
      throw new Error(`Failed to fetch data for accounts aisp: ${error}`);
    }
  }
  async allCalls(endPoint: string): Promise<any> {
    if (this.scopeForThisCall == 'accounts') {
      const access_token = await this.getAccessToken();

      if (access_token !== null) {
        this.apiAccess = access_token;
        //console.log(access_token);
      } else {
        console.log('No access token stored');
      }
      try {
        // const headers = {
        //   ...this.commonHeaders,
        //   Authorization: `Bearer ${this.apiAccess}`,
        // };
        const headers = this.generateHeaders(
          sandboxConfig.accountsEndpoint,
          this.apiAccess,
        );

        const accountResponse: AxiosResponse<any> = await axios.get(
          `${this.baseUrl}/${sandboxConfig.accountsEndpoint}/${endPoint}`,
          {
            headers: headers,
          },
        );
        //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: endPoint,
          scope: this.scopeForThisCall,
          status: accountResponse.status.toString(),
          response: JSON.stringify(accountResponse),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        //Storing APILOGS
        return accountResponse.data.Data;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: endPoint,
            scope: this.scopeForThisCall,
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: endPoint,
            scope: this.scopeForThisCall,
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);
        throw new Error(`Failed to fetch data for all calls: ${error}`);
      }
    } else if (this.scopeForThisCall == 'payments') {
      return '7777';
    } else if (this.scopeForThisCall == 'vrp') {
      return '999';
    } else {
      return '74584';
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
    if (this.scopeForThisCall == 'accounts') {
      // const refresh_token = await fetchRefreshedToken(1001);

      // const access_token = await this.refreshToken(refresh_token);
      const apiAccessToken = access_token;
      try {
        // const headers = {
        //   ...this.commonHeaders,
        //   Authorization: `Bearer ${apiAccessToken}`,
        // };
        const headers = this.generateHeaders(
          sandboxConfig.accountsEndpoint,
          apiAccessToken,
        );

        const accountResponse: AxiosResponse<any> = await axios.get(
          `${this.baseUrl}/${sandboxConfig.accountsEndpoint}`,
          {
            headers: headers,
          },
        ); //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: 'Fetch Account with Refresh Token',
          scope: this.scopeForThisCall,
          status: accountResponse.status.toString(),
          response: JSON.stringify(accountResponse),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        //Storing APILOGS
        return accountResponse.data.Data;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Fetch Account with Refresh Token',
            scope: this.scopeForThisCall,
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: 'Fetch Account with Refresh Token',
            scope: this.scopeForThisCall,
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);
        throw new Error(
          `Failed to fetch data for fetch with refresh token : ${error}`,
        );
      }
    }
    if (this.scopeForThisCall == 'payments') {
    }
    if (this.scopeForThisCall == 'vrp') {
    }
  }
  async allCallsWithRefreshToken(endPoint: string, access_token: string) {
    // const refresh_token = await fetchRefreshedToken(1001);
    // const access_token = await this.refreshToken(refresh_token);

    this.apiAccess = access_token;
    if (this.scopeForThisCall == 'accounts') {
      try {
        // const headers = {
        //   ...this.commonHeaders,
        //   Authorization: `Bearer ${this.apiAccess}`,
        // };
        console.log(endPoint);
        const headers = this.generateHeaders(
          sandboxConfig.accountsEndpoint,
          this.apiAccess,
        );

        const accountResponse: AxiosResponse<any> = await axios.get(
          `${this.baseUrl}/${sandboxConfig.accountsEndpoint}/${endPoint}`,
          {
            headers: headers,
          },
        );

        //Storing APILOGS
        logData = {
          date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
            2,
            '0',
          )}-${String(now.getDate()).padStart(2, '0')}`,
          time: `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes(),
          ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
          api_name: endPoint + ' with refresh token',
          scope: this.scopeForThisCall,
          status: accountResponse.status.toString(),
          response: JSON.stringify(accountResponse),
          bankName: 'Natwest',
        };
        await logClient.insertLog(logData);
        //Storing APILOGS
        return accountResponse.data.Data;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: endPoint + ' with refresh token',
            scope: this.scopeForThisCall,
            status: error.response?.status.toString() || 'unknown',
            response: JSON.stringify(
              error.response?.data || 'No response data',
            ),
            bankName: 'Natwest',
          };
        } else {
          logData = {
            date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              '0',
            )}-${String(now.getDate()).padStart(2, '0')}`,
            time: `${String(now.getHours()).padStart(2, '0')}:${String(
              now.getMinutes(),
            ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            api_name: endPoint + ' with refresh token',
            scope: this.scopeForThisCall,
            status: 'unknown',
            response: JSON.stringify(error.message || 'Unknown error'),
            bankName: 'Natwest',
          };
        }

        await logClient.insertLog(logData);

        throw new Error(`Failed to fetch data with refresh token: ${error}`);
      }
    }
    if (this.scopeForThisCall == 'payments') {
    }
    if (this.scopeForThisCall == 'vrp') {
    }
  }
}

export default SanboxApiFactory;
