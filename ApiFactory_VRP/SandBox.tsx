import axios, { AxiosResponse } from 'axios';
import config from '../configs_VRP/config.json';
import sandboxConfig from '../configs_VRP/Sandbox.json';
import { Linking, Alert } from 'react-native';
import 'setimmediate';
import 'react-native-get-random-values';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { addDetails, addTransactions, updateDetailsForVrp, } from '../database/Database';
// interface BodyData {
//   Data: {
//     Permissions: string;
//   };
//   Risk: {}; // Adjust this if Risk has a specific structure
// }
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
  body: string; // Adjust the type according to your actual body structure
  consentUrl: string;
}
interface VRPData{
  [key:string]:any
}
let newVRPConsent:VRPData={};
class SandBox {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private commonHeaders: any; // Replace 'any' with the actual type of commonHeaders
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
    console.log("hiii insidee refreshhh");
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
      return this.accountRequest(params.accessTokenParams.consentUrl);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async accountRequest(url: string): Promise<string> {
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
  async getDomesticConsent(accessToken: any, url: string) {
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
  async manualUserConsent(scope: string): Promise<string> {
    console.log('manual consent');
    let consentUrlWithVariables = `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=${scope}&redirect_uri=${sandboxConfig.redirectUri}&request=${this.consentId}`;
    Linking.openURL(consentUrlWithVariables);
    return consentUrlWithVariables;
  }


  async exchangeAccessToken(authTokenUrl: string, formData: any, consentData: any) {
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
      await this.handleStore()
      refreshTokenExists = true;
      this.getDomesticConsent(response.data.access_token, consentData.Links.Self);
      return response.data;

    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async refreshToken(refreshToken: any, grantedformData: any): Promise<any> {
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

      // const columnsToUpdate3 = ['refreshedtoken'];
      // await updateDetailsForVrp(
      //   updatedDetails3,
      //   refreshToken.consentid,
      //   columnsToUpdate3,
      // );

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
      return allVrpPaymentsResponse.data;
    } catch (error) {
      console.log('error in getting in vrp payments', error);
    }
  }
handleStore= async () =>{
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

export default SandBox;
