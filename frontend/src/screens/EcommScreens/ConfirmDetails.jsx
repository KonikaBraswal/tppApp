
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
import ApiFactory from "../../../ApiFactory/ApiFactory";
import AndroidClient from '../../../DatabaseFactory/AndroidClientDb';
const switchEnvironment = (newEnv) => {
  global.env = newEnv; // Update the global environment variable
  const apiFactory = new ApiFactory();
  const apiClient = apiFactory.createApiClient(global.env,"vrp");
  return apiClient;
  // Use the new apiClient as needed
 };

const ConfirmDetails = ({route}) => {
  const {
    email,
    fullName,
    billingAddress,
    contactNumber,
    accountNumber,
    dob,
    totalAmount,
  } = route.params;
  console.log(accountNumber);
 const [EnvApiClient, setEnvApiClient] = useState(null);
  
  // console.log('amtt', totalAmount);
  const navigation = useNavigation();
  const scope = 'vrp';

  const [consentData, setConsentData] = useState(null);
  let androidClientVrp=new AndroidClient("NWG", "Sandbox", "vrp");
  
  useEffect(() => {
    const newApiClient = switchEnvironment(global.env);
    setEnvApiClient(newApiClient);
    const fetchData = async () => {
      try {
        const data = await androidClientVrp.fetchDataUsingScope(scope);
        // console.log("data in cart screen",data);
        if(data!==null){
          const latestObject = getObjectWithLatestCreationTime(data);
          setConsentData(latestObject);
        }else{
          console.log(`No entry found for scope ${scope}.`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      
    };
    fetchData();
  }, [scope]);

  function getObjectWithLatestCreationTime(objects) {
    const sortedArray = objects.sort(
      (a, b) =>
        new Date(JSON.parse(b.consentPayload).CreationDateTime) -
        new Date(JSON.parse(a.consentPayload).CreationDateTime),
    );
    return sortedArray[0];
  }

  // console.log(consentData);

  const handleCheckout = async () => {
    const formData = {
      firstName: 'Natwest Cart',
      sortCode: '',
      accountNumber: '50499910000996',
      reference: 'Tools',
      amount: String(totalAmount),
    };
    
    try {
      const selectconsentData = consentData;
      // console.log("consent",selectconsentData);
      const response = await EnvApiClient.refreshTokenForVRP(
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
      <ScrollView >
      <View style={styles.container}>
        <Text style={styles.confirmationText}>We have confirmed your details for this product</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Email:</Text>
          <Text style={styles.detailValue}>{email}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Name:</Text>
          <Text style={styles.detailValue}>{fullName}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Date of Birth:</Text>
          <Text style={styles.detailValue}>{dob}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Contact number:</Text>
          <Text style={styles.detailValue}>{contactNumber}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Billing Address:</Text>
          <Text style={styles.detailValue}>
          {billingAddress}
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Account Type:</Text>
          <Text style={styles.detailValue}>Current Account</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Account Details:</Text>
          <Text style={styles.detailValue}>{accountNumber}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Amount:</Text>
          <Text style={styles.detailValue}>£{totalAmount}</Text>
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
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // padding: wp('5%'),
  },
  confirmationText: {
    fontSize: wp('5.3%'),
    fontWeight: '500',
    color: '#114188',
    marginBottom: hp('3%'),
    marginTop: hp('3%'),
    textAlign: 'center',
    width: wp('80%'),
  },
  section: {
    backgroundColor: '#E9E9E9',
    padding: 16,
    borderWidth: 2,
    borderColor: '#A0A1A1',
    borderRadius: 8,
    marginBottom: hp('4%'),
  },
  sectionTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: '700',
    marginBottom: hp('3%'),
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: wp('4%'),
    color: '#535353',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: wp('4%'),
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
    fontSize: wp('4.5%'),
    fontWeight: '500',
    paddingBottom: hp('1%'),
    textAlign: 'center',
    marginTop: wp('-3%')
   
  },
  linkText: {
    color: '#0093FB',
    textDecorationLine: 'underline',
    fontWeight: '500',
    fontSize: wp('4.5%'),
    paddingBottom: hp('2%'),
  },
  buttonContainer: {
    alignItems: 'center',
},
  button: {
    backgroundColor: '#114188',
    borderRadius: wp('10%'),
    width: wp('90%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
},
  buttonText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConfirmDetails;