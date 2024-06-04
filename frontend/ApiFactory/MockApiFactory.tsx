// Imports
import {insertAISPData, insertVRPData} from '../database/LocalDatabase';
import paymentData from '../DatabaseFactory/MockData/pisp.json';
import VRPData from '../DatabaseFactory/MockData/vrp.json';
import accountResponse from '../DatabaseFactory/MockData/accounts.json';

class MockApiFactory {
  private apiScope: string = '';

  constructor(apiScope: string) {
    this.apiScope = apiScope;
  }

  async callApiFactory() {
    switch (this.apiScope) {
      case 'accounts':
        console.log('******MOCK ACCOUNTS CALL********');
        return this.retrieveAccessToken();
      case 'payments':
        console.log('******MOCK PAYMENTS CALL********');
        return this.retrieveAccessToken();
      case 'vrp':
        console.log('******MOCK VRP CALL********');
        return this.retrieveAccessToken();
      default:
        console.log(
          'Wrong Scope: Sandbox has only three scopes, accounts, payments, and vrp',
        );
        return null;
    }
  }

  async retrieveAccessToken(): Promise<string> {
    return 'nothing';
  }

  async manualUserConsent(consentId: string): Promise<string> {
    return 'nothing';
  }

  async exchangeAccessToken(authTokenUrl: string): Promise<any> {
    if (this.apiScope == 'accounts') {
      return this.fetchAccounts('response.data.access_token');
    } else if(this.apiScope=='payments') {
      return (paymentData.Data);
      
    }
    else if(this.apiScope=='vrp'){
      return "nothing";
    }
  }
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

  async refreshTokenForVRP(refreshToken: any, grantedformData: any): Promise<any> {
    
    const userId = VRPData.Data.DomesticVRPId;
    const flow = 'VRP';
    const creditorname = VRPData.Data.Initiation.CreditorAccount.Name;
    const debtoraccnum = VRPData.Data.DebtorAccount.Identification;
    insertVRPData(userId, flow, creditorname, debtoraccnum);
    return VRPData;
  }
  async allCalls(endpoint:any):Promise<any>{
    return "nothing"
  }
}

export default MockApiFactory;
