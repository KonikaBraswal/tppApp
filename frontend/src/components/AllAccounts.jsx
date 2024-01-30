import React, {useEffect, useState} from 'react';
import {Checkbox, Icon} from 'react-native-paper';
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {ListItem, Button, Surface} from '@react-native-material/core';
import BarclaysComponent from './AccountLists/BarclaysAccounts';
import NatwestAccounts from './AccountLists/NatwestAccounts';
import BarclaysAccounts from './AccountLists/BarclaysAccounts';
import LloydsAccounts from './AccountLists/LloydsAccounts';
import MonzoAccounts from './AccountLists/MonzoAccounts';
import SantanderAccounts from './AccountLists/SantanderAccounts';
import StarlingAccounts from './AccountLists/StarlingAccounts';
import RevolutAccounts from './AccountLists/RevolutAccounts';

const AllAccounts = ({route}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [checkedBanks, setCheckedBanks] = useState({
    natwest: false,
    barclays: false,
    lloyds: false,
    santander: false,
    starling: false,
    revolut: false,
    monzo: false,
  });

  const banks = [
    'Natwest',
    'Barclays',
    'Lloyds',
    'Santander',
    'Starling',
    'Revolut',
    'Monzo',
  ];
  const selectedBank = route.params.selectedBank;
  const selectedIcon = route.params.selectedIcon;
  const accounts = route.params.accounts;
  const transactions = route.params.transactions;
  const balances = route.params.balances;
  useEffect(() => {
    setCheckedBanks(prevState => ({
      ...prevState,
      [selectedBank.toLowerCase()]: true,
    }));
  }, [selectedBank]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCheck = bank => {
    setCheckedBanks(prevState => ({
      ...prevState,
      [bank]: !prevState[bank],
    }));
  };

  return (
    <>
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{backgroundColor: 'white'}}>
          {/* <Surface elevation={6} category="medium" style={styles.surface}>
          <Image source={selectedIcon} style={styles.icon} />
        </Surface> */}

          <View
            style={{
              padding: 10,
              marginVertical: 8,
              backgroundColor: 'white',
              height: '100%',
            }}>
            <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={toggleDropdown}>
                <Button
                  title="CONSOLIDATED"
                  style={{width: 200}}
                  color="#5a287d"
                  leading={
                    <Icon
                      source="gamepad-circle-outline"
                      color="white"
                      size={20}
                    />
                  }
                  onPress={toggleDropdown}
                />
              </TouchableOpacity>
              {/* <FlatList
              data={accounts}
              renderItem={({ item }) => <AccountCard item={item} />}
              keyExtractor={(item) => item.AccountId.toString()}
            /> */}
              {showDropdown && (
                <ScrollView
                  style={{
                    width: 200,
                    maxHeight: 150,
                    zIndex: 1,
                    position: 'absolute',
                    top: 50,
                    elevation: 5,
                    borderRadius: 10,
                  }}>
                  {banks.map(bank => (
                    <ListItem
                      key={bank}
                      title={bank}
                      leading={
                        <Checkbox
                          status={
                            checkedBanks[bank.toLowerCase()]
                              ? 'checked'
                              : 'unchecked'
                          }
                          onPress={() => handleCheck(bank.toLowerCase())}
                        />
                      }
                    />
                  ))}
                </ScrollView>
              )}
            </View>
            {checkedBanks[selectedBank.toLowerCase()] &&
              renderAccountComponent(
                selectedBank,
                accounts,
                transactions,
                balances,
              )}
            {selectedBank.toLowerCase() !== 'barclays' &&
              checkedBanks.barclays && <BarclaysAccounts />}
            {selectedBank.toLowerCase() !== 'lloyds' && checkedBanks.lloyds && (
              <LloydsAccounts />
            )}
            {selectedBank.toLowerCase() !== 'monzo' && checkedBanks.monzo && (
              <MonzoAccounts />
            )}
            {selectedBank.toLowerCase() !== 'revolut' &&
              checkedBanks.revolut && <RevolutAccounts />}
            {selectedBank.toLowerCase() !== 'santander' &&
              checkedBanks.santander && <SantanderAccounts />}
            {selectedBank.toLowerCase() !== 'starling' &&
              checkedBanks.starling && <StarlingAccounts />}
            {selectedBank.toLowerCase() !== 'natwest' &&
              checkedBanks.natwest && (
                <NatwestAccounts
                  accountsList={accounts}
                  transactionsList={transactions}
                  balancesList={balances}
                />
              )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a28d',
  },
  surface: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

const renderAccountComponent = (
  selectedBank,
  accounts,
  transactions,
  balances,
) => {
  switch (selectedBank.toLowerCase()) {
    case 'natwest':
      return (
        <NatwestAccounts
          accountsList={accounts}
          transactionsList={transactions}
          balancesList={balances}
        />
      );
    case 'barclays':
      return <BarclaysAccounts />;
    case 'lloyds':
      return <LloydsAccounts />;
    case 'monzo':
      return <MonzoAccounts />;
    case 'revolut':
      return <RevolutAccounts />;
    case 'starling':
      return <StarlingAccounts />;
    case 'santander':
      return <SantanderAccounts />;

    default:
      return null;
  }
};

export default AllAccounts;
