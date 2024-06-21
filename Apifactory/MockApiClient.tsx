import * as Keychain from 'react-native-keychain';
import paymentData from '../src/assets/data/pisp.json';
import VRPData from '../src/assets/data/vrp.json';
import accountResponse from '../src/assets/data/accounts.json';
// import { insertAISPData } from '../database/LocalDatabase';
// import {  insertVRPData } from '../database/LocalDatabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface AccessTokenRequestParams {
    accessTokenParams: any;
    scope: string;
    headers: Record<string, string>;
    body: string; // Adjust the type according to your actual body structure
    consentUrl: string;
  }
class MockApiClient {

  async retrieveAccessToken(permission: string[]): Promise<string> {
    return "nothing";
  }

  async manualUserConsent(consentId: string): Promise<string> {
    return 'nothing';
  }
  async userConsentProgammatically(consentId: string): Promise<string> {
    return 'nothing';
  }

  async exchangeAccessToken(authTokenUrl: string): Promise<string> {
      return this.fetchAccounts('response.data.access_token');}
  async fetchAccounts(apiAccessToken: string): Promise<any> {
    try {
      const { Account } = accountResponse.Data;

      // Use Promise.all to await all AsyncStorage operations concurrently
      await Promise.all(
        Account.map(async (account) => {
          const accID = account.AccountId;
          const accsubType = account.AccountSubType;
          const accnum = account.Account[0].Identification;
          const debtorname = account.Nickname;

          // Construct your data object
          const newData = {
            accID,
            accsubType,
            accnum,
            debtorname,
          };

          // Store data in AsyncStorage
          await AsyncStorage.setItem(`localaisp_{accID}`, JSON.stringify(newData));
          console.log('Local AISP Data inserted successfully:', newData);
        })
      );

      return accountResponse.Data;
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }
  ///****************************************PISP****************************** */
  async retrieveAccessToken_pisp(
    callScope: string,
    DebtorAccount: any,
  ): Promise<string> {
    return "nothing";
  }
  async manualUserConsent_pisp(consentId: string): Promise<string> {

    return "consentUrlWithVariables";
  }

  async exchangeAccessToken_pisp(authTokenUrl: string): Promise<any> {
   return paymentData.Data;
  }
    ///****************************************VRP****************************** */
  async retrieveAccessToken_vrp(params: AccessTokenRequestParams): Promise<string> {
    // this.permissions = params.accessTokenParams.body;  
    return "nothing";

  }

  async manualUserConsent_vrp(scope: string): Promise<string> {
    return "consentUrlWithVariables";
  }


  async exchangeAccessToken_vrp(authTokenUrl: string, formData: any, consentData: any) {
    try {
      return "nothing";

    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async refreshToken_vrp(refreshToken: any, grantedformData: any): Promise<any> {
      console.log("callleddddddddddddd me",VRPData);
      const userId=VRPData.Data.DomesticVRPId;
      const flow="VRP";
      const creditorname=VRPData.Data.Initiation.CreditorAccount.Name;
      const debtoraccnum=VRPData.Data.DebtorAccount.Identification;
      // insertVRPData(userId,flow,creditorname,debtoraccnum);
      const vrpDataToStore = {
        userId,
        flow,
        creditorname,
        debtoraccnum
      };
      try {
        // Convert the object to a JSON string
        const jsonData = JSON.stringify(vrpDataToStore);

        // Store the JSON string in AsyncStorage with a specific key
        await AsyncStorage.setItem('vrpData', jsonData);

        console.log('Data successfully saved to AsyncStorage');
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
      return VRPData;

  }
  ///*********************CVRP************************* *////
  async retrieveAccessToken_cvrp(params: AccessTokenRequestParams): Promise<string> {
    // this.permissions = params.accessTokenParams.body;  
    return "nothing";

  }
  async manualUserConsent_cvrp(scope: string): Promise<string> {
    return "consentUrlWithVariables";
  }
  async exchangeAccessToken_cvrp(authTokenUrl: string, formData: any, consentData: any) {
    try {
      return "nothing";

    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }
  async refreshToken_cvrp(refreshToken: any, grantedformData: any): Promise<any> {
    console.log("callleddddddddddddd me",VRPData);
    const userId=VRPData.Data.DomesticVRPId;
    const flow="VRP";
    const creditorname=VRPData.Data.Initiation.CreditorAccount.Name;
    const debtoraccnum=VRPData.Data.DebtorAccount.Identification;
    // insertVRPData(userId,flow,creditorname,debtoraccnum);
    const vrpDataToStore = {
      userId,
      flow,
      creditorname,
      debtoraccnum
    };
    try {
      // Convert the object to a JSON string
      const jsonData = JSON.stringify(vrpDataToStore);

      // Store the JSON string in AsyncStorage with a specific key
      await AsyncStorage.setItem('vrpData', jsonData);

      console.log('Data successfully saved to AsyncStorage');
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
    return VRPData;

}



}

export default MockApiClient;