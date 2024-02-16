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
            
        });
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
            console.log(response.data);
        } catch (error) {
            console.log("error in id", error);
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


