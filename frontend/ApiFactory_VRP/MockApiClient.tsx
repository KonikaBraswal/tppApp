import axios, { AxiosResponse } from 'axios';
import config from '../configs_VRP/config.json';
import sandboxConfig from '../configs_VRP/Sandbox.json';
import { Linking, Alert } from 'react-native';
import uuid from 'react-native-uuid';
import VRPData from '../src/assets/data/vrp.json';
import { addDetails, addTransactions, updateDetailsForVrp, } from '../database/Database';
import {  insertVRPData } from '../database/LocalDatabase';


interface AccessTokenRequestParams {
  accessTokenParams: any;
  scope: string;
  headers: Record<string, string>;
  body: string; // Adjust the type according to your actual body structure
  consentUrl: string;
}

class MockApiClient {

  async retrieveAccessToken(params: AccessTokenRequestParams): Promise<string> {
    // this.permissions = params.accessTokenParams.body;  
    return "nothing";
    
  }

  async manualUserConsent(scope: string): Promise<string> {
    return "consentUrlWithVariables";
  }


  async exchangeAccessToken(authTokenUrl: string, formData: any, consentData: any) {
    try {
      return "nothing";

    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }

  async refreshToken(refreshToken: any, grantedformData: any): Promise<any> {
      console.log("callleddddddddddddd me",VRPData);
      const userId=VRPData.Data.DomesticVRPId;
      const flow="VRP";
      const creditorname=VRPData.Data.Initiation.CreditorAccount.Name;
      const debtoraccnum=VRPData.Data.DebtorAccount.Identification;
      insertVRPData(userId,flow,creditorname,debtoraccnum);
      return VRPData;
    
  }

 
}

export default MockApiClient;
