// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
// import {fetchAllDataforScope} from '../../../database/Database';
// const apiFactory = new ApiFactory();
// const sandboxApiClient = apiFactory.createApiClient('sandbox');

// const ConfirmDetails = ({route}) => {
//   const {
//     email,
//     fullName,
//     billingAddress,
//     contactNumber,
//     accountNumber,
//     sortCode,
//   } = route.params;

//   const navigation = useNavigation();
//   const scope = 'vrp';

//   const [consentData, setConsentData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       fetchAllDataforScope(scope)
//         .then(data => {
//           if (data !== null) {
//             console.log(data);
//             const latestObject = getObjectWithLatestCreationTime(data);
//             setConsentData(latestObject);
//           } else {
//             console.log(`No entry found for scope ${scope}.`);
//           }
//         })
//         .catch(error => {
//           console.error('Error fetching Consent data:', error);
//         });
//     };
//     fetchData();
//   }, [scope]);

//   function getObjectWithLatestCreationTime(objects) {
//     const sortedArray = objects.sort(
//       (a, b) =>
//         new Date(JSON.parse(b.consentpayload).CreationDateTime) -
//         new Date(JSON.parse(a.consentpayload).CreationDateTime),
//     );
//     return sortedArray[0];
//   }

//   console.log(consentData);

//   const handleCheckout = async () => {
//     const formData = {
//       firstName: 'Natwest Cart',
//       sortCode: '',
//       accountNumber: '50499910000996',
//       reference: 'Tools',
//       amount: '9.00',
//     };
//     try {
//       const selectconsentData = consentData;
//       const response = await sandboxApiClient.refreshToken(
//         selectconsentData,
//         formData,
//       );
//       console.log('response', response);
//       if (response.Data.Status === 'AcceptedSettlementCompleted') {
//         navigation.navigate('Order Placed');
//       } else {
//         Alert.alert('Payment Failed', 'Please Try Again', [
//           {text: 'OK', onPress: () => console.log('OK Pressed')},
//         ]);
//       }
//     } catch (error) {
//       console.log('error in fetching refresh', error);
//     }
//   };

//   return (
//     <>
//       <ScrollView>
//         <View style={styles.container}>
//           <Text style={styles.heading}>Your details</Text>

//           <Text style={styles.text}>
//             We have confirmed your details for this product
//           </Text>

//           <Text style={styles.label}>Email:</Text>
//           <Text style={styles.input}>{email}</Text>

//           <Text style={styles.subtext}>
//             We'll use this to send you updates on your order
//           </Text>

//           <Text style={styles.label}>Full Name:</Text>
//           <Text style={styles.input}>{fullName}</Text>

//           <Text style={styles.label}>Billing Address:</Text>
//           <Text style={styles.input}>{billingAddress}</Text>

//           <Text style={styles.label}>Contact Number:</Text>
//           <Text style={styles.input}>{contactNumber}</Text>

//           <Text style={styles.label}>Account Number:</Text>
//           <Text style={styles.input}>{accountNumber}</Text>

//           {/* <Text style={styles.label}>Sort Code:</Text>
//             <Text style={styles.input}>{sortCode}</Text> */}

//           <Text style={styles.subtext}>
//             We treat your information in accordance with our
//           </Text>
//           <Text style={styles.hyperlink}>Privacy policy</Text>

//           <View style={styles.line} />

//           <TouchableOpacity
//             style={styles.button}
//             onPress={handleCheckout}
//             activeOpacity={1}>
//             <Text style={styles.buttonText}>Checkout</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: wp('5%'),
//   },
//   heading: {
//     fontSize: 30,
//     fontWeight: '600',
//     color: '#114188',
//     marginBottom: hp('1.5%'),
//   },
//   text: {
//     fontSize: wp('5%'),
//     fontWeight: '500',
//     color: '#114188',
//     marginBottom: hp('2%'),
//     textAlign: 'center',
//     width: wp('80%'),
//   },
//   subtext: {
//     fontSize: wp('4%'),
//     fontWeight: '500',
//     paddingBottom: hp('1%'),
//   },
//   hyperlink: {
//     color: '#0093FB',
//     textDecorationLine: 'underline',
//     fontWeight: '500',
//     fontSize: wp('4%'),
//     paddingBottom: hp('1%'),
//   },
//   label: {
//     fontSize: 14,
//     marginBottom: 5,
//     color: '#474747',
//     fontWeight: '500',
//   },
//   input: {
//     borderWidth: 2,
//     borderColor: '#C6C9CE',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 15,
//     fontSize: 16,
//     width: wp('90%'),
//     fontWeight: '500',
//     textAlign: 'center',
//     color: 'black',
//   },
//   button: {
//     backgroundColor: '#114188',
//     borderRadius: wp('10%'),
//     width: wp('90%'),
//     height: hp('6%'),
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: hp('2%'),
//   },
//   buttonText: {
//     fontSize: wp('4.4%'),
//     fontWeight: 'bold',
//     color: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   line: {
//     width: wp('100%'),
//     height: 1,
//     backgroundColor: '#114188',
//     marginBottom: hp('3%'),
//   },
// });

// export default ConfirmDetails;




// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
// import {fetchAllDataforScope} from '../../../database/Database';
// const apiFactory = new ApiFactory();
// const sandboxApiClient = apiFactory.createApiClient('sandbox');

// // const ConfirmDetails = ({route}) => {
// //   const {
// //     email,
// //     fullName,
// //     billingAddress,
// //     contactNumber,
// //     accountNumber,
// //     dob,
// //     totalAmount
// //   } = route.params;

// //   console.log('amtt', totalAmount);

//   const ConfirmDetails = ({route}) => {
//     const {
//       email,
//       fullName,
//       billingAddress,
//       contactNumber,
//       accountNumber,
//       dob
//     } = route.params;
  

//   const navigation = useNavigation();
//   const scope = 'vrp';

//   const [consentData, setConsentData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       fetchAllDataforScope(scope)
//         .then(data => {
//           if (data !== null) {
//             console.log(data);
//             const latestObject = getObjectWithLatestCreationTime(data);
//             setConsentData(latestObject);
//           } else {
//             console.log(`No entry found for scope ${scope}.`);
//           }
//         })
//         .catch(error => {
//           console.error('Error fetching Consent data:', error);
//         });
//     };
//     fetchData();
//   }, [scope]);

//   function getObjectWithLatestCreationTime(objects) {
//     const sortedArray = objects.sort(
//       (a, b) =>
//         new Date(JSON.parse(b.consentpayload).CreationDateTime) -
//         new Date(JSON.parse(a.consentpayload).CreationDateTime),
//     );
//     return sortedArray[0];
//   }

//   console.log(consentData);

//   const handleCheckout = async () => {
//     const formData = {
//       firstName: 'Natwest Cart',
//       sortCode: '',
//       accountNumber: '50499910000996',
//       reference: 'Tools',
//       // amount: String(totalAmount),
//       amount: '£95.00',
//     };
//     try {
//       const selectconsentData = consentData;
//       const response = await sandboxApiClient.refreshToken(
//         selectconsentData,
//         formData,
//       );
//       console.log('response', response);
//       if (response.Data.Status === 'AcceptedSettlementCompleted') {
//         navigation.navigate('Order Placed');
//       } else {
//         Alert.alert('Payment Failed', 'Please Try Again', [
//           {text: 'OK', onPress: () => console.log('OK Pressed')},
//         ]);
//       }
//     } catch (error) {
//       console.log('error in fetching refresh', error);
//     }
//   };

//   return (
//         <>
//       <ScrollView >
//       <View style={styles.container}>
//         <Text style={styles.confirmationText}>We have confirmed your details for this product</Text>
//       </View>
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Customer Details</Text>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.detailText}>Email:</Text>
//           <Text style={styles.detailValue}>{email}</Text>
//         </View>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.detailText}>Name:</Text>
//           <Text style={styles.detailValue}>{fullName}</Text>
//         </View>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.detailText}>Date of Birth:</Text>
//           <Text style={styles.detailValue}>{dob}</Text>
//         </View>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.detailText}>Contact number:</Text>
//           <Text style={styles.detailValue}>{contactNumber}</Text>
//         </View>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.detailText}>Billing Address:</Text>
//           <Text style={styles.detailValue}>
//           {billingAddress}
//           </Text>
//         </View>
//       </View>
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Payment Details</Text>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.detailText}>Account Type:</Text>
//           <Text style={styles.detailValue}>Current Account</Text>
//         </View>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.detailText}>Account Details:</Text>
//           <Text style={styles.detailValue}>{accountNumber}</Text>
//         </View>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.detailText}>Amount:</Text>
//           {/* <Text style={styles.detailValue}>£{totalAmount}</Text> */}
//           <Text style={styles.detailValue}>£95.00</Text>
//         </View>
//       </View>
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>
//           We treat your information in accordance with our{' '}
//           <Text style={styles.linkText}>Privacy Policy</Text>
//         </Text>
//       </View>
//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.button} onPress={handleCheckout}>
//                     <Text style={styles.buttonText}>Confirm & Checkout</Text>
//                 </TouchableOpacity>
//             </View>
//     </ScrollView>
//     </>

//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     // padding: wp('5%'),
//   },
//   confirmationText: {
//     fontSize: wp('5.3%'),
//     fontWeight: '500',
//     color: '#114188',
//     marginBottom: hp('3%'),
//     marginTop: hp('3%'),
//     textAlign: 'center',
//     width: wp('80%'),
//   },
//   section: {
//     backgroundColor: '#E9E9E9',
//     padding: 16,
//     borderWidth: 2,
//     borderColor: '#A0A1A1',
//     borderRadius: 8,
//     marginBottom: hp('4%'),
//   },
//   sectionTitle: {
//     fontSize: 20,
//     color: 'black',
//     fontWeight: '700',
//     marginBottom: hp('3%'),
//   },
//   detailsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   detailText: {
//     fontSize: wp('4%'),
//     color: '#535353',
//     fontWeight: '500',
//   },
//   detailValue: {
//     fontSize: wp('4%'),
//     color: '#292929',
//     fontWeight: '600',
//     maxWidth: '60%',
//     textAlign: 'right',
//   },
//   footer: {
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   footerText: {
//     fontSize: wp('4.5%'),
//     fontWeight: '500',
//     paddingBottom: hp('1%'),
//     textAlign: 'center',
//     marginTop: wp('-3%')
   
//   },
//   linkText: {
//     color: '#0093FB',
//     textDecorationLine: 'underline',
//     fontWeight: '500',
//     fontSize: wp('4.5%'),
//     paddingBottom: hp('2%'),
//   },
//   buttonContainer: {
//     alignItems: 'center',
// },
//   button: {
//     backgroundColor: '#114188',
//     borderRadius: wp('10%'),
//     width: wp('90%'),
//     height: hp('5%'),
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: hp('1%'),
// },
//   buttonText: {
//     fontSize: wp('4.5%'),
//     fontWeight: '600',
//     color: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ConfirmDetails;

import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

const ConfirmDetails = ({ route }) => {
  const { email, fullName, billingAddress, contactNumber, accountNumber, dob, totalAmount } = route.params;
  const navigation = useNavigation();
  const scope = 'vrp';

  const [consentData, setConsentData] = useState(null);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem('consentData');
        if (data !== null) {
          console.log(data);
          // const latestObject = getObjectWithLatestCreationTime(data);
          setConsentData(data);
        } else {
          console.log(`No entry found for scope ${scope}.`);
        }
      } catch (error) {
        console.error('Error fetching Consent data:', error);
      }
    };
    fetchData();
  }, [scope]);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await fetchAllDataforScope(scope);
  //       if (data !== null) {
  //         console.log(data);
  //         const latestObject = getObjectWithLatestCreationTime(data);
  //         setConsentData(latestObject);
  //       } else {
  //         console.log(`No entry found for scope ${scope}.`);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching Consent data:', error);
  //     }
  //   };
  //   fetchData();
  // }, [scope]);

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
    // navigation.navigate('Order Placed');

   
 
  // const consentData= await AsyncStorage.getItem('consentData')
  // console.log(consentData);

   try {
      const selectconsentData = JSON.parse(consentData);
      console.log('consenttt Dattaa', selectconsentData.refreshedtoken);
      const response = await sandboxApiClient.refreshToken(selectconsentData, formData);
      console.log('response', response);
      if (response.Data.Status === 'AcceptedSettlementCompleted') {
        navigation.navigate('Order Placed');
      } else {
        Alert.alert('Payment Failed', 'Please Try Again', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
      }
    } catch (error) {
      console.log('error in fetching refresh', error);
    }
  };

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
