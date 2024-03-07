import axios, { AxiosResponse } from 'axios';
import config from '../configs/config.json';
import sandboxConfig from '../configs/Sandbox.json';
import { Linking, Alert } from 'react-native';
import uuid from 'react-native-uuid';
import {addDetails,updateDetailsForVrp} from '../Database/Database';
// interface BodyData {
//   Data: {
//     Permissions: string;
//   };
//   Risk: {}; // Adjust this if Risk has a specific structure
// }
var refreshTokenExists = false;
interface ResponseData {
    access_token: string;
    Data?: {
        ConsentId?: string;
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

class SandBox {
    private baseUrl: string;
    private clientId: string;
    private clientSecret: string;
    private commonHeaders: any; // Replace 'any' with the actual type of commonHeaders
    private permissions!: string;
    private apiAccess: string = '';
    private consentId: string = '';
    private accessToken: string = '';
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

    async retrieveAccessToken(params: AccessTokenRequestParams): Promise<string> {
        this.permissions = params.accessTokenParams.body;
        try {
            const body: Record<string, string> = {
                grant_type: sandboxConfig.grant_type,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                scope: params.accessTokenParams.scope,
            };
            console.log(params.accessTokenParams.scope);
            const response: AxiosResponse<ResponseData> = await axios.post(
                `${this.baseUrl}/${sandboxConfig.tokenEndpoint}`,
                body, {
                headers: params.accessTokenParams.headers
            }
            );
            // const scope = response.data.scope;

            // const details1 = {
            //     userId: 1005,
            //     scope: params.accessTokenParams.scope,
            // };
            // console.log("details",details1);
            // addDetails(details1);

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
            console.log(body);
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
            const details1 = {
                bankname: 'Natwest',
                consentid: this.consentId,
                status: Status,
                consentpayload: JSON.stringify(Payload),
                scope: 'payments',
            };
            console.log("details",details1);
            addDetails(details1);
            

            console.log("response of consent", this.consentId);
            return response.data.Data?.ConsentId || '';
        } catch (error) {
            throw new Error(`Failed to fetch data: ${error}`);
        }
    }

    async manualUserConsent(scope: string): Promise<string> {
        // console.log('manual consent');
        let consentUrlWithVariables = `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=${scope}&redirect_uri=${sandboxConfig.redirectUri}&request=${this.consentId}`;
        Linking.openURL(consentUrlWithVariables);
        return consentUrlWithVariables;
    }

    // async userConsentProgammatically(consentId: string,formData:any): Promise<string> {
    //     try {
    //         console.log('ConsentID:', consentId);
    //         const accountResponse: AxiosResponse<any> = await axios.get(
    //             `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=${sandboxConfig.vrpScope}&redirect_uri=${sandboxConfig.redirectUri}&state=ABC&request=${consentId}&authorization_mode=AUTO_POSTMAN&authorization_username=${sandboxConfig.psu}`,
    //         );
    //         return this.exchangeAccessToken(accountResponse.data.redirectUri,formData);
    //     } catch (error) {
    //         throw new Error(`Failed to fetch data for accounts: ${error}`);
    //     }
    // }

    async exchangeAccessToken(authTokenUrl: string,formData:any) {
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

            console.log('Api access token', response.data.access_token);
            const RefreshToken = response.data.refresh_token;
            const consentExpiresIn = response.data.expires_in;
            const Scope = response.data.scope;

            const updatedDetails2 = {
                refreshedtoken: RefreshToken,
                status: 'Authorised',
                consentexpiry: consentExpiresIn,
            };

            const columnsToUpdate2 = ['refreshedtoken', 'status', 'consentexpiry'];

            await updateDetailsForVrp(updatedDetails2, this.consentId, columnsToUpdate2);
            refreshTokenExists = true;
            //return this.vrpPayments(response.data.access_token,this.consentId,formData);

        } catch (error) {
            throw new Error(`Failed to fetch data: ${error}`);
        }
    }

    async refreshToken(refreshToken: string,grantedformData:any): Promise<any> {//here also pass consent id to pass it other calls
        try {
          const body: Record<string, string> = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            //redirect_uri: sandboxConfig.redirectUri,
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
          //console.log(refreshToken);
          const updatedDetails3 = {
            refreshedtoken: RefreshToken,
          };
    
          const columnsToUpdate3 = ['refreshedtoken'];
    
          await updateDetailsForVrp(updatedDetails3,refreshToken.consentid , columnsToUpdate3);
          
          //return this.fetchAccounts(responseRefresh.data.access_token);
          return this.vrpPayments(responseRefresh.data.access_token,refreshToken.consentid,grantedformData);

        } catch (error) {
          throw new Error(`Failed to fetch data: ${error}`);
        }
      }

    async vrpPayments(apiAccessToken: string,consentid:string,formData:any): Promise<any> {
        try {
            const id = uuid.v4();
            const headers = {
                ...config.vrpHeaders,
                Authorization: `Bearer ${apiAccessToken}`,
                'x-idempotency-key': `${id}`
            };
            
            const body = {
                "Data": {
                    "ConsentId": `${consentid}`,
                    "PSUAuthenticationMethod": "UK.OBIE.SCANotRequired",
                    "Initiation": {
                        "CreditorAccount": {
                            "SchemeName": "SortCodeAccountNumber",
                            "Identification": "50499910000998",
                            "Name": formData.firstName,
                            "SecondaryIdentification": "secondary-identif"
                        },
                        "RemittanceInformation": {
                            "Unstructured": "Tools",
                            "Reference": formData.reference
                        }
                    },
                    "Instruction": {
                        "InstructionIdentification": "instr-identification",
                        "EndToEndIdentification": "e2e-identification",
                        "InstructedAmount": {
                            "Amount": "7.00",//must be called with pay now button
                            "Currency": "GBP"
                        }, 
                        "CreditorAccount": {
                            "SchemeName": "SortCodeAccountNumber",
                            "Identification": "50499910000998",
                            "Name": formData.firstName,
                            "SecondaryIdentification": "secondary-identif"
                        },
                        "RemittanceInformation": {
                            "Unstructured": "Tools",
                            "Reference": formData.reference
                        }
                    }
                },
                "Risk": {
                }
            };

            console.log("body",body);
            console.log(formData);
            const vrpPaymentResponse: AxiosResponse<any> = await axios.post(
                `${this.baseUrl}/${sandboxConfig.domesticVrpPayments}`, body,
                {
                    headers: headers
                },
            );
            this.apiAccess = apiAccessToken;
            console.log("payments-->", vrpPaymentResponse.data.Links.Self);
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
            const allVrpPaymentsResponse = await axios.get(
                url,
                {
                    headers: headers
                });
            console.log("allVrpPaymentsResponse of final call", allVrpPaymentsResponse.data);
            return allVrpPaymentsResponse.data;

        } catch (error) {
            console.log("error in getting in vrp payments", error);
        }
    }

    async allCalls(endPoint: string): Promise<any> {
        try {
            const headers = {
                ...this.commonHeaders,
                Authorization: `Bearer ${this.apiAccess}`,
            };

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
}

export default SandBox;
