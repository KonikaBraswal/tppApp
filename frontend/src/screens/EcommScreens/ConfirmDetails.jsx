import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchAllDataforScope} from '../../../database/Database';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

const ConfirmDetails = ({route}) => {
  const {
    email,
    fullName,
    billingAddress,
    contactNumber,
    accountNumber,
    sortCode,
  } = route.params;

  const navigation = useNavigation();
  const scope = 'vrp';
  const [consentData, setConsentData] = useState([]);

  useEffect(() => {
    fetchAllDataforScope(scope)
      .then(data => {
        if (data !== null) {
          setConsentData(data);
        } else {
          console.log(`No entry found for scope ${scope}.`);
        }
      })
      .catch(error => {
        console.error('Error fetching Consent data:', error);
      });
  }, [scope]);

  const findDataByConsentId = consentId => {
    console.log(typeof consentId + typeof consentData[0].consentid);

    return consentData.find(consent => consent.consentid === consentId);
  };

  const getConsentData = async () => {
    try {
      const EcommConsentId = await AsyncStorage.getItem('EcommConsentId');
      if (EcommConsentId !== null) {
        EcommConsentData = findDataByConsentId(JSON.parse(EcommConsentId));
        console.log('EcommConsentData', EcommConsentData);
        return EcommConsentData;
      } else {
        console.log('EcommConsentData not found');
      }
    } catch (error) {
      console.error('Error retrieving EcommConsentData:', error);
    }
  };

  const handleCheckout = async () => {
    const formData = {
      firstName: 'Natwest Cart',
      sortCode: '',
      accountNumber: '50499910000996',
      reference: 'Tools',
      amount: '9.00',
    };
    try {
      const selectconsentData = await getConsentData();
      const response = await sandboxApiClient.refreshToken(
        selectconsentData,
        formData,
      );
      console.log('response', response);
      if (response.Data.Status === 'AcceptedSettlementCompleted') {
        navigation.navigate('Order Placed');
      } else {
        Alert.alert('Payment Failed', 'Please Try Again', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      }
    } catch (error) {
      console.log('error in fetching refresh', error);
    }
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.heading}>Your details</Text>

          <Text style={styles.text}>
            We have confirmed your details for this product
          </Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.input}>{email}</Text>

          <Text style={styles.subtext}>
            We'll use this to send you updates on your order
          </Text>

          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.input}>{fullName}</Text>

          <Text style={styles.label}>Billing Address:</Text>
          <Text style={styles.input}>{billingAddress}</Text>

          <Text style={styles.label}>Contact Number:</Text>
          <Text style={styles.input}>{contactNumber}</Text>

          <Text style={styles.label}>Account Number:</Text>
          <Text style={styles.input}>{accountNumber}</Text>

          {/* <Text style={styles.label}>Sort Code:</Text>
            <Text style={styles.input}>{sortCode}</Text> */}

          <Text style={styles.subtext}>
            We treat your information in accordance with our
          </Text>
          <Text style={styles.hyperlink}>Privacy policy</Text>

          <View style={styles.line} />

          <TouchableOpacity
            style={styles.button}
            onPress={handleCheckout}
            activeOpacity={1}>
            <Text style={styles.buttonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp('5%'),
  },
  heading: {
    fontSize: 30,
    fontWeight: '600',
    color: '#114188',
    marginBottom: hp('1.5%'),
  },
  text: {
    fontSize: wp('5%'),
    fontWeight: '500',
    color: '#114188',
    marginBottom: hp('2%'),
    textAlign: 'center',
    width: wp('80%'),
  },
  subtext: {
    fontSize: wp('4%'),
    fontWeight: '500',
    paddingBottom: hp('1%'),
  },
  hyperlink: {
    color: '#0093FB',
    textDecorationLine: 'underline',
    fontWeight: '500',
    fontSize: wp('4%'),
    paddingBottom: hp('1%'),
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#474747',
    fontWeight: '500',
  },
  input: {
    borderWidth: 2,
    borderColor: '#C6C9CE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: wp('90%'),
    fontWeight: '500',
    textAlign: 'center',
    color: 'black',
  },
  button: {
    backgroundColor: '#114188',
    borderRadius: wp('10%'),
    width: wp('90%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  buttonText: {
    fontSize: wp('4.4%'),
    fontWeight: 'bold',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: wp('100%'),
    height: 1,
    backgroundColor: '#114188',
    marginBottom: hp('3%'),
  },
});

export default ConfirmDetails;
