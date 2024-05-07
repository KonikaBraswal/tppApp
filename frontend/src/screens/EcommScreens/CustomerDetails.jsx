import React from 'react';
import { Image } from "react-native-elements";
import { Button, Icon } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import DataTable from "react-native-paper";
import { Text } from "react-native-paper";
import { Surface } from '@react-native-material/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const CustomerDetails = ({ route }) => {
    const { customerDetails } = route.params;
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/ecomm-images/customer.png')} style={styles.image}
                resizeMethod="resize"></Image>
            <View>
                <Text style={styles.title}>
                    Your data has been shared
                </Text>
            </View>
            <View style={styles.box}>
                <MaterialCommunityIcons name="home" color='#D0B1E6' size={28} />
                <View style={styles.addressContainer} >
                    <Text style={styles.addressText}>{customerDetails.data.address.residence.line1},{customerDetails.data.address.residence.line2},</Text>
                    {/* <Text style={styles.addressText}></Text> */}
                    <Text style={styles.addressText}>{customerDetails.data.address.residence.line3},</Text>
                    <Text style={styles.addressText}>{customerDetails.data.address.residence.line4},</Text>
                    <Text style={styles.addressText}>{customerDetails.data.address.residence.postcode},</Text>
                </View>
            </View>
            <View style={styles.box}>
                <MaterialCommunityIcons name="email" color='#D0B1E6' size={28} />
                <View style={styles.addressContainer} >
                    <Text style={styles.addressText}>{customerDetails.data.contactDetails.email}</Text>
                </View>
            </View>
            <View style={styles.box}>
                <MaterialCommunityIcons name="cellphone" color='#D0B1E6' size={28} />
                <View style={styles.addressContainer} >
                    <Text style={styles.addressText}>{customerDetails.data.contactDetails.mobile_phone_number}</Text>
                </View>
            </View>
            <View >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Confirm Details');
                    }}
                    style={styles.footer}
                    activeOpacity={1}>
                    <Text style={styles.footerText}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    
    section: {
        marginBottom: 10,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
        color:'black',
    },
    addressText: {
        textAlign: 'center',
        color:'black',
        // fontSize: 16,
        // marginBottom: 5,
    },
    addressContainer: {
        marginLeft: 10,
        flexShrink: 1, // Allow text to wrap within the container
    },
    box: {
        // flex:1,
        alignItems: 'center',
        borderRadius: 4,
        borderColor: '#EDDDF3',
        padding: 10,
        margin: 8,
        borderWidth: 3,
        flexDirection: 'row',
        backgroundColor: 'white',
        width: 330,

    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    container: {
        flex: 1,
        padding: 10,
        // alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
    },
    image: {
        width: '100%',
        height: 300,
        // aspectRatio:1,
        // marginTop: -hp('60%'),
        resizeMode: 'cover',
        borderRadius: 8,
        marginBottom: 20,
        // marginLeft: hp('7%'),
        // marginRight: -hp('6%')
    },
    footer: {
        // backgroundColor: '#D0B1E6',
        borderColor: '#EDDDF3',
        padding: wp('2%'),
        alignItems: 'center',
        width: '100%',
        borderWidth: 3,
        borderRadius:4
    },
    footerText: {
       
        color: 'black',
        fontWeight: 'bold',
        fontSize: wp('5%'),
    },
});

export default CustomerDetails;