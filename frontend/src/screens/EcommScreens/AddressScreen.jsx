import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



const AddressScreen = ({route}) => {

  const totalAmount = route.params.totalAmount;
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [accountNumber, setaccountNumber] = useState('');
  const [sortCode, setsortCode] = useState('');
  const [dob, setDob] = useState('');


  const [formComplete, setFormComplete] = useState(false);

  const checkFormCompletion = () => {
    if (email && fullName && billingAddress && contactNumber && accountNumber && sortCode && dob) {
      setFormComplete(true);
    } else {
      setFormComplete(false);
    }
  };


  useEffect(() => {
    checkFormCompletion();
  }, [email, fullName, billingAddress, contactNumber, accountNumber, sortCode, dob]);
  
  
  

  const handleSubmit = () => {
    console.log('Email:', email);
    console.log('Full Name:', fullName);
    console.log('Billing Address:', billingAddress);
    console.log('Contact Number:', contactNumber);
  
    navigation.navigate('Confirm Details', {
      totalAmount,
      email: email,
      fullName: fullName,
      billingAddress: billingAddress,
      contactNumber: contactNumber,
      accountNumber: accountNumber,
      sortCode: sortCode,
      dob: dob,

    });
  
    setEmail('');
    setFullName('');
    setBillingAddress('');
    setContactNumber('');
    setaccountNumber('');
    setsortCode('');
    setDob('');

  };

  
  
  return (
    <>
    <ScrollView>
    <View style={styles.container}>

      <Text style={styles.heading}><Text style={styles.icon}>&#9997;</Text>Your details</Text>

      <Text style={styles.text}>
        We just need a few details to set up your account and confirm your affordability
      </Text>

      <Text style={styles.title}>
        Get my personal details from my bank
      </Text>

      <Text style={styles.subtitle}>
        Add your account details directly from the banking data
      </Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => {
          navigation.navigate('Banklist', {totalAmount});
        }}
        activeOpacity={1}
      >
        <Text style={styles.buttonText}>Take me to my bank</Text>
      </TouchableOpacity>

      <View style={styles.line} />

      <Text style={styles.heading}>Enter manually</Text>
        
  
      <Text style={styles.label}>Email:</Text>
      
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.text}> We'll use this to send you updates on your order</Text>

<Text style={styles.label}>Full Name:</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Billing Address:</Text>
      <TextInput
        style={styles.input}
        value={billingAddress}
        onChangeText={setBillingAddress}
        multiline
      />

      <Text style={styles.label}>Contact Number:</Text>
      <TextInput
        style={styles.input}
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Account Number:</Text>
      <TextInput
        style={styles.input}
        value={accountNumber}
        onChangeText={setaccountNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Sort Code:</Text>
      <TextInput
        style={styles.input}
        value={sortCode}
        onChangeText={setsortCode}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Date of Birth:</Text>
      <TextInput
        style={styles.input}
        value={dob}
        onChangeText={setDob}
        keyboardType="phone-pad"
      />

      <View style={styles.line} />
{/* 
      <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={1}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity> */}


      <TouchableOpacity 
  style={[styles.button, formComplete ? styles.buttonEnabled : styles.buttonDisabled]}
  onPress={handleSubmit}
  activeOpacity={1}
  disabled={!formComplete}
>
  <Text style={styles.buttonText}>Confirm</Text>
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
  heading:{
    fontSize: 30,
    fontWeight: '600',
    color: '#114188',
    marginBottom: hp('1.5%')
  },
  text: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: '#114188',
    marginBottom: hp('2%'),
    textAlign: 'center'
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#114188',
    marginBottom: hp('1.5%'),
    textAlign: 'center',
    width: wp('70%')
  },
  subtitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#114188',
    marginBottom: hp('3%'), 
    textAlign: 'center'
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
    alignItems: 'center'
  },
  line: {
    width: wp('100%'),
    height: 1,
    backgroundColor: '#114188',
    marginBottom: hp('3%'),
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#373737',
    fontWeight: '500',
  },
  input: {
    borderWidth: 2,
    borderColor: '#A7ACB4',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: wp('85%'),
    fontWeight: '500'
  },
  icon: {
    fontSize: 40,
    color: '#114188',
  },
  buttonEnabled: {
    backgroundColor: '#114188',
    borderRadius: wp('10%'), 
    width: wp('90%'), 
    height: hp('6%'), 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'), 
  },
  buttonDisabled: {
    backgroundColor: '#C0C0C0', // Gray color
    borderRadius: wp('10%'), 
    width: wp('90%'), 
    height: hp('6%'), 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'), 
  },
  

});

export default AddressScreen;