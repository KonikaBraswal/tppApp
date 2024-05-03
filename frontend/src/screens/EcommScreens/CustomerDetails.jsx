import React from 'react';
import { Image } from "react-native-elements";
import { Button, Icon } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import DataTable from "react-native-paper";
import { Text } from "react-native-paper";
import { Surface } from '@react-native-material/core';


const CustomerDetails = ({ route }) => {
    const { customerDetails } = route.params;
    const click=()=>{
        // const p=JSON.parse(customerDetails);
        console.log(customerDetails.data.address);
    }
    return (
        <View>
            <Image source={require('../../assets/images/ecomm-images/customer.jpeg')} style={styles.image}
            resizeMethod="resize"></Image>
            <Button onPress={click}>press</Button>
            <Text>
                Your data has been shared
            </Text>
            <View
      style={[
        styles.container,
        {
          // Try setting `flexDirection` to `"row"`.
          flexDirection: 'row',
        },
      ]}>
       <View style={styles.section}>
                <Text style={styles.label}>Mobile</Text>
                <Text>{customerDetails.contactDetails}</Text>
            </View>
      <View style={{flex: 2, backgroundColor: 'darkorange'}} />
      <View style={{flex: 3, backgroundColor: 'green'}} />
    </View> 

        </View>
    );
};

const styles=StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
    image: {
        width: '100%',
        height: 300,
        // aspectRatio:1,
        // marginTop: -hp('60%'),
        resizeMode: 'cover',
        borderRadius: 8,
        marginBottom: 8,
        // marginLeft: hp('7%'),
        // marginRight: -hp('6%')
      },
});

export default CustomerDetails;