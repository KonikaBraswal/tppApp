import React, { useState } from 'react';
import { View, Text, Button, Linking, TextInput } from 'react-native';
import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
import uuid from 'react-native-uuid';
import { Dialog, Portal } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
// import { getRandomBase64 } from 'react-native-get-random-values';
const VRP = () => {
    const [data, setData] = useState(null);
    const [getdata, setgetData] = useState(null);
    const [payments, setPayments] = useState(null);
    const [ConsentId, setConsentId] = useState(null);
    const [apiAccessToken, setApiAccessToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const client_secret = '5scJee6GzTO3ys_ef2lENEpB30qZ_s067QaIPxuYQYQ=';
    const fetchAccessToken = async () => {
        try {
            setLoading(true);
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                // Add any other headers as needed
            };

            // Define request body (if needed)
            const requestBody = {
                // Your request body data goes here
                grant_type: 'client_credentials',
                client_id: 'E91BESzQl1bSPp6qWTd-zG4x2dBx1IkntsoRHNoF2ks=',
                client_secret: '5scJee6GzTO3ys_ef2lENEpB30qZ_s067QaIPxuYQYQ=',
                scope: 'payments'
            };
            const response = await axios.post('https://ob.sandbox.natwest.com/token', requestBody, { headers });
            setData(response.data);
            fetchConsentID(response.data.access_token);
            console.log(response.data);
        } catch (error) {
            console.log("error in access");
        } finally {
            setLoading(false);
        }
    };
    const fetchConsentID = async (access_token: string) => {
        const id = uuid.v4();
        try {
            setLoading(true);
            //   fetchAccessToken();
            //   const token=JSON.stringify(data);
            const headers = {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
                'x-jws-signature': 'DUMMY_SIG',
                'x-idempotency-key': `${id}`,
                'x-fapi-financial-id': '0015800000jfwxXAAQ'

                // Add any other headers as needed
            };
            console.log("ggh", headers);
            // Define request body (if needed)
            const requestBody = {
                // Your request body data goes here
                "Data": {
                    "ControlParameters": {
                        "VRPType": [
                            "UK.OBIE.VRPType.Other"
                        ],
                        "PSUAuthenticationMethods": [
                            "UK.OBIE.SCANotRequired"
                        ],
                        "ValidFromDateTime": "2021-08-01T23:06:53.599Z",
                        "ValidToDateTime": "2024-08-01T23:06:53.599Z",
                        "MaximumIndividualAmount": {
                            "Amount": 200.00,
                            "Currency": "GBP"
                        },
                        "PeriodicLimits": [
                            {
                                "PeriodType": "Week",
                                "PeriodAlignment": "Calendar",
                                "Amount": "300.00",
                                "Currency": "GBP"
                            }
                        ]
                    },
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
                    }
                },
                "Risk": {}
            };
            console.log("body", requestBody);
            const response = await axios.post('https://ob.sandbox.natwest.com/open-banking/v3.1/pisp/domestic-vrp-consents', requestBody, { headers });
            setConsentId(response.data);
            console.log("consent",ConsentId);
            console.log(response.data.Data.ConsentId);
            // getConsentApprove(response.data.Data.ConsentId);
            manualConsent(response.data.Data.ConsentId);
        } catch (error) {
            console.log("error in id", error);
        } finally {
            setLoading(false);
        }
    };

    const client_id = 'E91BESzQl1bSPp6qWTd-zG4x2dBx1IkntsoRHNoF2ks=';
    const redirect_uri = 'https://localhost:3000';
    const manualConsent = async (consentId: string) => {
        const url = `https://api.sandbox.natwest.com/authorize?client_id=${client_id}&response_type=code id_token&scope=openid payments&redirect_uri=${redirect_uri}&request=${consentId}`
        await Linking.openURL(url);
        showInputDialog();

    }
    const [isInputDialogVisible, setInputDialogVisible] = useState(false);
    const showInputDialog = () => setInputDialogVisible(true);
    const hideInputDialog = () => setInputDialogVisible(false);
    const [inputValue, setInputValue] = useState('');

    const getConsentApprove = async () => {
        hideInputDialog();
        try {
            setLoading(true);

            console.log(inputValue);
            const start = inputValue.indexOf('=') + 1;
            const end = inputValue.indexOf('&');
            const authToken = inputValue.slice(start, end);
            setInputValue('');
            console.log(authToken);
            const body: Record<string, string> = {
                client_id: client_id,
                client_secret: client_secret,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
                code: authToken,
            };
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };

            const response = await axios.post('https://ob.sandbox.natwest.com/token', body, { headers });
            setApiAccessToken(response.data.access_token);
            await getAllPayments(response.data.access_token);
            console.log(response.data);
        } catch (error) {
            console.log("error in access in auth code");
        } finally {
            setLoading(false);
        }
    };
    const getAllPayments= async (data:string)=>{
        console.log("consent",ConsentId.Data.ConsentId);
        console.log("data for payments",data);
        try{
        const id = uuid.v4();

        const headers={
            Authorization:`Bearer ${data}`,
            'x-fapi-financial-id':'0015800000jfwxXAAQ',
            'Content-Type':'application/json',
            'x-jws-signature':'DUMMY_SIG',
            'x-idempotency-key':`${id}`
        };
        console.log("head",headers);
        const body={
            "Data": {
              "ConsentId": `${ConsentId.Data.ConsentId}`,
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
          console.log("body",body);
         const response=await axios.post('https://ob.sandbox.natwest.com/open-banking/v3.1/pisp/domestic-vrps',body,{headers});
         console.log("4th call",response.data); 
         setPayments(response.data);
         getDomesticPayments(response.data.Links.Self);
        }catch (error) {
            console.log("error in access in vrp payments",error);
        } finally {
            setLoading(false);
        }

    };
    const getDomesticPayments= async(url:string)=>{
        try{
            setLoading(true);
            const headers={
                Authorization:`Bearer ${apiAccessToken}`,
            'x-fapi-financial-id':'0015800000jfwxXAAQ',
            };
            const response=await axios.get(url,{headers});
            console.log("response",response.data);
            setgetData(response.data);

        }catch (error) {
            console.log("error in getting in vrp payments",error);
        } finally {
            setLoading(false);
        }

        

    };
    return (
        <ScrollView>
        <View>
            <Button title="Make API Call" onPress={fetchAccessToken} />
            {/* <Button title="Make API Call" onPress={fetchConsentID} /> */}
            {loading && <Text>Loading...</Text>}
            {/* {error && <Text>Error: {error.message}</Text>} */}
            {data && (
                <View>
                    <Text>Data: {JSON.stringify(data)}</Text>
                </View>
            )}
            {ConsentId && (
                <View>
                    <Text>Data: {JSON.stringify(ConsentId)}</Text>
                </View>
            )}
            <Portal>
                <Dialog visible={isInputDialogVisible} onDismiss={hideInputDialog}>
                    <Dialog.Title>Redirect Input</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginVertical: 10 }}
                            value={inputValue}
                            onChangeText={text => setInputValue(text)}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button title='cancel' onPress={hideInputDialog}>
                            Cancel</Button>
                        <Button title="submit" onPress={getConsentApprove}>
                            Submit</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            {apiAccessToken && (
                <View>
                    <Text>Data: {JSON.stringify(apiAccessToken)}</Text>
                </View>
            )}
            {payments && (
                <View>
                    <Text>Data: {JSON.stringify(payments)}</Text>
                </View>
            )}
            {getdata && (
                <View>
                    <Text>Data: {JSON.stringify(getdata)}</Text>
                </View>
            )}
        </View>
        </ScrollView>
    );
};

export default VRP;

