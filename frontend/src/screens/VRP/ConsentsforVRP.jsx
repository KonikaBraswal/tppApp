//todo
// add search logic based on vrpid
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableHighlight,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Searchbar,
  Icon,
  Button,
} from 'react-native-paper';
import { Surface,Stack } from '@react-native-material/core';
import readNatwestAccount from '../../assets/data/accounts.json';
import readNatwestBalance from '../../assets/data/balances.json';
import readBarclaysAccount from '../../assets/data/barclaysAccounts.json';
import readBarclaysBalance from '../../assets/data/barclaysBalances.json';
import readdata from '../../assets/data/VRP.json';
//reading data from json file for now
const ConsentsforVRP= () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const NatwestAccountData = readNatwestAccount?.Data?.Account;
  const NatwestBalanceData = readNatwestBalance?.Data?.Balance;
  const BarclaysAccountData = readBarclaysAccount?.Data?.Account;
  const BarclaysBalanceData = readBarclaysBalance?.Data?.Balance;
  const mergedAccounts = [...NatwestAccountData, ...BarclaysAccountData];
  const mergedBalances = [...NatwestBalanceData, ...BarclaysBalanceData];

  const filteredAccounts = mergedAccounts.filter(account =>
    account.AccountId.includes(searchQuery),
  );
  const findAccountBalances = accountId => {
    const foundBalances = mergedBalances.filter(
      balance => balance.AccountId === accountId,
    );

    if (foundBalances.length > 0) {
      return foundBalances;
    } else {
      return null;
    }
  };
  const handleSubmit = () => {
    const creditorName = readdata.Data.Instruction.CreditorAccount.Name;
    const creditorIdentification = readdata.Data.Instruction.CreditorAccount.Identification;
    const sortcode='123456';
    const referencenumber=readdata.Data.Initiation.RemittanceInformation.Reference;
    navigation.navigate('GrantedForm', {
      creditorName,
      creditorIdentification,
     sortcode,
     referencenumber
    });
    // navigation.navigate('GrantedForm');

  };
  return (
    <ScrollView>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <View
        style={{
          backgroundColor: '#5a287d',
          padding: 10,
        }}>
        <Searchbar
          placeholder="Search account by ID"
          onChangeText={setSearchQuery}
          value={searchQuery}
          icon={() => <Icon source="magnify" color="black" size={20} />}
          style={{
            borderRadius: 5,
            backgroundColor: '#f4ebfe',
          }}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <View style={styles.rowContainer}>
            <View style={styles.searchBarContainer}></View>
          </View>
          <Stack fill center spacing={4}>
          <View style={{ flex: 1, width: '100%' }}>
  <TouchableHighlight>
    <View style={{ width: '100%', height: '100%' }}>
      <Surface elevation={2} category="medium">
        <Text>{readdata.Data.Instruction.CreditorAccount.Name}</Text>
        <Text>{readdata.Data.Instruction.CreditorAccount.Identification}</Text>
        <Text>{readdata.Data.Instruction.InstructedAmount.Amount + " " + readdata.Data.Instruction.InstructedAmount.Currency + " "}</Text>
        <View style={{alignItems:'center'}}>
        <Button  mode="contained" style={{width:'50%',backgroundColor:'#c8e1cc'}} labelStyle={{color:'green'}} 
        onPress={handleSubmit}>
       Pay Now
      </Button>
      </View>
      </Surface>
    </View>
  </TouchableHighlight>
</View>
<View style={{ flex: 1, width: '100%' }}>
  <TouchableHighlight>
    <View style={{ width: '100%', height: '100%' }}>
      <Surface elevation={2} category="medium">
        <Text>{readdata.Data.Instruction.CreditorAccount.Name}</Text>
        <Text>{readdata.Data.Instruction.CreditorAccount.Identification}</Text>
        <Text>{readdata.Data.Instruction.InstructedAmount.Amount + " " + readdata.Data.Instruction.InstructedAmount.Currency + " "}</Text>
        <View style={{alignItems:'center'}}>
        <Button  mode="contained" style={{width:'50%',backgroundColor:'#c8e1cc'}} labelStyle={{color:'green'}}>
       Pay Now
      </Button>
      </View>
      </Surface>
    </View>
  </TouchableHighlight>
</View>
<View style={{ flex: 1, width: '100%' }}>
  <TouchableHighlight>
    <View style={{ width: '100%', height: '100%'}}>
      <Surface elevation={2} category="medium">
        <Text>{readdata.Data.Instruction.CreditorAccount.Name}</Text>
        <Text>{readdata.Data.Instruction.CreditorAccount.Identification}</Text>
        <Text>{readdata.Data.Instruction.InstructedAmount.Amount + " " + readdata.Data.Instruction.InstructedAmount.Currency + " "}</Text>
        <View style={{alignItems:'center'}}>
        <Button  mode="contained" style={{width:'50%',backgroundColor:'#c8e1cc'}} labelStyle={{color:'green'}}>
       Pay Now
      </Button>
      </View>
      </Surface>
    </View>
  </TouchableHighlight>
</View>
  </Stack>
        </View>
        <Button  mode="contained" style={{width:'50%',backgroundColor:'#5a287d',margin:15,height:50}} 
        labelStyle={{color:'white',fontSize:18,flex:1,alignItems:'center' }} onPress={()=>{navigation.navigate('CreditorDetails')}}>
       Start a new VRP
      </Button>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Select Your Bank');
          }}
          style={styles.footer}
          activeOpacity={1}>
          <Text style={styles.footerText}>Add New Bank Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  searchBar: {
    height: 62,
    borderRadius: 0,
    width: 373,
  },
  searchBarContainer: {margin: 2},
  scrollContainer: {
    flex: 1,
    padding: 2,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#c8e1cc',
  },
  surface: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  iconNatwest: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  iconBarclays: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default ConsentsforVRP;
