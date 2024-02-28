// src/PaymentForm.js
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'; // Import useEffect and useState
import { TextInput } from '@react-native-material/core';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

// Remove this line, as setedit is not used and causes an error
// const [edit, setedit] = useState(true);
const OldForm = ({ route }) => {
  const { creditorName, creditorIdentification, sortcode, referencenumber } = route.params ||{};
  const [edit, setEdit] = useState(true); // Corrected the variable name
  const [fullName, setFullName] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    setFullName(creditorName);
    setSortCode(sortcode);
    setAccountNumber(creditorIdentification);
    setReference(referencenumber);
    if (creditorName && creditorIdentification && sortcode && referencenumber) {
      setEdit(false);
    }
  }, [creditorName, creditorIdentification, sortcode, referencenumber]);

  const handleSubmit = () => {
    const formData = {
      fullName,
      sortCode,
      accountNumber,
      reference,
      amount,
    };

    console.log('Form submitted:', formData);

    navigation.navigate('Consent for VRP', { formData });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{alignItems:'center'}}>
          <Text>Please enter amount</Text>
          </View>
        <View style={{ padding: 20 }}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Full Name</Text>
            <View style={{ margin: 1, backgroundColor: edit ? 'white' : '#F5F5F5', borderRadius: 5 }}>
            <TextInput
              variant="contained"
              label="Full Name"
              style={{ margin: 1, backgroundColor: edit ? 'white' : 'gray' }}
              value={fullName}
              onChangeText={setFullName}
              editable={edit}
            />
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Account Number</Text>
            <TextInput
              variant="outlined"
              label="Bank Account Number"
              style={{ margin: 1, backgroundColor: edit ? 'white' : 'gray' }}
              onChangeText={setAccountNumber}
              value={accountNumber}
              editable={edit}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Sort Code</Text>
            <TextInput
              variant="outlined"
              label="Enter the sort code"
              style={{ margin: 1, backgroundColor: edit ? 'white' : 'gray' }}
              onChangeText={setSortCode}
              value={sortCode}
              editable={edit}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Reference</Text>
            <TextInput
              variant="outlined"
              label="Reference"
              style={{ margin: 1, backgroundColor: edit ? 'white' : 'gray' }}
              onChangeText={setReference}
              value={reference}
              editable={edit}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Amount</Text>
            <TextInput
              variant="outlined"
              label="Amount"
              editable={true}
              style={{ margin: 1, backgroundColor: edit ? 'white' : 'gray' }}
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

export default OldForm;
