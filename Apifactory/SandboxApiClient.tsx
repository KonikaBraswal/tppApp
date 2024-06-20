import axios, {AxiosResponse} from 'axios';
import {Linking, Alert} from 'react-native';
// import * as Keychain from 'react-native-keychain';
// import config from '../configs_AISP/config.json';
import config from '../configs/config_Sandbox.json';
import sandboxConfig from '../configs/Sandbox.json';
// import config from '../configs_VRP/config.json';
// import sandboxConfig from '../configs_VRP/Sandbox.json';
// import config from '../configs_PISP/config.json';
// import sandboxConfig from '../configs_PISP/Sandbox.json';
// import sandboxConfig from '../configs_AISP/Sandbox.json';
//clientId and clientSecret is different
// import {addDetails} from '../database/Database';
// import {updateDetails, fetchRefreshedToken} from '../database/Database';
// import * as SecureStore from 'expo-secure-store';
// import config from '../configs_AISP/config.json'
// import sandboxConfig from '../configs_AISP/Sandbox.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "react-native-get-random-values";
import uuid from "react-native-uuid";
import "setimmediate";
interface BodyData {
  Data: {
    Permissions: string[];
  };
  Risk: {}; // Adjust this if Risk has a specific structure
}

var refreshTokenExists = false;

interface ResponseData {
  scope: any;
  expires_in: any;
  refresh_token: string;
  access_token: string;
  Data?: {
    ConsentId?: string;
    Status?: any;
  };
}
//DB

interface UserCredentials {
  username: string;
  password: string;
}
interface InitiationData {
  InstructionIdentification: string;
  EndToEndIdentification: string;
  InstructedAmount: {
    Amount: string;
    Currency: string; // Assuming Currency is a string
  };
  DebtorAccount: any; // Adjust the type as needed
  CreditorAccount: {
    SchemeName: string;
    Identification: string;
    Name: string;
    SecondaryIdentification: string;
  };
  RemittanceInformation: {
    Unstructured: string;
    Reference: string;
  };
}
var consentID="";
interface PaymentRisk{
  PaymentContextCode:string;
  MerchantCategoryCode:any;
  MerchantCustomerIdentification:any;
  DeliveryAddress:any;
}
interface PaymentRisk {
  PaymentContextCode: string;
  MerchantCategoryCode: any; // Adjust the type as needed
  MerchantCustomerIdentification: any; // Adjust the type as needed
  DeliveryAddress: any; // Adjust the type as needed
}
interface ApiHeaders {
  Authorization: string;
  'Content-Type': string;
  'x-jws-signature': string;
  'x-idempotency-key': string;
  'x-fapi-financial-id': string;
}
interface PaymentBodyData {
  Data: {
    Initiation: InitiationData;
  };
  Risk: PaymentRisk;
}
interface AccessTokenRequestParams {
  accessTokenParams: any;
  scope: string;
  headers: Record<string, string>;
  body: string; // Adjust the type according to your actual body structure
  consentUrl: string;
}
interface VRPData{
  [key:string]:any
}
let newVRPConsent:VRPData={};
interface UserCredentials{
  username:string;
  password:string;
}
class SanboxApiClient {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private commonHeaders: any; // Replace 'any' with the actual type of commonHeaders
  private permissions: string[] = [];
  private apiAccess: string = '';
  private consentId: string = '';
  private accessToken: string = '';
  private callScope:string="";
  private DebtorAccount:any;
  private refreshtoken: string = '';
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
  isupdateTransaction=false;
  
  async eCommQuickCheckout(accessToken:string):Promise<any>{
    console.log(accessToken);
    try{
      const headers={
        ...this.commonHeaders,
        Authorization:` Bearer ${accessToken}`,
      };
      const checkoutResponse:AxiosResponse<any>=await axios.get(
        `${this.baseUrl}/${sandboxConfig.eCommCheckoutEndpoint}`,
        {
          headers: headers,
        }
      );
      const data=checkoutResponse.data.data;
      console.log(data);
    }
    catch(error){
      throw new Error(`Failed to fetch details of customer:${error}`);
    }
  } 
  async fetchAge(apiAccessToken: string): Promise<any>{
    try{
        const headers={
            ...this.commonHeaders,
            Authorization:`Bearer ${apiAccessToken}`,
        };
        const ageResponse: AxiosResponse<any>=await axios.get(
            `${this.baseUrl}/${sandboxConfig.ageEndpoint}`,
            {
                headers: headers,
            }
        );
        const age=ageResponse.data.data[0].age;
        console.log(age);
    }
    catch(error){
        throw new Error(`Failed to fetch data for age :${error}`);
    }
  }
  //****************AISP*********************** */
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
      //store
      //storing scope in database
      const scope = response.data.scope;

      const details1 = {
        userId: 1001,
        scope: scope,
      };

      // addDetails(details1);
      // store
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
        `${this.baseUrl}/${sandboxConfig.accountRequestEndpointAisp}`,
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

      // await updateDetails(updatedDetails1, 1001, columnsToUpdate1);
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

      // await updateDetails(updatedDetails2, 1001, columnsToUpdate2);

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
      const body: Record<string, string> = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        //redirect_uri: sandboxConfig.redirectUri,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      };
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

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

      // await updateDetails(updatedDetails3, 1001, columnsToUpdate3);

      //return this.fetchAccounts(responseRefresh.data.access_token);
      return responseRefresh.data.access_token;
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

      // await updateDetails(updatedDetails3, 1001, columnsToUpdate3);
      //store
      this.apiAccess = apiAccessToken;
      await this.storeAccessToken(apiAccessToken);
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

  async storeAccessToken(accessToken: string) {
    try {
      // await SecureStore.setItemAsync('access_token', accessToken);
      await AsyncStorage.setItem('access_token', accessToken);
      console.log('Access token stored or updated successfully for user');
    } catch (error) {
      console.error('Error storing or updating access token for user', error);
    }
  }

  async getAccessToken() {
    const key = 'access_token';
    try {
      // const credentials = await SecureStore.getItemAsync(key);
      // if (credentials && credentials.username === key) {
      //   // console.log('Access token:', credentials.password);
      //   return credentials.password;
      // } else {
      //   console.log(`No access token stored`);
      //   return null;
      // }
      const credentials= await AsyncStorage.getItem('access_token');
      return credentials
    } catch (error) {
      console.error('Error retrieving access token for user', error);
      return null;
    }
  }
  async fetchAccountsWithRefreshToken(access_token: string): Promise<any> {
    // const refresh_token = await fetchRefreshedToken(1001);

    // const access_token = await this.refreshToken(refresh_token);
    const apiAccessToken = access_token;
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

      return accountResponse.data.Data;
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }
  async allCallsWithRefreshToken(
    endPoint: string,
    access_token: string,
  ): Promise<any> {
    // const refresh_token = await fetchRefreshedToken(1001);
    // const access_token = await this.refreshToken(refresh_token);

    this.apiAccess = access_token;

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

  //************PISP*********************//
  async retrieveAccessToken_pisp(
    callScope: string,
    DebtorAccount: any,
  ): Promise<string> {
    let body: Record<string, string> = {};
    let header: Record<string, string> = {};
    this.DebtorAccount = DebtorAccount;
    if (callScope == 'payments') {
      this.callScope = callScope;
      console.log('Payments Call');

      body = {
        grant_type: sandboxConfig.grant_type,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: callScope,
      };
      header = {
        'Content-Type': 'application/x-www-form-urlencoded', // Corrected content type
      };
    }

    try {
      const response: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
        null,
        {
          headers: header,
          params: body,
        },
      );
      //store
      //storing scope in database
      const scope = response.data.scope;

      const details1 = {
        userId: 1002,
        scope: scope,
      };

      // addDetails(details1);
      // store
      console.log('Access token', response.data);
      return this.accountRequest_pisp(response.data.access_token);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async accountRequest_pisp(accessToken: string): Promise<string> {
    var accountRequestEndpoint = '';
    const id = uuid.v4();
    console.log('id', id);
    var body: BodyData | PaymentBodyData | undefined;
    var headers: {[key: string]: string} = {};
    try {
      if (this.callScope == 'accounts') {
        accountRequestEndpoint = sandboxConfig.accountRequestEndpointAisp;
        body = {
          Data: {
            Permissions: this.permissions, //get permissions from db
          },
          Risk: {}, // get risks from db
        };

        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        };
      }
      if (this.callScope == 'payments') {
        accountRequestEndpoint = sandboxConfig.accountRequestEndpointPisp;

        body = {
          Data: {
            Initiation: {
              InstructionIdentification: 'instr-identification',
              EndToEndIdentification: 'e2e-identification',
              InstructedAmount: {
                Amount: '1.00',
                Currency: 'GBP',
              },
              DebtorAccount: this.DebtorAccount,
              CreditorAccount: {
                SchemeName: 'IBAN',
                Identification: 'BE56456394728288',
                Name: 'ACME DIY',
                SecondaryIdentification: 'secondary-identif',
              },
              RemittanceInformation: {
                Unstructured: 'Tools',
                Reference: 'Tools',
              },
            },
          },
          Risk: {
            PaymentContextCode: 'EcommerceGoods',
            MerchantCategoryCode: null,
            MerchantCustomerIdentification: null,
            DeliveryAddress: null,
          },
        };

        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
          'x-fapi-financial-id': sandboxConfig.financialId,
          'x-jws-signature': sandboxConfig.signatureJws,
          'x-idempotency-key': `${id}`,
        };
      }
      const response: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${accountRequestEndpoint}`,
        body,
        {
          headers: headers,
        },
      );

      //store
      var Status = response.data.Data?.Status;
      var Payload = response.data.Data;
      var ConsentId = response.data.Data?.ConsentId || '';

      const updatedDetails1 = {
        bankname: 'Natwest',
        consentid: ConsentId,
        status: Status,
        consentpayload: JSON.stringify(Payload),
      };

      const columnsToUpdate1 = ['bankname', 'consentid', 'consentpayload'];

      // await updateDetails(updatedDetails1, 1002, columnsToUpdate1);
      //store
      console.log('successss**');
      console.log(response.data);
      return response.data.Data?.ConsentId || '';
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async manualUserConsent_pisp(consentId: string): Promise<string> {
    let consentUrlWithVariables = '';
    consentID = consentId;

    console.log('manual consent');
    if (this.callScope == 'accounts') {
      consentUrlWithVariables = `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid accounts&redirect_uri=${sandboxConfig.redirectUri}&request=${consentId}`;
    }
    if (this.callScope == 'payments') {
      consentUrlWithVariables = `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid payments&redirect_uri=${sandboxConfig.redirectUri}&request=${consentId}`;
    }
    Linking.openURL(consentUrlWithVariables);
    return consentUrlWithVariables;
  }

  async exchangeAccessToken_pisp(authTokenUrl: string): Promise<string> {
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

      // await updateDetails(updatedDetails2, 1001, columnsToUpdate2);

      //store

      //setting flag after storing refresh token in db
      refreshTokenExists = true;
      console.log('Api access token', response.data.access_token);
      return this.domesticPayments_pisp(response.data.access_token);
      // console.log('Api refresh token', response.data.refresh_token);
      // if (this.callScope == 'payments') {
      //   return this.domesticPayments(response.data.access_token);
      // }
      // return this.fetchAccounts(response.data.access_token);
      return this.refreshToken_pisp(response.data.refresh_token);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async refreshToken_pisp(refreshToken: string): Promise<any> {
    try {
      const body: Record<string, string> = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        //redirect_uri: sandboxConfig.redirectUri,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      };
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const responseRefresh: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
        null,
        {
          headers: headers,
          params: body,
        },
      );

      console.log('Refresh call response', responseRefresh.data);

      // return this.fetchAccounts(responseRefresh.data.access_token);
      return responseRefresh.data.access_token;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async domesticPayments_pisp(apiAccess: string): Promise<any> {
    try {
      const idd = uuid.v4();
      console.log('idddd', idd);
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiAccess,
        'x-fapi-financial-id': sandboxConfig.financialId,
        'x-jws-signature': sandboxConfig.signatureJws,
        'x-idempotency-key': `${idd}`,
      };

      const requestBody = {
        Data: {
          ConsentId: consentID,
          Initiation: {
            InstructionIdentification: 'instr-identification',
            EndToEndIdentification: 'e2e-identification',
            InstructedAmount: {
              Amount: '1.00',
              Currency: 'GBP',
            },
            DebtorAccount: this.DebtorAccount,
            CreditorAccount: {
              SchemeName: 'IBAN',
              Identification: 'BE56456394728288',
              Name: 'ACME DIY',
              SecondaryIdentification: 'secondary-identif',
            },
            RemittanceInformation: {
              Unstructured: 'Tools',
              Reference: 'Tools',
            },
          },
        },
        Risk: {
          PaymentContextCode: 'EcommerceGoods',
        },
      };

      const paymentResponse: AxiosResponse<any> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.domesticPaymentsEndpoint}`,
        requestBody, // Remove the object wrapper from requestBody
        {
          headers: headers,
        },
      );

      // Additional processing...
      console.log('success');
      console.log(paymentResponse.data);
      return this.getPaymentSatus_pisp(
        apiAccess,
        paymentResponse.data.Data.DomesticPaymentId,
      );
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }
  async getPaymentSatus_pisp(
    apiAccessToken: string,
    domesticPaymentsId: string,
  ): Promise<any> {
    try {
      const headers = {
        Authorization: 'Bearer ' + apiAccessToken,
        'x-fapi-financial-id': sandboxConfig.financialId,
      };

      const payResponse: AxiosResponse<any> = await axios.get(
        `${this.baseUrl}/${sandboxConfig.paymentSelfLink}/${domesticPaymentsId}`,
        {
          headers: headers,
        },
      );
      console.log(payResponse.data.Data);
      console.log('AllSet');
      return payResponse.data.Data;
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }

  // ///**********************VRP**************************** *///

  async retrieveAccessToken_vrp(params: AccessTokenRequestParams): Promise<string> {
    this.permissions = params.accessTokenParams.body;
    try {
      const body: Record<string, string> = {
        grant_type: sandboxConfig.grant_type,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: params.accessTokenParams.scope,
      };
      const response: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
        body,
        {
          headers: params.accessTokenParams.headers,
        },
      );
      console.log('Access token', response.data.access_token);
      this.accessToken = response.data.access_token;
      return this.accountRequest_vrp(params.accessTokenParams.consentUrl);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async accountRequest_vrp(url: string): Promise<string> {
    try {
      const body = this.permissions;
      const id = uuid.v4();
      const headers = {
        ...config.vrpHeaders,
        Authorization: 'Bearer ' + this.accessToken,
        'x-idempotency-key': `${id}`,
      };
      const response: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${url}`,
        body,
        {
          headers: headers,
        },
      );

      const Status = response.data.Data?.Status;
      const Payload = response.data.Data;
      this.consentId = response.data.Data?.ConsentId || '';
      newVRPConsent.bankname="Natwest";
      newVRPConsent.consentid=this.consentId,
      newVRPConsent.status= Status,
      newVRPConsent.consentpayload= JSON.stringify(Payload),
      newVRPConsent.scope= 'vrp';

      const details1 = {
        bankname: 'Natwest',
        consentid: this.consentId,
        status: Status,
        consentpayload: JSON.stringify(Payload),
        scope: 'vrp',
        account_details: JSON.stringify(Payload),
      };
      const details2 ={
        bankname: 'Natwest',
        consentid : this.consentId,
        status: Status,
        scope: 'vrp'
      };
      console.log('details', details1);

      // addDetails(details1);
      console.log('response of consent', this.consentId);
      
      return response.data.Data?.ConsentId || '';
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }
  async getDomesticConsent_vrp(accessToken: any, url: string) {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'x-fapi-financial-id': '0015800000jfwxXAAQ',
      };
      const allVrpResponse = await axios.get(url, {
        headers: headers,
      });
      console.log(
        'allVrpResponse of  call',
        allVrpResponse.data,
      );
      const payload = allVrpResponse.data.Data;
      const id = allVrpResponse.data.Data.ConsentId;

      const updateDetails4 = {
        account_details: JSON.stringify(payload),

      };
      const columnsToUpdate5 = ['account_details'];

      // await updateDetailsForVrp(updateDetails4, id, columnsToUpdate5);
      return allVrpResponse.data;
    } catch (error) {
      console.log('error in getting in vrp calls', error);
    }
  }
  async manualUserConsent_vrp(scope: string): Promise<string> {
    // console.log('manual consent');
    let consentUrlWithVariables = `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=${scope}&redirect_uri=${sandboxConfig.redirectUri}&request=${this.consentId}`;
    Linking.openURL(consentUrlWithVariables);
    return consentUrlWithVariables;
  }


  async exchangeAccessToken_vrp(authTokenUrl: string, formData: any, consentData: any) {
    try {
      const start = authTokenUrl.indexOf('=') + 1;
      const end = authTokenUrl.indexOf('&');
      const authToken = authTokenUrl.slice(start, end);

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
      const consentExpiresIn = response.data.expires_in;


      const updatedDetails2 = {
        refreshedtoken: RefreshToken,
        status: 'Authorised',
        consentexpiry: consentExpiresIn,
      };

      const columnsToUpdate2 = ['refreshedtoken', 'status', 'consentexpiry'];
      // await updateDetailsForVrp(
      //   updatedDetails2,
      //   this.consentId,
      //   columnsToUpdate2,

      // );
      newVRPConsent.refreshtoken= RefreshToken
      // await this.handleStore()
      refreshTokenExists = true;
      // this.getDomesticConsent(response.data.access_token, consentData.Links.Self);
      return response.data;

    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async refreshToken_vrp(refreshToken: any, grantedformData: any): Promise<any> {
    try {
        console.log('grantedformData', grantedformData)
        console.log('refreshToken', refreshToken)
      const body: Record<string, string> = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken.refreshtoken,
      };
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

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
      const updatedDetails3 = {
        refreshedtoken: RefreshToken,
      };

      // const columnsToUpdate3 = ['refreshedtoken'];
      // await updateDetailsForVrp(
      //   updatedDetails3,
      //   refreshToken.consentid,
      //   columnsToUpdate3,
      // );

      return this.vrpPayments_vrp(
        responseRefresh.data.access_token,
        refreshToken.consentid,
        grantedformData,
      );
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async vrpPayments_vrp(
    apiAccessToken: string,
    consentid: string,
    formData: any,
  ): Promise<any> {
    try {
      const id = uuid.v4();
      const headers = {
        ...config.vrpHeaders,
        Authorization: `Bearer ${apiAccessToken}`,
        'x-idempotency-key': `${id}`,
      };
      const Identification = formData.accountNumber + formData.sortCode;
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
        console.log(body)
        console.log(headers)
      const vrpPaymentResponse: AxiosResponse<any> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.domesticVrpPayments}`,
        body,
        {
          headers: headers,
        },
      );
      console.log("inside VRPPP",vrpPaymentResponse)
      this.apiAccess = apiAccessToken;
      return this.getAllVrpPayments(vrpPaymentResponse.data.Links.Self);
    } catch (error) {
      throw new Error(`Failed to fetch data for vrp payments: ${error}`);
    }
  }

  async getAllVrpPayments(url: string): Promise<any> {
    try {
      const headers = {
        Authorization: `Bearer ${this.apiAccess}`,
        'x-fapi-financial-id': '0015800000jfwxXAAQ',
      };
      const allVrpPaymentsResponse = await axios.get(url, {
        headers: headers,
      });
      
      console.log(
        'allVrpPaymentsResponse of final call',
        allVrpPaymentsResponse.data,
      );
      const payload = allVrpPaymentsResponse.data.Data;
      const id = allVrpPaymentsResponse.data.Data.ConsentId;
      const details = {
        bankname: 'Natwest',
        consentid: id,
        scope: 'vrp_transactions',
        vrpid: allVrpPaymentsResponse.data.Data.DomesticVRPId,
        vrppayload: JSON.stringify(payload),
        status: allVrpPaymentsResponse.data.Data.Status
      };
      // addTransactions(details);
      newVRPConsent.vrppayload=JSON.stringify(payload);
      await this.handleStore()
      const vrpTransactions=await AsyncStorage.getItem('vrpTransactions_sandbox');
      // let transactions;
      let alltransactions = vrpTransactions ? JSON.parse(vrpTransactions) : [];
      alltransactions.push(details);
      // if(vrpTransactions!=null ){
      //   transactions=JSON.parse(vrpTransactions)
      //   transactions.push(details);
      // }
      await AsyncStorage.setItem('vrpTransactions_sandbox',JSON.stringify(alltransactions))
      console.log(AsyncStorage.getItem('vrpTransactions_sandbox'));
      return allVrpPaymentsResponse.data;
    } catch (error) {
      console.log('error in getting in vrp payments', error);
    }
  }
handleStore = async () =>{
  try {
    const storedVRPData = await AsyncStorage.getItem("VRP_Data");
    let allVRPData = storedVRPData ? JSON.parse(storedVRPData) : [];
    allVRPData.push(newVRPConsent);
    await AsyncStorage.setItem("VRP_Data", JSON.stringify(allVRPData));
    console.log("VRP data stored Successfully");
  } catch (error){
    console.log("Error storing VRP data:", error);
  }
};


}

export default SanboxApiClient;
