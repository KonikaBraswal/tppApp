import React, { useEffect, useState, useRef } from 'react';
import {Icon } from 'react-native-paper';
import { StyleSheet, Image, ScrollView, View, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import { ListItem,Surface } from '@react-native-material/core';
import { Modal, Portal, Checkbox, Button } from 'react-native-paper';
import BarclaysComponent from './AccountLists/BarclaysAccounts';
import NatwestAccounts from './AccountLists/NatwestAccounts';
import BarclaysAccounts from './AccountLists/BarclaysAccounts';
import LloydsAccounts from './AccountLists/LloydsAccounts';
import MonzoAccounts from './AccountLists/MonzoAccounts';
import SantanderAccounts from './AccountLists/SantanderAccounts';
import StarlingAccounts from './AccountLists/StarlingAccounts';
import RevolutAccounts from './AccountLists/RevolutAccounts';

const AllAccounts = ({ route: { params: { selectedIcon, selectedBank } } }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [accounts, setAccounts] = useState([]);
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

  useEffect(() => {
    setCheckedBanks((prevState) => ({
      ...prevState,
      [selectedBank.toLowerCase()]: true,
    }));
  }, [selectedBank]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCheck = (bank) => {
    setCheckedBanks((prevState) => ({
      ...prevState,
      [bank]: !prevState[bank],
    }));
  };

  const handleDropdownPress = () => {
    toggleDropdown();
  };

  const handleTouchablePress = () => {
    if (showDropdown) {
      setShowDropdown(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouchablePress}>
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ backgroundColor: 'white' }}>
          <View style={{ padding: 10, marginVertical: 0, backgroundColor: 'white', height: '100%' }}>
            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={handleDropdownPress} style={{top:15,right:10,zIndex:3,position:'absolute'}}>
                <Button icon="chevron-down" mode="contained" onPress={toggleDropdown}>
                  Consolidated
                </Button>
              </TouchableOpacity>
              {showDropdown && (
                <ScrollView style={{ width: 200, maxHeight: 150, zIndex: 2, position: 'absolute', top:60, elevation: 5, borderRadius: 10 }}>
                  {banks.map((bank) => (
                    <ListItem
                      key={bank}
                      title={bank}
                      leading={
                        <Checkbox
                          status={checkedBanks[bank.toLowerCase()] ? 'checked' : 'unchecked'}
                          onPress={() => handleCheck(bank.toLowerCase())}
                        />
                      }
                    />
                  ))}
                </ScrollView>
              )}
            </View>
            {checkedBanks[selectedBank.toLowerCase()] && renderAccountComponent(selectedBank)}
            {selectedBank.toLowerCase() !== "barclays" && checkedBanks.barclays && <BarclaysAccounts />}
            {selectedBank.toLowerCase() !== "lloyds" && checkedBanks.lloyds && <LloydsAccounts />}
            {selectedBank.toLowerCase() !== 'monzo' && checkedBanks.monzo && <MonzoAccounts />}
            {selectedBank.toLowerCase() !== 'revolut' && checkedBanks.revolut && <RevolutAccounts />}
            {selectedBank.toLowerCase() !== 'santander' && checkedBanks.santander && <SantanderAccounts />}
            {selectedBank.toLowerCase() !== 'starling' && checkedBanks.starling && <StarlingAccounts />}
            {selectedBank.toLowerCase() !== 'natwest' && checkedBanks.natwest && <NatwestAccounts />}
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
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
  
  
  const renderAccountComponent = (selectedBank) => {
    switch (selectedBank.toLowerCase()) {
      case 'natwest':
        return <NatwestAccounts />;
      case 'barclays':
        return <BarclaysAccounts />;
        case 'lloyds':
          return <LloydsAccounts/>;
          case 'monzo':
            return <MonzoAccounts/>;
            case 'revolut':
              return <RevolutAccounts/>;
              case 'starling':
                return <StarlingAccounts/>;
                case 'santander':
                  return <SantanderAccounts/>;
      
      default:
        return null;
    }
  };
  
  export default AllAccounts; 