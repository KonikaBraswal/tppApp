import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {Surface} from '@react-native-material/core';
import AccountDetails from '../components/AccountDetails';
import DropdownWithCheckboxes from '../components/DropdownWithCheckboxes';
import TransactionList from '../components/TransactionList';
import SortDropdown from '../components/SortDropdown';

const MainScreen = ({route}) => {
  const accountDetails = route.params.accountDetails;
  const transactionDetails = route.params.transactionDetails;
  const balanceDetails = route.params.balanceDetails;
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        nestedScrollEnabled={true}
        style={{padding: 5, marginVertical: 8, flex: 1}}>
        <View style={styles.rowContainer}>
          <Surface elevation={6} category="medium" style={styles.surface}>
            <Image
              source={require('../assets/icons/natwest.png')}
              style={styles.icon}
            />
          </Surface>
          <DropdownWithCheckboxes />
        </View>
        <AccountDetails account={accountDetails} balance={balanceDetails} />

        <View
          style={{
            flexDirection: 'column',
            backgroundColor: '#c8e1cc',
            borderRadius: 10,
            padding: 3,
            margin: 10,
            shadowOpacity: 0.3,
            elevation: 3,
            shadowColor: '#000',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 15,
              }}>
              Transactions
            </Text>
            <SortDropdown />
          </View>
          <Searchbar
            placeholder="Search Transaction"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{
              borderRadius: 10,
              width: '95%',
              marginTop: 12,
              alignSelf: 'center',
            }}
          />
          <TransactionList transactionDetails={transactionDetails} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surface: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});

export default MainScreen;
