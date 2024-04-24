import axios, {AxiosResponse} from 'axios';
import {Linking, Alert} from 'react-native';
import * as Keychain from 'react-native-keychain';
import config from '../configs_AISP/config.json';
import sandboxConfig from '../configs_AISP/Sandbox.json';
import {addDetails} from '../database/Database';
import accountResponse from '../src/assets/data/accounts.json';
import {updateDetails, fetchRefreshedToken} from '../database/Database';

interface BodyData {
  Data: {
    Permissions: string[];
  };
  Risk: {}; // Adjust this if Risk has a specific structure
}

//DB
var refreshTokenExists = false;

// interface ResponseData {
//   access_token: string;
//   Data?: {
//     ConsentId?: string;
//   };
// }
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

interface UserCredentials {
  username: string;
  password: string;
}

class MockApiClient {
  
  async retrieveAccessToken(permission: string[]): Promise<string> {
    
    try {
      return "nothing";
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async manualUserConsent(consentId: string): Promise<string> {
    return 'nothing';
  }
  async userConsentProgammatically(consentId: string): Promise<string> {
    return 'nothing';
  }

  async exchangeAccessToken(authTokenUrl: string): Promise<string> {
    try {
      // const start = authTokenUrl.indexOf('=') + 1;
      // const end = authTokenUrl.indexOf('&');
      // const authToken = authTokenUrl.slice(start, end);
      // console.log('AuthToken', authToken);
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

      // const response: AxiosResponse<ResponseData> = await axios.post(
      //   `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
      //   null,
      //   {
      //     headers: headers,
      //     params: body,
      //   },
      // );
      // //store
      // const RefreshToken = response.data.refresh_token;
      // const consentExpiresIn = response.data.expires_in;
      // const Scope = response.data.scope;

      // const updatedDetails2 = {
      //   refreshedtoken: RefreshToken,
      //   status: 'Authorised',
      //   consentexpiry: consentExpiresIn,
      // };

      // const columnsToUpdate2 = ['refreshedtoken', 'status', 'consentexpiry'];

      // await updateDetails(updatedDetails2, 1001, columnsToUpdate2);

      // //store

      // //setting flag after storing refresh token in db
      // refreshTokenExists = true;

      return this.fetchAccounts('response.data.access_token');
      //console.log('Api access token', response.data.access_token);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }
  // async refreshToken(refreshToken: string): Promise<any> {
  //   try {
  //     const body: Record<string, string> = {
  //       client_id: this.clientId,
  //       client_secret: this.clientSecret,
  //       //redirect_uri: sandboxConfig.redirectUri,
  //       grant_type: 'refresh_token',
  //       refresh_token: refreshToken,
  //     };
  //     const headers = {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     };

  //     const responseRefresh: AxiosResponse<ResponseData> = await axios.post(
  //       `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
  //       null,
  //       {
  //         headers: headers,
  //         params: body,
  //       },
  //     );

  //     console.log('Refresh call response', responseRefresh.data);
  //     const RefreshToken = responseRefresh.data.refresh_token;
  //     //console.log(refreshToken);
  //     const updatedDetails3 = {
  //       refreshedtoken: RefreshToken,
  //     };

  //     const columnsToUpdate3 = ['refreshedtoken'];

  //     await updateDetails(updatedDetails3, 1001, columnsToUpdate3);

  //     //return this.fetchAccounts(responseRefresh.data.access_token);
  //     return responseRefresh.data.access_token;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch data: ${error}`);
  //   }
  // }

  // async  fetchAge(apiAccessToken: string): Promise<any> {
    
  //   try{
  //     const headers = {
  //       ...this.commonHeaders,
  //       Authorization: `Bearer ${apiAccessToken}`,
  //     };
  //     const ageResponse: AxiosResponse<any> = await axios.get(
  //       `${this.baseUrl}/${sandboxConfig.ageEndpoint}`,
  //       {
  //         headers: headers,
  //       },
  //     );

  //     const age = ageResponse.data.data[0].age;
  //     console.log(age);

  //   }catch(error) {
  //     throw new Error(`Failed to fetch data for age:  ${error}`);
  //   }
  // }

  async fetchAccounts(apiAccessToken: string): Promise<any> {
    try {
      // const headers = {
      //   ...this.commonHeaders,
      //   Authorization: `Bearer ${apiAccessToken}`,
      // };

      // const accountResponse: AxiosResponse<any> = await axios.get(
      //   `${this.baseUrl}/${sandboxConfig.accountsEndpoint}`,
      //   {
      //     headers: headers,
      //   },
      // );
      //store
      // const acDetails = accountResponse.data.Data;
      // const accountIds = acDetails.Account.map(
      //   (account: any) => account.AccountId,
      // );
      // const allAccountDetails = acDetails.Account;

      // const updatedDetails3 = {
      //   account_customer_consented: accountIds,
      //   account_details: JSON.stringify(allAccountDetails),
      // };

      // const columnsToUpdate3 = [
      //   'account_customer_consented',
      //   'account_details',
      // ];

      // await updateDetails(updatedDetails3, 1001, columnsToUpdate3);
      // //store
      // this.apiAccess = apiAccessToken;
      // await this.storeAccessToken(apiAccessToken);
      // await this.fetchAge(apiAccessToken);
      return accountResponse.Data;
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }
  // async allCalls(endPoint: string): Promise<any> {
  //   const access_token = await this.getAccessToken();
  //   if (access_token !== null) {
  //     this.apiAccess = access_token;
  //     //console.log(access_token);
  //   } else {
  //     console.log('No access token stored');
  //   }
  //   try {
  //     const headers = {
  //       ...this.commonHeaders,
  //       Authorization: `Bearer ${this.apiAccess}`,
  //     };

  //     const accountResponse: AxiosResponse<any> = await axios.get(
  //       `${this.baseUrl}/${sandboxConfig.accountsEndpoint}/${endPoint}`,
  //       {
  //         headers: headers,
  //       },
  //     );

  //     return accountResponse.data.Data;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch data for accounts: ${error}`);
  //   }
  // }

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
  // async fetchAccountsWithRefreshToken(access_token: string): Promise<any> {
  //   // const refresh_token = await fetchRefreshedToken(1001);

  //   // const access_token = await this.refreshToken(refresh_token);
  //   const apiAccessToken = access_token;
  //   try {
  //     const headers = {
  //       ...this.commonHeaders,
  //       Authorization: `Bearer ${apiAccessToken}`,
  //     };

  //     const accountResponse: AxiosResponse<any> = await axios.get(
  //       `${this.baseUrl}/${sandboxConfig.accountsEndpoint}`,
  //       {
  //         headers: headers,
  //       },
  //     );

  //     return accountResponse.data.Data;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch data for accounts: ${error}`);
  //   }
  // }
  // async allCallsWithRefreshToken(
  //   endPoint: string,
  //   access_token: string,
  // ): Promise<any> {
  //   // const refresh_token = await fetchRefreshedToken(1001);
  //   // const access_token = await this.refreshToken(refresh_token);

  //   this.apiAccess = access_token;

  //   try {
  //     const headers = {
  //       ...this.commonHeaders,
  //       Authorization: `Bearer ${this.apiAccess}`,
  //     };

  //     const accountResponse: AxiosResponse<any> = await axios.get(
  //       `${this.baseUrl}/${sandboxConfig.accountsEndpoint}/${endPoint}`,
  //       {
  //         headers: headers,
  //       },
  //     );

  //     return accountResponse.data.Data;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch data for accounts: ${error}`);
  //   }
  // }
}

export default MockApiClient;
