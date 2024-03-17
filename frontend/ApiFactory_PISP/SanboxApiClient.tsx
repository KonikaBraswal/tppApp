import axios, {AxiosResponse} from 'axios';
import config from '../configs_PISP/config.json';
import sandboxConfig from '../configs_PISP/Sandbox.json';
import {Linking, Alert} from 'react-native';
//import { v4 as uuidv4 } from 'uuid';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface BodyData {
  Data: {
    Permissions: string[];
  };
  Risk: {}; // Adjust this if Risk has a specific structure
}
let toStore = {
  consentId: '',
  userId: '12345',
};
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
var consentID = '';
interface PaymentRisk {
  PaymentContextCode: string;
  MerchantCategoryCode: any; // Adjust the type as needed
  MerchantCustomerIdentification: any; // Adjust the type as needed
  DeliveryAddress: any; // Adjust the type as needed
}

interface PaymentBodyData {
  Data: {
    Initiation: InitiationData;
  };
  Risk: PaymentRisk;
}

// const userIdToUpdate = 1001;

class SanboxApiClient {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private commonHeaders: any; // Replace 'any' with the actual type of commonHeaders
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
      console.log('successss**');
      console.log(response.data);
      const consentId = response.data.Data?.ConsentId ?? ''; // Using nullish coalescing operator
      toStore.consentId = consentId; // Storing consent ID in toStore object

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
      return this.domesticPayments(response.data.access_token);
      // console.log('Api refresh token', response.data.refresh_token);
      // if (this.callScope == 'payments') {
      //   return this.domesticPayments(response.data.access_token);
      // }
      // return this.fetchAccounts(response.data.access_token);
      return this.refreshToken(response.data.refresh_token);
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

      // return this.fetchAccounts(responseRefresh.data.access_token);
      return responseRefresh.data.access_token;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async domesticPayments(apiAccess: string): Promise<any> {
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

  //make function here to store toStore variable in async storage

  async storeToStoreInAsyncStorage() {
    try {
      // Convert the toStore object to a JSON string
      const toStoreJSON = JSON.stringify(toStore);
      
      // Store the JSON string in AsyncStorage under a specific key
      await AsyncStorage.setItem('toStoreKey', toStoreJSON);
      
      console.log('toStore has been stored in AsyncStorage.');
    } catch (error) {
      console.error('Failed to store toStore in AsyncStorage:', error);
    }
  }

  //call to store
  //await this.storeToStoreInAsyncStorage();



  //call to print
  //await this.printStoredToStore(); calling the function


  async printStoredToStore() {
    try {
      // Retrieve the stored JSON string from AsyncStorage
      const storedToStoreJSON = await AsyncStorage.getItem('toStoreKey');

      if (storedToStoreJSON) {
        // Parse the JSON string back to an object
        const storedToStore = JSON.parse(storedToStoreJSON);

        // Print the stored toStore object
        console.log('Stored toStore:', storedToStore);
      } else {
        console.log('No toStore object found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Failed to retrieve stored toStore from AsyncStorage:', error);
    }
  }
}

export default SanboxApiClient;
