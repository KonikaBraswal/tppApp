import axios, {AxiosResponse} from 'axios';
import config from '../configs_PISP/config.json';
import sandboxConfig from '../configs_PISP/Sandbox.json';
import {Linking, Alert} from 'react-native';
import {addDetails} from '../database/Database';
import {updateDetails} from '../database/Database';
import uuid from 'react-native-uuid';
const { generateHeaders, generateBody, generateBodyForExchange, generateAccessTokenBody,generateBodyForRefresh,generateBodyForPaymentRequest,generateHeadersForPisp,generateDomesticPaymentRequestBody,generatePaymentStatusHeaders } = require('../ConfigFiles/apiUtils.tsx');
interface BodyData {
  Data: {
    Permissions: string[];
  };
  Risk: {}; 
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
interface InitiationData {
  InstructionIdentification: string;
  EndToEndIdentification: string;
  InstructedAmount: {
    Amount: string;
    Currency: string;
  };
  DebtorAccount: any; 
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
var consentID = '';
interface PaymentRisk {
  PaymentContextCode: string;
  MerchantCategoryCode: any; 
  MerchantCustomerIdentification: any; 
  DeliveryAddress: any; 
}

interface PaymentBodyData {
  Data: {
    Initiation: InitiationData;
  };
  Risk: PaymentRisk;
}

// const userIdToUpdate = 1001;
interface CommonHeaders {
  [key: string]: string;
}
class SanboxApiClient {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private commonHeaders: any; 
  private permissions: string[] = [];
  private apiAccess: string = '';
  private callScope: string = '';
  private DebtorAccount: any;
  constructor(
    baseUrl: string,
    clientId: string,
    clientSecret: string,
    commonHeaderss: any,
  ) {
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.commonHeaders = commonHeaderss;
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
  async retrieveAccessToken(
    callScope: string,
    DebtorAccount: any,
  ): Promise<string> {
    let body: Record<string, string> = {};
    let header: Record<string, string> = {};
    this.DebtorAccount = DebtorAccount;
    if (callScope == 'payments') {
      this.callScope = callScope;
      console.log('Payments Call');
      body = generateAccessTokenBody(
        sandboxConfig.grant_type,
        this.clientId,
        this.clientSecret,
        callScope
      );
      header = generateHeaders(sandboxConfig.tokenEndpoint);
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

      addDetails(details1);
      // store
      console.log('Access token', response.data);
      return this.accountRequest(response.data.access_token);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async accountRequest(accessToken: string): Promise<string> {
    var accountRequestEndpoint = '';
    const id = uuid.v4();
    console.log('id', id);
    var body: BodyData | PaymentBodyData | undefined;
    var headers: {[key: string]: string} = {};
    try {
      if (this.callScope == 'accounts') {
        accountRequestEndpoint = sandboxConfig.accountRequestEndpointAisp;
        body = generateBody(sandboxConfig.accountRequestEndpointAisp, {});
      }
      headers = generateHeaders(sandboxConfig.accountsEndpoint,accessToken);
      if (this.callScope == 'payments') {
        accountRequestEndpoint = sandboxConfig.accountRequestEndpointPisp;
        body = generateBodyForPaymentRequest(this.DebtorAccount, true, '');
        headers = generateHeadersForPisp(accessToken, id, sandboxConfig.financialId, sandboxConfig.signatureJws);

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

      await updateDetails(updatedDetails1, 1002, columnsToUpdate1);
      //store
      console.log('successss**');
      console.log(response.data);
      return response.data.Data?.ConsentId || '';
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async manualUserConsent(consentId: string): Promise<string> {
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
const headers = generateHeaders(sandboxConfig.tokenEndpoint);
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
      return this.domesticPayments(response.data.access_token);
      return this.refreshToken(response.data.refresh_token);
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
      const headers = generateHeaders(sandboxConfig.tokenEndpoint);
      const responseRefresh: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
        null,
        {
          headers: headers,
          params: body,
        },
      );
      console.log('Refresh call response', responseRefresh.data);
      return responseRefresh.data.access_token;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async domesticPayments(apiAccess: string): Promise<any> {
    try {
      const idd = uuid.v4();
      console.log('idddd', idd);
      const headers = generateHeadersForPisp(apiAccess, idd, sandboxConfig.financialId, sandboxConfig.signatureJws);
      const requestBody = generateDomesticPaymentRequestBody(
        consentID,
        this.DebtorAccount,
        {
          SchemeName: 'IBAN',
          Identification: 'BE56456394728288',
          Name: 'ACME DIY',
          SecondaryIdentification: 'secondary-identif',
        },
        'EcommerceGoods'
      );
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
      return this.getPaymentSatus(
        apiAccess,
        paymentResponse.data.Data.DomesticPaymentId,
      );
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }
  async getPaymentSatus(
    apiAccessToken: string,
    domesticPaymentsId: string,
  ): Promise<any> {
    try {
      const headers = generatePaymentStatusHeaders(apiAccessToken);
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
}

export default SanboxApiClient;
