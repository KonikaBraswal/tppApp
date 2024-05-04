
import paymentData from '../src/assets/data/pisp.json';

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


// const userIdToUpdate = 1001;

class MockApiClient {

  async retrieveAccessToken(
    callScope: string,
    DebtorAccount: any,
  ): Promise<string> {
    return "nothing";
  }
  async manualUserConsent(consentId: string): Promise<string> {
   
    return "consentUrlWithVariables";
  }

  async exchangeAccessToken(authTokenUrl: string): Promise<any> {
   return paymentData.Data;
  }
}

export default MockApiClient;