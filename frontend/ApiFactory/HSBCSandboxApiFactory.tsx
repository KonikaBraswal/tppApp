import axios, {AxiosResponse} from 'axios';
import {Linking} from 'react-native';
import AndroidClient from '../DatabaseFactory/AndroidClientDb';
import ApiLogsDb from '../DatabaseFactory/ApiLogsDb';
function safeStringify(obj: any): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  });
}
let datafromcall1="";
let androidClientAisp: AndroidClient;
const logClient = new ApiLogsDb('NWG', 'Sandbox', 'logs');
const companyName = 'HSBC'; // Replace "YourCompanyName" with the actual company name
const apiClient = 'Sandbox';
const now = new Date();
let aispToStore = {
  userId: '999934356',
  scope: 'accounts',
  bankName: 'HSBC',
  consentId: '',
  consentPayload: '',
  refreshToken: '',
  accountsList: '',
};
let logData = {
  date: '',
  time: '',
  api_name: '',
  scope: '',
  status: '',
  response: '',
  bankName:'HSBC',
};//variable used for logging api responses in api db

class HSBCSandboxApiFactory {
  private scopeForThisCall: any;
  private DebtorAccount: any;
  private permissions: string[] = [];
  constructor(scope: any) {
    this.scopeForThisCall = scope;
    console.log("HSBC Sandbox API Factory initialized with scope:", scope);
  }

  // Starting function to call API factory which will decide the flow of code based on scope passed
  async callApiFactory(apiScope: string, permissions: string[], DebtorAccount: any) {
    this.permissions = permissions;
    this.scopeForThisCall = apiScope;
    this.DebtorAccount = DebtorAccount;
    
    await logClient.initDatabaseApi();
    switch (apiScope) {
      case 'accounts':
        androidClientAisp = new AndroidClient(companyName, apiClient, apiScope);
        console.log('******HSBC SANDBOX ACCOUNTS CALL********');
        this.scopeForThisCall = 'accounts';
        return this.retrieveAccessToken();
      case 'payments':
        console.log('******HSBC SANDBOX PAYMENTS CALL********');
        this.scopeForThisCall = 'payments';
        return this.dummy();
      case 'vrp':
        console.log('******HSBC VRP CALL********');
        this.scopeForThisCall = 'vrp';
        return this.dummy();
      default:
        console.error(
          'Wrong Scope: Sandbox has only three scopes, accounts, payments, and vrp'
        );
        throw new Error('Unsupported API scope: ' + apiScope);
    }
  }

  async dummy(){
    console.log("STILL WORKING ON IT");
    return "IN PROGRESS";
  }
  

  async retrieveAccessToken() {
    // Define the payload for the POST request
    const payload = {
      permissions: this.permissions,
      scope: this.scopeForThisCall,
      DebtorAccount: this.DebtorAccount,
    };
    const consentPayload={
      "Data":{
        "Permissions":this.permissions
      },
      "Risk":{}
    }

    try {
      // Make the POST request
      const response: AxiosResponse<any> = await axios.post(
        'http://192.168.1.34:4000/TokenConsentLogin_Sandbox_HSBC',payload,
       // Payload should be passed as the second argument to the POST request
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Axios automatically parses the JSON response
      datafromcall1=response.data;
      aispToStore.consentId=response.data.consentId;
      aispToStore.consentPayload=JSON.stringify(consentPayload);
      console.log('Access token retrieved:', response.data);
       //Storing APILOGS
       logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'Retreive Access Token',
        scope: this.scopeForThisCall,
        status: response.status.toString(),
        response: JSON.stringify(response),
        bankName:"HSBC"
      };
      await logClient.insertLog(logData);
      //Storing APILOGS
      return this.manualUserConsent(datafromcall1); // Assuming the access token is in the response data
    } catch (error) {
      console.error('Error retrieving access token:', error);
      throw error;
    }
  }

  // redirect url to ask user for their consent

  async manualUserConsent(datafromcall1:any) {
    let consentUrlWithVariables = datafromcall1.login;

    console.log('manual consent');
    if (this.scopeForThisCall == 'accounts') {
     console.log("You will be redirected to our HSBC portal");
    }
    if (this.scopeForThisCall == 'payments') {
  
      consentUrlWithVariables = ''
    }
    if (this.scopeForThisCall == 'vrp') {
     
    }
    Linking.openURL(consentUrlWithVariables);
    return consentUrlWithVariables;
  }

  async exchangeAccessToken(authTokenUrl: string, consentData: any){
   const payloadUrl={
    "url":authTokenUrl
   }
    try {
      // Make the POST request
      const response2: AxiosResponse<any> = await axios.post(
        'http://192.168.1.34:4000/AccessToken_HSBC_Sandbox',
        payloadUrl, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Axios automatically parses the JSON response
      console.log('Access token retrieved:', response2.data);
      const ref=JSON.parse(response2.data.access);
      aispToStore.refreshToken=ref.refresh_token;
       //Storing APILOGS
       logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'Exchange Access Token',
        scope: this.scopeForThisCall,
        status: response2.status.toString(),
        response: JSON.stringify(response2),
        bankName:"HSBC"
      };
      await logClient.insertLog(logData);
      //Storing APILOGS
      return this.fetchAccounts(response2.data.access); // Assuming the access token is in the response data
    } catch (error) {
      console.error('Error retrieving access token:', error);
      throw error;
    }
  }

  async fetchAccounts(accessToken:any){
    const accesspayload={
      accessToken:accessToken,
    }
    try {
      // Make the POST request
      const response3: AxiosResponse<any> = await axios.post(
        'http://192.168.1.34:4000/FetchAccounts_HSBC_Sandbox',
        accesspayload, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const acc=JSON.parse(response3.data.accounts);
      aispToStore.accountsList=JSON.stringify(acc.Data);
      
      await androidClientAisp.initDatabaseAndroidAisp()//create the table
      await androidClientAisp.insertDataAisp(aispToStore);
      await androidClientAisp.displayData();
      console.log("ACCOUNT ADDED SUCCESSFULLY");
       //Storing APILOGS
       logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'Retreive Accounts',
        scope: this.scopeForThisCall,
        status: response3.status.toString(),
        response: JSON.stringify(response3),
        bankName:"HSBC"
      };
      await logClient.insertLog(logData);
      //Storing APILOGS
      return acc.Data; // Assuming the access token is in the response data
    } catch (error) {
      console.error('Accounts Error', error);
      throw error;
    }

  }

  async allCalls(endpoint:any,access_token:any){
    const accesspayload={
    }
    console.log(endpoint);
    const end=endpoint.split('/')[1];
    try {
      // Make the POST request
      const response3: AxiosResponse<any> = await axios.post(
        `http://192.168.1.34:4000/FetchAccounts_HSBC_Sandbox/${endpoint}`,
        accesspayload, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
       //Storing APILOGS
       logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: `${endpoint}`,
        scope: this.scopeForThisCall,
        status: response3.status.toString(),
        response: '',
        bankName:"HSBC"
      };
      //Storing APILOGS
      if(end=="balances"){
      logData.response=safeStringify(response3);
      const bal=JSON.parse(response3.data.balances);
      await logClient.insertLog(logData);
      return bal.Data; 
      }// Assuming the access token is in the response data
      if(end=="transactions"){
        logData.response=JSON.stringify(response3);
        const trans=response3.data.transactions;
      await logClient.insertLog(logData);
        return trans.Data;
      }
      return null;
    } catch (error) {
      console.error('Accounts Error', error);
      throw error;
    }

  }

  async refreshToken(refreshToken:any,consentId:any){
    console.log(consentId,"Inside hsbc api factory",refreshToken);
    const payload={
      "refresh_token":refreshToken
    }
    try {
      // Make the POST request
      const response2: AxiosResponse<any> = await axios.post(
        'http://192.168.1.34:4000/RefreshAccessToken_HSBC_Sandbox',
        payload, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Axios automatically parses the JSON response
      console.log('Refresh Access token retrieved:', response2.data);
      const ref=JSON.parse(response2.data.access);
      const androidClientAispRefresh = new AndroidClient(companyName, apiClient, "accounts");
      if (ref.refresh_token !== null && ref.refresh_token !== undefined) {
        await androidClientAispRefresh.updateRefreshTokenAisp(aispToStore.userId, ref.refresh_token,consentId);
      }
       //Storing APILOGS
       logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'Refresh Access Token',
        scope: this.scopeForThisCall,
        status: response2.status.toString(),
        response: JSON.stringify(response2),
        bankName:"HSBC"
      };
      await logClient.insertLog(logData);
      //Storing APILOGS
      return response2.data.access; // Assuming the access token is in the response data
    } catch (error) {
      console.error('Error retrieving access token:', error);
      throw error;
    }

  }
  async fetchAccountsWithRefreshToken(access_token: string): Promise<any> {
    if (this.scopeForThisCall === 'accounts') {
      console.log("Fetching accounts with refresh token");

      try {
        const response: AxiosResponse<any> = await axios.post(
          'http://192.168.1.34:4000/FetchAccounts_HSBC_Sandbox',
          { access_token },  // Assuming `accesspayload` was meant to contain `access_token`
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
         //Storing APILOGS
       logData = {
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(now.getDate()).padStart(2, '0')}`,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        api_name: 'Fetch Accounts With Refresh Token',
        scope: this.scopeForThisCall,
        status: response.status.toString(),
        response: JSON.stringify(response),
        bankName:"HSBC"
      };
      await logClient.insertLog(logData);
      //Storing APILOGS
        return response.data.accounts;
      } catch (error) {
        console.error('Error fetching accounts:', error);
        throw error;
      }
    }

    if (this.scopeForThisCall === 'payments') {
      console.log("Handling payments with refresh token");
      // Add logic for handling 'payments' scope
    }

    if (this.scopeForThisCall === 'vrp') {
      console.log("Handling VRP with refresh token");
      // Add logic for handling 'vrp' scope
    }
  }
  async allCallsWithRefreshToken(endPoint: string, access_token: string){
    console.log(endPoint,"check")
    return this.allCalls(endPoint,access_token);
  }
}

export default HSBCSandboxApiFactory;