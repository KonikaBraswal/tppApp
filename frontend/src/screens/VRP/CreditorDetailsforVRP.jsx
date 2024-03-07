import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {TextInput} from '@react-native-material/core';
import RNPickerSelect from 'react-native-picker-select';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const CreditorDetailsforVRP = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [reference, setReference] = useState('');
  const [period, setPeriod] = useState('');
  const [perPayment, setPerPayment] = useState('');
  const [perPeriod, setPerPeriod] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const calculateExpiryDate = () => {
      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 2);

      const formattedDay = ('0' + expiryDate.getDate()).slice(-2);
      const formattedMonth = ('0' + (expiryDate.getMonth() + 1)).slice(-2);
      const formattedYear = expiryDate.getFullYear();

      const formattedExpiryDate = `${formattedDay}-${formattedMonth}-${formattedYear}`;
      setExpiryDate(formattedExpiryDate);
    };

    calculateExpiryDate();
  }, []);

  useEffect(() => {
    // Check if all required fields are filled
    const isValid =
      !!firstName &&
      !!sortCode &&
      !!accountNumber &&
      !!reference &&
      !!period &&
      !!perPayment &&
      !!perPeriod &&
      !!expiryDate;
    setIsFormValid(isValid);
  }, [
    firstName,
    sortCode,
    accountNumber,
    reference,
    period,
    perPayment,
    perPeriod,
    expiryDate,
  ]);

  const handleSubmit = () => {
    const formData = {
      firstName,
      sortCode,
      accountNumber,
      reference,
      period,
      perPeriod,
      perPayment,
      expiryDate,
    };

    console.log('Form submitted:', formData);

    navigation.navigate('Review Creditor', {formData});
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sweeping Transfer Setup</Text>

      <View style={styles.formContainer}>
        <TextInput
          variant="outlined"
          label="Payee Name"
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          variant="outlined"
          label="Account Number"
          style={styles.input}
          onChangeText={setAccountNumber}
          value={accountNumber}
        />

        <TextInput
          variant="outlined"
          label="Sort Code"
          style={styles.input}
          onChangeText={setSortCode}
          value={sortCode}
        />

        <TextInput
          variant="outlined"
          label="Reference"
          style={styles.input}
          onChangeText={setReference}
          value={reference}
        />

        <Text style={styles.title}>Payment Terms</Text>

        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={value => setPeriod(value)}
            items={[
              {label: 'Week', value: 'Week'},
              {label: 'Month', value: 'Month'},
              {label: 'Year', value: 'Year'},
            ]}
            value={period}
            placeholder={{label: 'Select period type', value: null}}
          />
        </View>

        <View style={styles.line}></View>
        <TextInput
          variant="outlined"
          label="Max Amount Per Period"
          style={styles.input}
          onChangeText={setPerPeriod}
          value={perPeriod}
        />

        <TextInput
          variant="outlined"
          label="Max Amount Per Payment"
          style={styles.input}
          onChangeText={setPerPayment}
          value={perPayment}
        />

        <TextInput
          variant="outlined"
          label="Expiry Date"
          style={styles.input}
          value={expiryDate}
          editable={false}
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.button, {opacity: isFormValid ? 1 : 0.5}]}
        activeOpacity={isFormValid ? 0.8 : 1}
        disabled={!isFormValid}>
        <Text style={styles.buttonText}>Proceed To Pay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    width: '92%',
    borderRadius: 5,
    position: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    marginBottom: 15,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#5a287d',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreditorDetailsforVRP;
