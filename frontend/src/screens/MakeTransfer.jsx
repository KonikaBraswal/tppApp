// src/PaymentForm.js
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const MakeTransfer = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('ACME');
  const [lastName, setLastName] = useState('DIY');
  const [sortCode, setSortCode] = useState('12345678');
  const [accountNumber, setAccountNumber] = useState('BE56456394728288');
  const [reference, setReference] = useState('Tools');
  const [amount, setAmount] = useState('1.00');

  const handleSubmit = () => {
    console.log('Form submitted:', {
      firstName,
      lastName,
      sortCode,
      accountNumber,
      reference,
      amount,
    });

    navigation.navigate('PISP', {
      FirstName: firstName,
      LastName: lastName,
      SortCode: sortCode,
      AccountNumber: accountNumber,
      Reference: reference,
      Amount: amount,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{padding: 20}}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter creditor's first name"
              onChangeText={setFirstName}
              value={firstName}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter creditor's last name"
              onChangeText={setLastName}
              value={lastName}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter creditor's account number"
              onChangeText={setAccountNumber}
              value={accountNumber}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Sort Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter creditor's sort code"
              onChangeText={setSortCode}
              value={sortCode}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Reference</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a reference"
              onChangeText={setReference}
              value={reference}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the payment amount"
              onChangeText={setAmount}
              value={amount}
            />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.footer}
        activeOpacity={1}>
        <Text style={styles.footerText}>Proceed To Pay</Text>
      </TouchableOpacity>
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

export default MakeTransfer;
