
import React, { useState, useEffect } from 'react';
// import sandboxConfig from '../configs/Sandbox.json';
import sandboxConfig from '../../../configs/Sandbox.json';
import {
    Title,
    Text,
    List,
    Checkbox,
    Icon,
    Button,
    Modal,
    Dialog,
    Portal,
    TextInput,
    DataTable
} from 'react-native-paper';
import {
    StyleSheet,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconDialog from '../../components/IconDialog';
import ApiFactory from '../../../ApiFactory/ApiFactory';
import { all } from 'axios';
import { Surface } from '@react-native-material/core';

const screenWidth = Dimensions.get('window').width;
const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');
const VRPConsent = ({route}) => {
    const formData = route.params?.formData;

    const jsondata=
    {
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
                "Name":formData.firstName,
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
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [allPayments, setAllPayments] = useState('');
    const [error, setError] = useState(null);
    const [expanded1, setExpanded1] = useState(false);
    const [expanded2, setExpanded2] = useState(false);
    const [expanded3, setExpanded3] = useState(false);

    const handlePress1 = () => setExpanded1(!expanded1);
    const handlePress2 = () => setExpanded2(!expanded2);
    const handlePress3 = () => setExpanded3(!expanded3);

    const [checked1, setChecked1] = useState(true);
    const [checked2, setChecked2] = useState(true);
    const [checked3, setChecked3] = useState(true);
    const [checked4, setChecked4] = useState(true);
    const [checked5, setChecked5] = useState(true);
    const [checked6, setChecked6] = useState(false);
    const [checked7, setChecked7] = useState(false);

    const handleCheckbox1 = () => setChecked1(!checked1);
    const handleCheckbox2 = () => setChecked2(!checked2);
    const handleCheckbox3 = () => setChecked3(!checked3);
    const handleCheckbox4 = () => setChecked4(!checked4);
    const handleCheckbox5 = () => setChecked5(!checked5);
    const handleCheckbox6 = () => setChecked6(!checked6);
    const handleCheckbox7 = () => setChecked7(!checked7);

    const [isErrorDialogVisible, setErrorDialogVisible] = useState(false);
    const showErrorDialog = () => setErrorDialogVisible(true);
    const hideErrorDialog = () => setErrorDialogVisible(false);
    const [isInputDialogVisible, setInputDialogVisible] = useState(false);
    const showInputDialog = () => setInputDialogVisible(true);
    const hideInputDialog = () => setInputDialogVisible(false);

    const [inputValue, setInputValue] = useState('');

    const areAllCheckboxesChecked = () => {
        return (
            (checked1 || checked2 || checked3 || checked4 || checked5) &&
            checked6 &&
            checked7
        );
    };

    const handleConfirmButtonClick = async () => {
        if (mode == 'sandbox') {
            try {
                const permissions = jsondata;

                setLoading(true);
                setError(null);
                const accessTokenParams = {
                    scope: 'payments',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        // other headers here
                    },
                    body: permissions,
                    consentUrl:sandboxConfig.paymentRequestEndPoint
                };
                const consentData = await sandboxApiClient.retrieveAccessToken(
                    { accessTokenParams },
                ); //here is data
                console.log('Consent id:', consentData);
                if (way == 'web') {
                    const Vrpscope='openid payments';
                    const consentUrl = await sandboxApiClient.manualUserConsent(
                        Vrpscope,
                    );
                    console.log(consentUrl);
                    showInputDialog();
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to retrieve access token.');
            } finally {
                setLoading(false);
            }
        } else {
            navigation.navigate('Consent');
        }
    };

    const handleSubmit = async () => {
        try {
            console.log(inputValue);
            const data = await sandboxApiClient.exchangeAccessToken(inputValue,formData);
            setAllPayments(data);
            
            navigation.navigate('VRP Details',{data});

            //   console.log(data);

        } catch (error) {
            console.error('Error:', error);
            setError('Failed to retrieve access token.');
        } finally {
            setLoading(false);
        }
        setInputValue('');
        hideInputDialog();
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>
                <Title style={styles.headerText}>Start a new VRP</Title>
                <Text style={styles.textStyle}>
                    We need your permission to setup a Variable Recurring Payment (VRP),to make 
                    transfers between your accounts, within the payment rules below:
                </Text>
                <Surface
                    elevation={8}
                    category="medium"
                    style={{ width: '100%', height: '700',alignItems:'center' }}>
                        <DataTable>
                            <View style={{backgroundColor:'#5a287d'}}>
                        <DataTable.Header>
                        <DataTable.Title textStyle={{color:'white',fontSize:15}}>REVIEW PAYMENT</DataTable.Title>
                        </DataTable.Header>
                        </View>
                        <View>
                        <DataTable.Header>
                        <DataTable.Title  style={{justifyContent:'center'}}textStyle={{color:'green',fontSize:25}}>£ {formData.amount}</DataTable.Title>
                        </DataTable.Header>
                        </View>
                        <DataTable.Header>
                        <DataTable.Title style={{maxWidth:200}} textStyle={{color:'black',fontSize:15}}numberOfLines={2}>To</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{formData.firstName}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Header>
                        <DataTable.Title style={{maxWidth:200}} textStyle={{color:'black',fontSize:15}}numberOfLines={2}>Sort Code</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{formData.firstName}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Header>
                        <DataTable.Title style={{maxWidth:200}} textStyle={{color:'black',fontSize:15}}numberOfLines={2}>Account Number</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{formData.firstName}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Header>
                        <DataTable.Title textStyle={{color:'black',fontSize:15}}>Reference</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{formData.reference}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Header>
                        <DataTable.Title textStyle={{color:'black',fontSize:15}}>Payment Frequency</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{jsondata.Data.ControlParameters.PeriodicLimits[0].PeriodType}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Header>
                        <DataTable.Title style={{maxWidth:200}} textStyle={{color:'black',fontSize:15}}numberOfLines={2}>Max Payment Amount per Transaction</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{jsondata.Data.ControlParameters.MaximumIndividualAmount.Amount}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Header>
                        <DataTable.Title style={{maxWidth:200}} textStyle={{color:'black',fontSize:15}}numberOfLines={2}>Max Payment Amount per {jsondata.Data.ControlParameters.PeriodicLimits[0].PeriodType
                        } </DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{jsondata.Data.ControlParameters.PeriodicLimits[0].Amount}</DataTable.Title>
                        </DataTable.Header>
                       
                        <View style={{backgroundColor:'#c8e1cc'}}>
                        <DataTable.Header>
                        <DataTable.Title style={{justifyContent:'center'}} textStyle={{color:'green',fontSize:15}}>Make Payment</DataTable.Title>
                       </DataTable.Header> 
                        </View>
                        
                    </DataTable>
                </Surface>
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <Button
                        icon="close"
                        mode="contained"
                        style={{ marginRight: 10 }}
                        onPress={() => navigation.goBack()}>
                        Deny
                    </Button>

                    <Button
                        icon="check-bold"
                        mode="contained"
                        onPress={() => {
                            if (areAllCheckboxesChecked()) {
                                handleConfirmButtonClick();
                            } else {
                                showErrorDialog();
                            }
                            //handleConfirmButtonClick();
                        }}
                        disabled={!areAllCheckboxesChecked()}
                        style={{ marginLeft: 10 }}>
                        Confirm
                    </Button>
                    {isErrorDialogVisible && (
                        <IconDialog
                            visible={isErrorDialogVisible}
                            hideDialog={hideErrorDialog}
                            title={
                                'We need consent, Please check boxes under Reason for Access'
                            }
                            text={''}
                        />
                    )}
                    <Portal>
                        <Dialog visible={isInputDialogVisible} onDismiss={hideInputDialog}>
                            <Dialog.Title>Redirect Input</Dialog.Title>
                            <Dialog.Content>
                                <TextInput
                                    label=" Paste URL from the browser"
                                    value={inputValue}
                                    onChangeText={text => setInputValue(text)}
                                />
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideInputDialog}>Cancel</Button>
                                <Button onPress={handleSubmit}>Submit</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 1,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#36013f',
        margin: 5,
    },
    textStyle: {
        textAlign: 'center',
        padding: 10,
        fontSize: 17,
    },
    titleStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    accordionStyle: {
        width: screenWidth - 40,
        margin: 20,
        borderRadius: 10,
        backgroundColor: '#c8e1cc',
        elevation: 3,
    },
    accordionListStyle: {
        width: screenWidth - 40,
        marginLeft: 20,
    },
});

export default VRPConsent;