import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, KeyboardAvoidingView} from 'react-native';
import {Surface, Stack, Divider, ListItem} from '@react-native-material/core';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Searchbar} from 'react-native-paper';
import ConsentScreen from '../screens/ConsentScreen';
import {Icon, ScrollView} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {all} from 'axios';
const commonbanks = [
  {id: 1, name: 'Natwest', icon: require('../assets/images/natwest.png')},
  {id: 8, name: 'Ulster', icon: require('../assets/images/Ulster.jpg')},
  {id: 5, name: 'HSBC', icon: require('../assets/images/hsbc.png')},
  {id: 3, name: 'Barclays', icon: require('../assets/images/barclays.png')},
  {id: 4, name: 'Lloyds', icon: require('../assets/images/lloyds.png')},
  {id: 5, name: 'Monzo', icon: require('../assets/images/monzo.png')},
  {id: 6, name: 'Santander', icon: require('../assets/images/santander.png')},
  {id: 7, name: 'RBS', icon: require('../assets/images/Rbs.jpg')},
  {id: 8, name: 'Coutts', icon: require('../assets/images/coutts-logo.jpg')},
];
const allbanks = [
  {id: 101, name: 'Barclays', icon: require('../assets/images/barclays.png')},
  {id: 109, name: 'RBS', icon: require('../assets/images/Rbs.jpg')},
  {id: 102, name: 'HSBC', icon: require('../assets/images/hsbc.png')},
  {id: 103, name: 'Lloyds', icon: require('../assets/images/lloyds.png')},
  {id: 104, name: 'Monzo', icon: require('../assets/images/monzo.png')},
  {id: 105, name: 'Natwest', icon: require('../assets/images/natwest.png')},
  {id: 106, name: 'Revolut', icon: require('../assets/images/revolut.png')},
  {id: 107, name: 'Santander', icon: require('../assets/images/santander.png')},
  {id: 110, name: 'Ulster', icon: require('../assets/images/Ulster.jpg')},
  {id: 108, name: 'Starling', icon: require('../assets/images/starling.png')},
];

const SelectBankVRP = () => {
  const navigation = useNavigation();
  const [banklist, setbanklist] = useState([]);
  useEffect(() => {
    setbanklist(commonbanks);
  }, []);
  const [searchQuery, setSearchQuery] = React.useState('');

  const [filteredBanks, setFilteredBanks] = useState(commonbanks);

  const onChangeSearch = query => {
    setSearchQuery(query);
    const filtered = commonbanks.filter(bank =>
      bank.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    );
    setFilteredBanks(filtered);
  };

  const handlePress = bankName => {
    navigation.navigate('Payee Details', {bankName: bankName});
  };
  const rows = [];
  for (let i = 0; i < filteredBanks.length; i += 3) {
    const rowBanks = filteredBanks.slice(i, i + 3);
    const row = (
      <Stack
        key={`row_${i}`}
        direction="row"
        //spacing={10}
        style={SelectBankStyle.row}>
        {rowBanks.map(bank => (
          <TouchableOpacity
            key={bank.id}
            onPress={() => handlePress(bank.name)}>
            <Surface category="medium" style={SelectBankStyle.surface}>
              <Image source={bank.icon} style={SelectBankStyle.image} />
            </Surface>
          </TouchableOpacity>
        ))}
      </Stack>
    );
    rows.push(row);
  }

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={Platform.OS === 'ios' ? 30 : 0}>
        <View>
          <View
            style={{
              backgroundColor: '#5a287d',
              padding: 10,
            }}>
            <Searchbar
              placeholder="Search by bank name"
              onChangeText={onChangeSearch}
              value={searchQuery}
              icon={() => <Icon source="magnify" color="black" size={20} />}
              style={{
                borderRadius: 5,
                backgroundColor: '#f4ebfe',
              }}
            />
          </View>
        </View>
        <Stack fill left style={{backgroundColor: 'white', padding: 10}}>
          <Surface elevation={10} category="medium">
            <Text
              style={{
                fontSize: RFValue(18),
                padding: 15,
                color: 'black',
                fontWeight: 'bold',
              }}>
              Most Common
            </Text>
            {/* 
    {rows} */}
            {rows.map((row, index) => (
              <View key={`row_${index}`}>{row}</View>
            ))}
          </Surface>
        </Stack>

        <Stack fill left style={{backgroundColor: 'white', padding: 10}}>
          <Surface elevation={10} category="medium">
            <Text
              style={{
                fontSize: RFValue(18),
                padding: 15,
                color: 'black',
                fontWeight: 'bold',
                padding: 20,
              }}>
              All Banks
            </Text>
            {allbanks.map(bank => (
              <ListItem
                key={`row_${bank.id}`}
                title={bank.name}
                leading={
                  <Image
                    source={bank.icon}
                    style={{height: 30, width: 30, resizeMode: 'contain'}}
                  />
                }
                trailing={<Icon source="chevron-right" size={24} />}
              />
            ))}
          </Surface>
        </Stack>
      </KeyboardAwareScrollView>
    </>
  );
};
export default SelectBankVRP;

const SelectBankStyle = StyleSheet.create({
  row: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'flex-start',

    flexWrap: 'wrap',
  },

  surface: {
    backgroundColor: 'white',
    width: 80,

    height: 80,

    justifyContent: 'center',

    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'white',
    margin: 10,
  },

  image: {
    width: 80,

    height: 80,

    resizeMode: 'contain',

    // flexWrap:"wrap"
  },
});
