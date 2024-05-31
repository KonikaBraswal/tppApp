import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchAllDataforScope } from '../../../database/Database';
import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
import { ScrollView } from 'react-native-gesture-handler';

const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

const CustomerDetails = ({ route }) => {
  const { customerDetails, totalAmount } = route.params;
  const navigation = useNavigation();
  const [debitorDetails, setDebitorDetails] = useState(null);
  const scope = 'vrp';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllDataforScope(scope);
        if (data && data.length > 0) {
          const latestObject = getObjectWithLatestCreationTime(data);
          if (latestObject && latestObject.vrppayload) {
            const parsedPayload = JSON.parse(latestObject.vrppayload);
            if (parsedPayload && parsedPayload.DebtorAccount) {
              setDebitorDetails(parsedPayload.DebtorAccount);
            } else {
              console.log('No DebtorAccount found in vrppayload.');
            }
          } else {
            console.log('No valid latest object or vrppayload.');
          }
        } else {
          console.log(`No entry found for scope ${scope}.`);
        }
      } catch (error) {
        console.error('Error fetching Consent data:', error);
      }
    };
    fetchData();
  }, [scope]);

  function getObjectWithLatestCreationTime(objects) {
    const sortedArray = objects.sort(
      (a, b) =>
        new Date(JSON.parse(b.consentpayload).CreationDateTime) -
        new Date(JSON.parse(a.consentpayload).CreationDateTime),
    );
    return sortedArray[0];
  }

  console.log(debitorDetails);

  return (
    <ScrollView>
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/ecomm-images/customer.png')}
        style={styles.image}
        resizeMethod="resize"
      />
      <View>
        <Text style={styles.title}>Your data has been shared</Text>
      </View>
      <View style={styles.box}>
        <MaterialCommunityIcons name="home" color="#D0B1E6" size={28} />
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>
            {customerDetails.data.address.residence.line1},
            {customerDetails.data.address.residence.line2},
          </Text>
          <Text style={styles.addressText}>
            {customerDetails.data.address.residence.line3},
          </Text>
          <Text style={styles.addressText}>
            {customerDetails.data.address.residence.line4},
          </Text>
          <Text style={styles.addressText}>
            {customerDetails.data.address.residence.postcode},
          </Text>
        </View>
      </View>
      <View style={styles.box}>
        <MaterialCommunityIcons name="email" color="#D0B1E6" size={28} />
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>
            {customerDetails.data.contactDetails.email}
          </Text>
        </View>
      </View>
      <View style={styles.box}>
        <MaterialCommunityIcons name="cellphone" color="#D0B1E6" size={28} />
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>
            {customerDetails.data.contactDetails.mobile_phone_number}
          </Text>
        </View>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Confirm Details', {
              totalAmount,
              email: customerDetails.data.contactDetails.email,
              fullName: customerDetails.data.name.full_name,
              billingAddress:
                customerDetails.data.address.residence.line1 +
                ' , ' +
                customerDetails.data.address.residence.line2 +
                ' , ' +
                customerDetails.data.address.residence.line3 +
                ',' +
                customerDetails.data.address.residence.line4 +
                ',' +
                customerDetails.data.address.residence.postcode,
              contactNumber:
                customerDetails.data.contactDetails.mobile_phone_number,
              accountNumber: debitorDetails ? debitorDetails.Identification : '',
              sortCode: '',
              dob: customerDetails.data.birthdate.substring(0, 10)
            });
          }}
          style={styles.footer}
          activeOpacity={1}>
          <Text style={styles.footerText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
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
    color: 'black',
  },
  addressText: {
    textAlign: 'center',
    color: 'black',
  },
  addressContainer: {
    marginLeft: 10,
    flexShrink: 1,
  },
  box: {
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
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 20,
  },
  footer: {
    borderColor: '#EDDDF3',
    padding: 10,
    alignItems: 'center',
    width: '100%',
    borderWidth: 3,
    borderRadius: 4,
  },
  footerText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default CustomerDetails;
