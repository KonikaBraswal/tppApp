
import React, { useState, useEffect } from 'react';
// import sandboxConfig from '../configs/Sandbox.json';
import sandboxConfig from '../../../configs_VRP/Sandbox.json';
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
import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
import { all } from 'axios';
import { Surface } from '@react-native-material/core';

const screenWidth = Dimensions.get('window').width;
const ConsentInfo = ({ route }) => {
    const {
        transactionDetails,
        consentpayload
    }=route.params;
    // const consentpayload = route.params?.consentpayload;
    const payload = JSON.parse(consentpayload);
    // console.log("pay", payload.Initiation.RemittanceInformation);
    // console.log("consent", payload.ControlParameters.PeriodicLimits[0]);
    var transactions;
  console.log("det", transactionDetails);
  transactionDetails?.map(element => {
    transactions = JSON.parse(element.vrppayload);
  });
  console.log("details::", transactions);
  
    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>
                <Title style={styles.headerText}>Consent Information</Title>
                <Text style={styles.textStyle}>
                    Permissions given to setup a Variable Recurring Payment (VRP),to make
                    transfers between your accounts, within the payment rules below:
                </Text>
                <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>
                    ConsentId:{payload.ConsentId}
                </Text>
                <View style={{ backgroundColor: '#D6CFC7', width: '100%', flex: 1 }}>
                    <Surface
                        elevation={0}

                        style={{ flex: 1, alignItems: 'center', backgroundColor: '#D6CFC7' }}>
                        <DataTable>
                            <View style={{ backgroundColor: '#D6CFC7' }}>
                                <DataTable.Header>
                                    <DataTable.Title textStyle={{ color: '#5a287d', fontSize: 20, fontWeight: 'bold' }}>Payment Terms</DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Header>
                                    <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Reference</DataTable.Title>
                                    <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{payload.Initiation.RemittanceInformation.Reference}</DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Header>
                                    <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Period Type</DataTable.Title>
                                    <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{payload.ControlParameters.PeriodicLimits[0].PeriodType}</DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Header>
                                    <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Max per {payload.ControlParameters.PeriodicLimits[0].PeriodType}</DataTable.Title>
                                    <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>£{payload.ControlParameters.PeriodicLimits[0].Amount}</DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Header>
                                    <DataTable.Title textStyle={{ color: 'black', fontSize: 15 }}>Max per Payment</DataTable.Title>
                                    <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>£{payload.ControlParameters.MaximumIndividualAmount.Amount}</DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Header>
                                    <DataTable.Title textStyle={{ color: 'black', fontSize: 15 }}>Expiry Date</DataTable.Title>
                                    <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{new Date(payload.ControlParameters.ValidToDateTime).toLocaleDateString()}</DataTable.Title>
                                </DataTable.Header>
                            </View>
                        </DataTable>

                    </Surface>
                    <Surface
                        elevation={2}
                        category="medium"
                        style={{ width: '100%', height: 200 }}>

                        <DataTable>

                            <DataTable.Header>
                                <DataTable.Title textStyle={{ color: '#5a287d', fontSize: 20, fontWeight: 'bold' }}>To</DataTable.Title>
                            </DataTable.Header>

                            <DataTable.Header>
                                <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Creditor Name</DataTable.Title>
                                <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{payload.Initiation.CreditorAccount.Name}</DataTable.Title>
                            </DataTable.Header>

                            <DataTable.Header>
                                <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Account Number</DataTable.Title>
                                <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{payload.Initiation.CreditorAccount.Identification.substring(0, 8)}</DataTable.Title>
                            </DataTable.Header>
                            <DataTable.Header>
                                <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Sort Code</DataTable.Title>
                                <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{payload.Initiation.CreditorAccount.Identification.substring(8)}</DataTable.Title>
                            </DataTable.Header>
                        </DataTable>


                    </Surface>
                    <Surface
                        elevation={2}
                        category="medium"
                        style={{ width: '100%', height: 200 }}>

                        <DataTable>

                            <DataTable.Header>
                                <DataTable.Title textStyle={{ color: '#5a287d', fontSize: 20, fontWeight: 'bold' }}>From</DataTable.Title>
                            </DataTable.Header>

                            <DataTable.Header>
                                <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Debitor Name</DataTable.Title>
                                <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{transactions.DebtorAccount.Name}</DataTable.Title>
                            </DataTable.Header>

                            <DataTable.Header>
                                <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Account Number</DataTable.Title>
                                <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{transactions.DebtorAccount.Identification.substring(0, 8)}</DataTable.Title>
                            </DataTable.Header>
                            <DataTable.Header>
                                <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Sort Code</DataTable.Title>
                                <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{transactions.DebtorAccount.Identification.substring(8)}</DataTable.Title>
                            </DataTable.Header>
                        </DataTable>


                    </Surface>
                </View>
                {/* <View style={{
                    position: 'relative', bottom: 0, width: '100%', backgroundColor: '#D6CFC7',
                    padding: 5, alignItems: 'center', justifyContent: 'center'
                }}>
                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        //deny and allow
                        
                    </View>
                    
                </View> */}
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
        padding: 0,
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

export default ConsentInfo;