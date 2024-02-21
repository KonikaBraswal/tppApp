import axios, { AxiosResponse } from 'axios';
import config from '../configs/config.json';
import sandboxConfig from '../configs/Sandbox.json';
import { Linking, Alert } from 'react-native';
import uuid from 'react-native-uuid';
// interface BodyData {
//   Data: {
//     Permissions: string;
//   };
//   Risk: {}; // Adjust this if Risk has a specific structure
// }

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
    scope: string;
    headers: Record<string, string>;
    body: string; // Adjust the type according to your actual body structure
}

class SandBox {
    private baseUrl: string;
    private clientId: string;
    private clientSecret: string;
    private commonHeaders: any; // Replace 'any' with the actual type of commonHeaders
    private permissions!: string;
    private apiAccess: string = '';
    private consentId: string = '';

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
            console.log('Access token', response.data.access_token);
            return this.accountRequest(response.data.access_token);
        } catch (error) {
            throw new Error(`Failed to fetch data: ${error}`);
        }
    }

    async accountRequest(accessToken: string): Promise<string> {
        try {
            const body = this.permissions;
            const id = uuid.v4();
            const headers = {
                ...config.vrpHeaders,
                Authorization: 'Bearer ' + accessToken,
                'x-idempotency-key': `${id}`,
            };
            console.log(body);
            const response: AxiosResponse<ResponseData> = await axios.post(
                `${this.baseUrl}/${sandboxConfig.paymentRequestEndPoint}`,
                body,
                {
                    headers: headers,
                },
            );
            this.consentId = response.data.Data?.ConsentId;
            console.log("response of consent", this.consentId);
            return response.data.Data?.ConsentId || '';
        } catch (error) {
            throw new Error(`Failed to fetch data: ${error}`);
        }
    }

    async manualUserConsent(consentId: string): Promise<string> {
        console.log('manual consent');
        let consentUrlWithVariables = `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=${sandboxConfig.vrpScope}&redirect_uri=${sandboxConfig.redirectUri}&request=${consentId}`;
        Linking.openURL(consentUrlWithVariables);
        return consentUrlWithVariables;
    }

    async userConsentProgammatically(consentId: string): Promise<string> {
        try {
            console.log('ConsentID:', consentId);
            const accountResponse: AxiosResponse<any> = await axios.get(
                `${sandboxConfig.consentUrl}?client_id=${config.clientId}&response_type=code id_token&scope=${sandboxConfig.vrpScope}&redirect_uri=${sandboxConfig.redirectUri}&state=ABC&request=${consentId}&authorization_mode=AUTO_POSTMAN&authorization_username=${sandboxConfig.psu}`,
            );
            return this.exchangeAccessToken(accountResponse.data.redirectUri);
        } catch (error) {
            throw new Error(`Failed to fetch data for accounts: ${error}`);
        }
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

            console.log('Api access token', response.data.access_token);

            return this.vrpPayments(response.data.access_token);

        } catch (error) {
            throw new Error(`Failed to fetch data: ${error}`);
        }
    }

    async vrpPayments(apiAccessToken: string): Promise<any> {
        try {
            const id = uuid.v4();
            const headers = {
                ...config.vrpHeaders,
                Authorization: `Bearer ${apiAccessToken}`,
                'x-idempotency-key': `${id}`
            };
            console.log("hhh", headers);
            const body = {
                "Data": {
                    "ConsentId": `${this.consentId}`,
                    "PSUAuthenticationMethod": "UK.OBIE.SCANotRequired",
                    "Initiation": {
                        "CreditorAccount": {
                            "SchemeName": "SortCodeAccountNumber",
                            "Identification": "50499910000998",
                            "Name": "ACME DIY",
                            "SecondaryIdentification": "secondary-identif"
                        },
                        "RemittanceInformation": {
                            "Unstructured": "Tools",
                            "Reference": "Tools"
                        }
                    },
                    "Instruction": {
                        "InstructionIdentification": "instr-identification",
                        "EndToEndIdentification": "e2e-identification",
                        "InstructedAmount": {
                            "Amount": "5.00",
                            "Currency": "GBP"
                        },
                        "CreditorAccount": {
                            "SchemeName": "SortCodeAccountNumber",
                            "Identification": "50499910000998",
                            "Name": "ACME DIY",
                            "SecondaryIdentification": "secondary-identif"
                        },
                        "RemittanceInformation": {
                            "Unstructured": "Tools",
                            "Reference": "Tools"
                        }
                    }
                },
                "Risk": {
                }
            };


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

    async getAllVrpPayments(url:string): Promise<any> {
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
