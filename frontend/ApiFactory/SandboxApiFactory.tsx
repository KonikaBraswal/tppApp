import axios, {AxiosResponse} from 'axios';
import {Linking, Alert} from 'react-native';
import * as Keychain from 'react-native-keychain';
import config from './ConfigFiles/config.json';
import sandboxConfig from './ConfigFiles/Nwb_Sandbox_AISP.json';
import {addDetails, addTransactions, updateDetailsForVrp} from '../database/Database';
import {updateDetails, fetchRefreshedToken} from '../database/Database';
import sandboxConfigvrp from './ConfigFiles/Nwb_Sandbox_VRP.json';
import AndroidClient from '../DatabaseFactory/AndroidClientDb';
import sandboxConfigPisp from './ConfigFiles/Nwb_Sandbox_PISP.json';
import uuid from 'react-native-uuid';
const {generateVrpAccountRequestHeaders,
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
  generatePaymentStatusHeaders, } = require('./ConfigFiles/apiUtils.tsx');

const companyName = "NWG"; // Replace "YourCompanyName" with the actual company name
const apiClient = "Sandbox"; // Replace "YourApiClient" with the actual API client
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
let pispToStore = {
  consentId: '',
  scope: '',
  payload: '',
  refreshtoken: '',
  paymentId: '',
  response: '',
  userId: '999999999',
};
let pispToUpdate={
  userId:"7777777",
}
let androidClientAisp: AndroidClient;
let androidClientPisp:AndroidClient;
let aispToStore = {
  userId: '999934356',
  scope: '',
  bankName: 'NatWest',
  consentId: '',
  consentPayload: '',
  refreshToken: '',
  accountsList: ''
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
  private consentIdVrp:string ='';
  constructor(apiscope:string) {
    this.scopeForThisCall=apiscope;
    this.baseUrl = config.baseUrl;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.commonHeaders = config.contentType;
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
  async callApiFactory(
    apiScope: string,
    permission: string[],
    DebtorAccount: any,
  ) {
    
    this.permissions = permission;
    this.scopeForThisCall = apiScope;
    this.DebtorAccount = DebtorAccount;
    switch (apiScope) {
      case 'accounts':
        androidClientAisp = new AndroidClient(companyName, apiClient, apiScope);
        console.log('******NWB SANDBOX ACCOUNTS CALL********');
        this.scopeForThisCall = "accounts";
        let returnthisAisp = this.retrieveAccessToken();
        return returnthisAisp;
      case 'payments':
        androidClientPisp = new AndroidClient(companyName, apiClient, apiScope);
        console.log('******NWB SANDBOX PAYMENTS CALL********');
        this.scopeForThisCall = 'payments';
        let returnthisPisp = this.retrieveAccessToken();
        return returnthisPisp;
        //break;
      case 'vrp':
        console.log('******NWB VRP CALL********');
        this.scopeForThisCall = 'vrp';
        let returnthisVrp = this.retrieveAccessToken();
        return returnthisVrp;
        //break;
      default:
        console.log(
          'Wrong Scope: Sandbox has only three scopes, accounts, payments and vrp',
        );
    }
  }
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
        aispToStore.scope=response.data.scope;
        return this.accountRequest(response.data.access_token);
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
      }
    }
    if (this.scopeForThisCall == 'payments') {
      try {
        // const body = {
        //   grant_type: sandboxConfig.grant_type,
        //   client_id: this.clientId,
        //   client_secret: this.clientSecret,
        //   scope: 'payments',
        // };
        // const header = {
        //   'Content-Type': 'application/x-www-form-urlencoded', // Corrected content type
        // };
        const body = generateAccessTokenBody(
          sandboxConfig.grant_type,
          this.clientId,
          this.clientSecret,
          this.scopeForThisCall
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
        return this.accountRequest(response.data.access_token);
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
      }
    }
    if (this.scopeForThisCall == 'vrp') {
      try {
        // const body = {
        //   grant_type: sandboxConfig.grant_type,
        //   client_id: this.clientId,
        //   client_secret: this.clientSecret,
        //   scope: 'payments',
        // };
        const body = generateAccessTokenBody(
          sandboxConfig.grant_type,
          this.clientId,
          this.clientSecret,
          'payments',
        );
        // const header = {
        //   'Content-Type': 'application/x-www-form-urlencoded', // Corrected content type
        // };
        const header = generateHeaders(sandboxConfig.tokenEndpoint);

        const response: AxiosResponse<ResponseData> = await axios.post(
          `${this.baseUrl}/${sandboxConfigvrp.tokenEndpoint}`,
          null,
          {
            headers: header,
            params: body,
          },
        );
        console.log()
        return this.accountRequest(response.data.access_token);
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
      }
    }
  }

  async accountRequest(accessToken: string) {
    if (this.scopeForThisCall == 'accounts') {
     
      try {
        // const body: BodyData = {
        //   Data: {
        //     Permissions: this.permissions,
        //   },
        //   Risk: {},
        // };
        // const headers = {
        //   ...this.commonHeaders,
        //   Authorization: 'Bearer ' + accessToken,
        // };
        const body = this.generateBody(sandboxConfig.accountRequestEndpoint, {});

        const headers = this.generateHeaders(sandboxConfig.accountsEndpoint,accessToken);

        const response: AxiosResponse<ResponseData> = await axios.post(
          `${this.baseUrl}/${sandboxConfig.accountRequestEndpoint}`,
          body,
          {
            headers: headers,
          },
        );
        aispToStore.consentId=response.data.Data?.ConsentId||'';
      aispToStore.consentPayload=JSON.stringify(body);
        return this.manualUserConsent(response.data.Data?.ConsentId || '');
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
      }
    }
    if (this.scopeForThisCall == 'payments') {
      try {
        var accountRequestEndpoint =
          sandboxConfigPisp.accountRequestEndpointPisp;
        const id = uuid.v4();
       const body = generateBodyForPaymentRequest(this.DebtorAccount, true, '');
       const headers = generateHeadersForPisp(accessToken, id, sandboxConfig.financialId, sandboxConfig.signatureJws);
        const response: AxiosResponse<ResponseData> = await axios.post(
          `${this.baseUrl}/${accountRequestEndpoint}`,
          body,
          {
            headers: headers,
          },
        );
        console.log('GGGG');
        console.log(response.data);
        const consentId = response.data.Data?.ConsentId ?? ''; // Using nullish coalescing operator
        pispToStore.consentId = consentId; // Storing consent ID in toStore object
        pispToStore.payload = JSON.stringify(body);
  
        return response.data.Data?.ConsentId || '';
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
      }
    }
    if (this.scopeForThisCall == 'vrp') {
      console.log("VRP acc")
      try {
        const body = this.permissions;
        const id = uuid.v4();
        // const headers = {
        //   ...configvrp.vrpHeaders,
        //   Authorization: 'Bearer ' + accessToken,
        //   'x-idempotency-key': `${id}`,
        // };
        const headers = generateAccountRequestHeaders(accessToken);

        console.log(body);
        const response: AxiosResponse<ResponseData> = await axios.post(
          `${this.baseUrl}/${sandboxConfigvrp.paymentRequestEndPoint}`,
          body,
          {
            headers: headers,
          },
        );
        const Status = response.data.Data?.Status;
        const Payload = response.data.Data;
        this.consentIdVrp = response.data.Data?.ConsentId || '';
        
        //const consentIdVrp = response.data.Data?.ConsentId || '';
        const details1 = {
          bankname: 'Natwest',
          consentid: this.consentIdVrp,
          status: Status,
          consentpayload: JSON.stringify(Payload),
          scope: 'vrp',
        };
        // vrpToStore.scope="vrp";
        // vrpToStore.consentId=consentIdVrp;
        // vrpToStore.consentPayload=JSON.stringify(Payload);
        // vrpToStore.status=Status;
        
        console.log('details', details1);
        // addDetails(details1);
        console.log('hhh');
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
      }
    }

  }

  async manualUserConsent(consentId: string) {
    let consentUrlWithVariables = '';
    console.log("iiir")

    console.log('manual consent');
    if (this.scopeForThisCall == 'accounts') {
      consentUrlWithVariables = `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid accounts&redirect_uri=${sandboxConfig.redirectUri}&request=${consentId}`;
    }
    if (this.scopeForThisCall == 'payments') {
      consentID = consentId;
      consentUrlWithVariables = `${sandboxConfigPisp.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid payments&redirect_uri=${sandboxConfigPisp.redirectUri}&request=${consentId}`;
    }
    if(this.scopeForThisCall=='vrp'){
      consentUrlWithVariables = `${sandboxConfigvrp.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid payments&redirect_uri=${sandboxConfig.redirectUri}&request=${consentID}`;
    }
    Linking.openURL(consentUrlWithVariables);
    return consentUrlWithVariables;
  }
  async userConsentProgammatically(consentId: string) {
    if (this.scopeForThisCall == 'accounts') {
      try {
        console.log('ConsentID:', consentId);
        const accountResponse: AxiosResponse<any> = await axios.get(
          `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=openid accounts&redirect_uri=${sandboxConfig.redirectUri}&state=ABC&request=${consentId}&authorization_mode=AUTO_POSTMAN&authorization_username=${sandboxConfig.psu}`,
        );
        return this.exchangeAccessToken(accountResponse.data.redirectUri,null);
      } catch (error) {
        throw new Error(`Failed to fetch data for accounts: ${error}`);
      }
    }
    if (this.scopeForThisCall == 'payments') {
    }
    if (this.scopeForThisCall == 'vrp') {
    }
  }

  async exchangeAccessToken(authTokenUrl: string,consentData:any) {
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
        aispToStore.refreshToken = response.data.refresh_token;
        return this.fetchAccounts(response.data.access_token);
        //console.log('Api access token', response.data.access_token);
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
      }
    }
    if (this.scopeForThisCall == 'payments') {
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
        console.log('Api access token', response.data.access_token);
        pispToStore.refreshtoken = response.data.refresh_token;
        return this.domesticPayments(response.data.access_token);

        //return this.refreshToken(response.data.refresh_token);
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
      }
    }
    if (this.scopeForThisCall == 'vrp') {
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
        const headers = generateHeaders(sandboxConfig.tokenEndpoint);
        const response: AxiosResponse<ResponseData> = await axios.post(
          `${this.baseUrl}/${sandboxConfigvrp.tokenEndpoint}`,
          null,
          {
            headers: headers,
            params: body,
          },
        );
  
        console.log('Api access token', response.data.access_token);
  
        // const updatedDetails2 = {
        //   refreshedtoken: RefreshToken,
        //   status: 'Authorised',
        //   consentexpiry: consentExpiresIn,
        // };
      //   const columnsToUpdate2 = ['refreshedtoken', 'status', 'consentexpiry'];
      // await updateDetailsForVrp(
      //   updatedDetails2,
      //   consentData.Data.ConsentId,
      //   columnsToUpdate2,
      // );
      
      this.getDomesticConsent(
        response.data.access_token,
        consentData.Links.Self,
      );
      // return response.data;
      return this.getDetailsCA(response.data.access_token);
        console.log("response",response.data);
        return response.data;
        //return this.vrpPayments(response.data.access_token,this.consentIdVrp,formData);
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
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
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch token: ${error}`);
    }
  }

  async vrpPayments(apiAccessToken: string,consentid: string,formData: any,): Promise<any> {
    try {
  
      const headers = generateAccountRequestHeaders(apiAccessToken);

      const body = generateVrpPaymentBody(formData, consentid);
      console.log("(99");
      console.log(headers);
      console.log(body);

          const vrpPaymentResponse: AxiosResponse = await axios.post(
        `${this.baseUrl}/${sandboxConfigvrp.domesticVrpPayments}`,
        body,
        {
          headers: headers,
        },
      );
      this.apiAccess = apiAccessToken;
      console.log('payments-->', vrpPaymentResponse.data.Links.Self);
      return this.getAllVrpPayments(vrpPaymentResponse.data.Links.Self);
    } catch (error) {
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
      const payload=allVrpPaymentsResponse.data.Data;
      
      const details = {
        bankname: 'Natwest',
        consentid: allVrpPaymentsResponse.data.Data.ConsentId,
        scope: 'vrp_transactions',
        vrpid: allVrpPaymentsResponse.data.Data.DomesticVRPId,
        vrppayload: JSON.stringify(payload),
        status: allVrpPaymentsResponse.data.Data.Status
      };
      // vrpToStore.vrpId=allVrpPaymentsResponse.data.Data.DomesticVRPId;
      // vrpToStore.vrpPayload=JSON.stringify(payload);
      // vrpToStore.status=allVrpPaymentsResponse.data.Data.Status;
      // vrpToStore.responseVrp=JSON.stringify(allVrpPaymentsResponse.data.Data);
      // console.log("^^^^^^^");
      // console.log(vrpToStore);
      console.log("$$$$$$$$$$");
      addTransactions(details);

      return allVrpPaymentsResponse.data;
    } catch (error) {
      console.log('error in getting in vrp payments', error);
    }
  }

  async refreshToken(refreshToken: string): Promise<any> {
    console.log("heeeeeeeyyyyyyyyyyyyyyyyyyyyyyyyy");
    if (this.scopeForThisCall === 'accounts') {
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
        return responseRefresh.data.access_token;
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
      }
    }
    if (this.scopeForThisCall == 'payments') {
    }

    if (this.scopeForThisCall == 'vrp') {
      
    }
  }
  async refreshTokenForVRP(refreshToken: any, grantedformData: any): Promise<any> {
    try {
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

      const columnsToUpdate3 = ['refreshedtoken'];
      // await updateDetailsForVrp(
      //   updatedDetails3,
      //   refreshToken.consentid,
      //   columnsToUpdate3,
      // );
      console.log("000000000");
      return this.vrpPayments(
        responseRefresh.data.access_token,
        refreshToken.consentid,
        grantedformData,
      );
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async domesticPayments(apiAccess: string) {
    try {
      const idd = uuid.v4();
      console.log('m here');
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
        `${this.baseUrl}/${sandboxConfigPisp.domesticPaymentsEndpoint}`,
        requestBody,
        {
          headers: headers,
        },
      );
      console.log('success 777');
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
      await androidClientPisp.initDatabaseAndroidPisp();
      await androidClientPisp.insertDataPisp(pispToStore);
      console.log("Storing this to the table");
      await androidClientPisp.displayData();
      return payResponse.data.Data;
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }
  async fetchAccounts(apiAccessToken: string) {
    try {
      // const headers = {
      //   ...this.commonHeaders,
      //   Authorization: `Bearer ${apiAccessToken}`,
      // };
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

      // await updateDetails(updatedDetails3, 1001, columnsToUpdate3);
      //store
      this.apiAccess = apiAccessToken;
      await this.storeAccessToken(apiAccessToken);
      aispToStore.accountsList=JSON.stringify(accountResponse.data.Data);
      //print aispToSTore
      console.log("***************");
      console.log(aispToStore);
      await androidClientAisp.initDatabaseAndroidAisp();//create the table
      await androidClientAisp.insertDataAisp(aispToStore);
      console.log("^^^^^^^^^^^^");
      await androidClientAisp.displayData();
      console.log("###########");
      //await androidClientAispDb.initDatabaseAndroidAisp();

      //await androidClientAispDb.displayData();
      console.log('ACCOUNT ADDED SUCCESSFULLY');
      return accountResponse.data.Data;
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }
  async allCalls(endPoint: string): Promise<any> {
    console.log(this.scopeForThisCall);
    console.log("I AM IN ALL CALLSsssssssssssssss",this.scopeForThisCall);
    if (this.scopeForThisCall == 'accounts') {
      console.log("m fine")
      const access_token = await this.getAccessToken();

      console.log("HHHHHHHHHH")
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
        console.log("HHH66666HHHHHH")
        const headers = this.generateHeaders(sandboxConfig.accountsEndpoint,this.apiAccess);

        const accountResponse: AxiosResponse<any> = await axios.get(
          `${this.baseUrl}/${sandboxConfig.accountsEndpoint}/${endPoint}`,
          {
            headers: headers,
          },
        );
        console.log("77777777777",accountResponse.data.Data)
        return accountResponse.data.Data;
      } catch (error) {
        throw new Error(`Failed to fetch data for accounts: ${error}`);
      }
    }
    else if (this.scopeForThisCall == 'payments') {
      return "7777"
    }
    else if (this.scopeForThisCall == 'vrp') {
      return "999"
    }
    else{
      return "74584";
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
    if (this.scopeForThisCall == 'payments') {
    }
    if (this.scopeForThisCall == 'vrp') {
    }
  }
}

export default SanboxApiFactory;
