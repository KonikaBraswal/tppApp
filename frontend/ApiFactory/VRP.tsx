import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// import { getRandomBase64 } from 'react-native-get-random-values';
const VRP = () => {
    const [data, setData] = useState(null);
    const [ConsentId, setConsentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        const id = uuidv4({
            // random:getRandomBase64
        });
        try {
            setLoading(true);
            //   fetchAccessToken();
            //   const token=JSON.stringify(data);
            const headers = {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
                'x-jws-signature': 'DUMMY_SIG',
                'x-idempotency-key': 'b1f4d64f-8c68-4a64-a6d3-030841311763',
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
            console.log(response.data);
            getConsentApprove(response.data.ConsentId);
        } catch (error) {
            console.log("error in id", error);
        } finally {
            setLoading(false);
        }
    };
    const getConsentApprove = async (consentId: string) => {
        try {
            setLoading(true);
            // const headers = {
            //     'Content-Type': 'application/x-www-form-urlencoded',
            //     // Add any other headers as needed
            // };

            const client_id = 'E91BESzQl1bSPp6qWTd-zG4x2dBx1IkntsoRHNoF2ks=';
            // Define request body (if needed)
            
            const response = await axios.get(`https://api.sandbox.natwest.com/authorize?client_id=${client_id}&response_type=code id_token&scope=openid payments&redirect_uri=https%3A%2F%2F5e87cf78-a50c-4dc1-92cc-730ad350de6b.example.org%2Fredirect&state=ABC&request=${consentId}&authorization_mode=AUTO_POSTMAN&authorization_username=123456789012@5e87cf78-a50c-4dc1-92cc-730ad350de6b.example.org&authorization_account=50000012345601`);
            setData(response.data);
            // fetchConsentID(response.data.access_token);
            console.log(response.data);
        } catch (error) {
            console.log("error in access");
        } finally {
            setLoading(false);
        }
    };
    return (
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
        </View>
    );
};

export default VRP;


