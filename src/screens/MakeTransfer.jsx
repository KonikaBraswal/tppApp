import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

const MakeTransfer = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    console.log('Form submitted:', {
      firstName,
      lastName,
      sortCode,
      accountNumber,
      reference,
      amount,
    });

    navigation.navigate('Consent For Payment');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              onChangeText={setFirstName}
              value={firstName}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              onChangeText={setLastName}
              value={lastName}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your account number"
              onChangeText={setAccountNumber}
              value={accountNumber}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Sort Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your sort code"
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

        <TouchableOpacity onPress={handleSubmit} style={styles.footer} activeOpacity={1}>
          <Text style={styles.footerText}>Proceed To Pay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width < 600 ? '100%' : '80%', 
    padding: 20,
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
  