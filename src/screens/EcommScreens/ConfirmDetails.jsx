import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmDetails = ({ route }) => {
  const { email, fullName, billingAddress, contactNumber, accountNumber, dob, totalAmount } = route.params;
  const navigation = useNavigation();
  const scope = 'vrp';

  const [consentData, setConsentData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllDataforScope(scope);
        if (data !== null) {
          console.log(data);
          const latestObject = getObjectWithLatestCreationTime(data);
          setConsentData(latestObject);
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
        new Date(JSON.parse(a.consentpayload).CreationDateTime)
    );
    return sortedArray[0];
  }

  const handleCheckout = async () => {
    const formData = {
      firstName: 'Natwest Cart',
      sortCode: '',
      accountNumber: '50499910000996',
      reference: 'Tools',
      amount: String(totalAmount),
    };
    navigation.navigate('Order Placed');
  }
  //   try {
  //     const selectconsentData = consentData;
  //     const response = await sandboxApiClient.refreshToken(selectconsentData, formData);
  //     console.log('response', response);
  //     if (response.Data.Status === 'AcceptedSettlementCompleted') {
  //       navigation.navigate('Order Placed');
  //     } else {
  //       Alert.alert('Payment Failed', 'Please Try Again', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
  //     }
  //   } catch (error) {
  //     console.log('error in fetching refresh', error);
  //   }
  // };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.confirmationText}>We have confirmed your details for this product</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Details</Text>

        <View style={styles.section}>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Email:</Text>
          <Text style={styles.detailValue}>{email}</Text>
        </View>
        </View>

        <View style={styles.section}>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Name:</Text>
          <Text style={styles.detailValue}>{fullName}</Text>
        </View>
        </View>

        <View style={styles.section}>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Date of Birth:</Text>
          <Text style={styles.detailValue}>{dob}</Text>
        </View>
        </View>

        <View style={styles.section}>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Contact number:</Text>
          <Text style={styles.detailValue}>{contactNumber}</Text>
        </View>
        </View>

        <View style={styles.section}>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Billing Address:</Text>
          <Text style={styles.detailValue}>
          {billingAddress}
          </Text>
        </View>
        </View>
        
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.section}>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Account Type:</Text>
          <Text style={styles.detailValue}>Current Account</Text>
        </View>
        </View>

        <View style={styles.section}>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Account Details:</Text>
          <Text style={styles.detailValue}>{accountNumber}</Text>
        </View>
        </View>
        
        <View style={styles.section}>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Amount:</Text>
          <Text style={styles.detailValue}>£{totalAmount}</Text>
        
        </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          We treat your information in accordance with our{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCheckout}>
          <Text style={styles.buttonText}>Confirm & Checkout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#114188',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#E9E9E9',
    padding: 16,
    borderWidth: 2,
    borderColor: '#A0A1A1',
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: '700',
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#535353',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#292929',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  footer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    paddingBottom: 10,
    textAlign: 'center',
  },
  linkText: {
    color: '#0093FB',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#114188',
    borderRadius: 10,
    width: '90%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ConfirmDetails;
