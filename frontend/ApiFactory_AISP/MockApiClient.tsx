
import accountResponse from '../src/assets/data/accounts.json';
import { insertAISPData } from '../database/LocalDatabase';

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
      // const accID=accountResponse.Data
      // insertAISPData
      // return accountResponse.Data;
      accountResponse.Data.Account.forEach(account => {
        // Extract the necessary information
        const accID = account.AccountId;
        const accsubType = account.AccountSubType;
        const accnum = account.Account[0].Identification;
        const debtorname = account.Nickname;
  
        // Call the insertAISPData function with the extracted information
        insertAISPData(accID, accsubType, accnum, debtorname);
      });
      return accountResponse.Data;
      
    } catch (error) {
      throw new Error(`Failed to fetch data for accounts: ${error}`);
    }
  }
}

export default MockApiClient;