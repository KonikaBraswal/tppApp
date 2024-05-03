import axios, { AxiosResponse } from 'axios';
import config from '../configs_VRP/configvrp.json';
import sandboxConfig from '../configs_VRP/Sandbox.json';
import { Linking, Alert } from 'react-native';
import 'react-native-get-random-values';
import uuid from 'react-native-uuid';
import { addDetails, addTransactions, updateDetailsForVrp, } from '../database/Database';
const {generateAccountRequestHeaders,generateVrpAccountRequestHeaders, generateVrpPaymentBody,generateDomesticConsentHeaders,generateHeaders, generateBody, generateBodyForExchange, generateBodyForRefresh,generateAccessTokenBody,generateAccessTokenHeaders } = require('../ConfigFiles/apiUtils.tsx');

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
interface ApiHeaders {
  Authorization: string;
  'Content-Type': string;
  'x-jws-signature': string;
  'x-idempotency-key': string;
  'x-fapi-financial-id': string;
}
interface AccessTokenRequestParams {
  accessTokenParams: any;
  scope: string;
  headers: Record<string, string>;
  body: string; 
  consentUrl: string;
}

class SandBox {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private commonHeaders: any; 
  private permissions!: string;
  private apiAccess: string = '';
  private consentId: string = '';
  private accessToken: string = '';
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
  isupdateTransaction = false;
  async retrieveAccessToken(params: AccessTokenRequestParams): Promise<string> {
    this.permissions = params.accessTokenParams.body;
    try {
      const body = generateAccessTokenBody(
        sandboxConfig.grant_type,
        this.clientId,
        this.clientSecret,
        params.accessTokenParams.scope
      );
      const response: AxiosResponse<ResponseData> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
        body,
        {
          headers: params.accessTokenParams.headers,
        },
      );

      this.accessToken = response.data.access_token;
      return this.accountRequest(params.accessTokenParams.consentUrl);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async accountRequest(url: string): Promise<any> {
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
      const details1 = {
        bankname: 'Natwest',
        consentid: this.consentId,
        status: Status,
        consentpayload: JSON.stringify(Payload),
        scope: 'vrp',
        account_details: JSON.stringify(Payload),
      };

      addDetails(details1);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }
  async getDomesticConsent(accessToken: any, url: string) {
    try {
      const headers = generateDomesticConsentHeaders(accessToken, '0015800000jfwxXAAQ');

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

      await updateDetailsForVrp(updateDetails4, id, columnsToUpdate5);
      return allVrpResponse.data;
    } catch (error) {
      console.log('error in getting in vrp calls', error);
    }
  }
  async manualUserConsent(scope: string): Promise<string> {
    // console.log('manual consent');
    let consentUrlWithVariables = `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=${scope}&redirect_uri=${sandboxConfig.redirectUri}&request=${this.consentId}`;
    Linking.openURL(consentUrlWithVariables);
    return consentUrlWithVariables;
  }


  async exchangeAccessToken(authTokenUrl: string, formData: any, consentData: any) {
    try {
      const start = authTokenUrl.indexOf('=') + 1;
      const end = authTokenUrl.indexOf('&');
      const authToken = authTokenUrl.slice(start, end);
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

      const RefreshToken = response.data.refresh_token;
      const consentExpiresIn = response.data.expires_in;


      const updatedDetails2 = {
        refreshedtoken: RefreshToken,
        status: 'Authorised',
        consentexpiry: consentExpiresIn,
      };

      const columnsToUpdate2 = ['refreshedtoken', 'status', 'consentexpiry'];
      await updateDetailsForVrp(
        updatedDetails2,
        this.consentId,
        columnsToUpdate2,

      );
      refreshTokenExists = true;
      this.getDomesticConsent(response.data.access_token, consentData.Links.Self);
      return response.data;

    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async refreshToken(refreshToken: any, grantedformData: any): Promise<any> {
    try {

      const body = generateBodyForRefresh(
        this.clientId,
        this.clientSecret,
        'refresh_token',
        refreshToken.refreshtoken
      );
      // };
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
      const RefreshToken = responseRefresh.data.refresh_token;
      const updatedDetails3 = {
        refreshedtoken: RefreshToken,
      };

      const columnsToUpdate3 = ['refreshedtoken'];
      await updateDetailsForVrp(
        updatedDetails3,
        refreshToken.consentid,
        columnsToUpdate3,
      );

      return this.vrpPayments(
        responseRefresh.data.access_token,
        refreshToken.consentid,
        grantedformData,
      );
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async vrpPayments(
    apiAccessToken: string,
    consentid: string,
    formData: any,
  ): Promise<any> {
    try {
      const id = uuid.v4();
   
      const headers = generateAccountRequestHeaders(apiAccessToken);

      const body = generateVrpPaymentBody(formData,consentid);

      const vrpPaymentResponse: AxiosResponse<any> = await axios.post(
        `${this.baseUrl}/${sandboxConfig.domesticVrpPayments}`,
        body,
        {
          headers: headers,
        },
      );
      this.apiAccess = apiAccessToken;
      return this.getAllVrpPayments(vrpPaymentResponse.data.Links.Self);
    } catch (error) {
      throw new Error(`Failed to fetch data for vrp payments: ${error}`);
    }
  }

  async getAllVrpPayments(url: string): Promise<any> {
    try {
      const headers = generateVrpAccountRequestHeaders(this.apiAccess,'0015800000jfwxXAAQ');

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
      addTransactions(details);
      return allVrpPaymentsResponse.data;
    } catch (error) {
      console.log('error in getting in vrp payments', error);
    }
  }


}

export default SandBox;
