// src/PaymentForm.js
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import { TextInput } from '@react-native-material/core';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,ScrollView
} from 'react-native';

const CreditorDetailsforVRP = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    const formData = {
        firstName,
        // lastName,
        sortCode,
        accountNumber,
        reference,
        amount,
      };
    
      console.log('Form submitted:', formData);

    navigation.navigate('Review Creditor',{formData});
  };

  return (
    
    <View style={styles.container}>
            <ScrollView>
            <View style={{alignItems:'center'}}>
          <Text style={{fontSize:20}}>Enter creditor details</Text>
          </View>
      <View style={{padding: 20}}>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Full Name</Text>
          <TextInput  variant="outlined" label="Full Name" style={{ margin: 5 }}
            value={firstName}
            onChangeText={setFirstName}  />
        </View>
        {/* <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Last Name</Text>
          <TextInput variant="outlined" label="Last Name" style={{ margin: 1 }}
           onChangeText={setLastName} 
           value={lastName}/>
        </View> */}

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Number</Text>
          <TextInput  variant="outlined" label="Bank Account Number" style={{ margin: 1 }} 
          onChangeText={setAccountNumber} value={accountNumber}/>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sort Code</Text>
          <TextInput variant="outlined" label="Enter the sort code" style={{ margin: 1 }} onChangeText={setSortCode} value={sortCode}/>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Reference</Text>
          <TextInput variant="outlined" label="Reference" style={{ margin: 1 }} onChangeText={setReference} value={reference}/>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <TextInput  variant="outlined" label="Amount" style={{ margin: 1 }} onChangeText={setAmount} value={amount}/>
        </View>
      </View>
      </ScrollView>
      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.footer}
        activeOpacity={1}>
        <Text style={styles.footerText}>Proceed To Pay</Text>
      </TouchableOpacity>

      {/* <Button title="Proceed to Pay" onPress={handleSubmit} color="#5a287d" style/> */}
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  footer: {
    backgroundColor: '#5a287d',
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default CreditorDetailsforVRP;
