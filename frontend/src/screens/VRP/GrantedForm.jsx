
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'; 
import { TextInput } from '@react-native-material/core';
import ApiFactory from '../../../ApiFactory/ApiFactory';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');


const GrantedForm = ({ route }) => {
  const {
    creditorName,
    creditorIdentification,
    sortcode,
    referencenumber,
    selectconsentData,
  } = route.params;
  const [edit, setEdit] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    setFirstName(creditorName);
    setSortCode(sortcode);
    setAccountNumber(creditorIdentification);
    setReference(referencenumber);
    console.log("passed data"+selectconsentData);
    if (creditorName && creditorIdentification && sortcode && referencenumber) {
      setEdit(false);
    }
  }, [creditorName, creditorIdentification, sortcode, referencenumber]);

  const handleSubmit = async() => {
    const formData = {
      firstName,
      sortCode,
      accountNumber,
      reference,
      amount,
    };
    try{  const response=await sandboxApiClient.refreshToken(selectconsentData,formData);
      console.log("response",response)
    }
      catch(error){
        console.log("error in fetching refresh",error);
      }
    console.log('Form submitted:', formData);

    navigation.navigate('VRP Details', { data:formData });
  };
  

  return (

    <>

    <View style={styles.container}>
      <Text style={{ color: 'black', fontSize: 20 }}>Paying {firstName}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 50 }}>£</Text>
        <TextInput
          style={{
            height: 50, // Adjusted height
            width: '80%',
            borderColor: 'gray',
            fontSize: 32, // Adjusted font size
            padding: 10,
            color: 'black',
          }}
          placeholder="Enter amount"
          keyboardType="default"
          value={amount.toString()}
          onChangeText={setAmount}
        />
      </View>
    </View>
  <TouchableOpacity
    onPress={handleSubmit}
    style={styles.footer}
    activeOpacity={1}>
    <Text style={styles.footerText}>Proceed To Pay</Text>
  </TouchableOpacity>
</>
  );
 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  input: {
    height: 200,
    width: '80%', // Adjust the width as needed
    borderColor: 'gray',
    fontSize:78, 
    padding: 10,
  }
});

export default GrantedForm;
