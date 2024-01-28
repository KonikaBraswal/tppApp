import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, KeyboardAvoidingView} from 'react-native';
import {Surface, Stack, ListItem, Divider} from '@react-native-material/core';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import SelectBankStyle from "../styles/SelectBankStyles";
// import { SearchBar } from '@rneui/themed';
import {Searchbar} from 'react-native-paper';
import ConsentScreen from '../screens/ConsentScreen';
import {Icon} from 'react-native-paper';

const allbanks = [
  {id: 1, name: 'Natwest', icon: require('../assets/images/natwest.png')},
  {id: 2, name: 'Barclays', icon: require('../assets/images/barclays.png')},
  {id: 3, name: 'Lloyds', icon: require('../assets/images/lloyds.png')},
  {id: 5, name: 'Monzo', icon: require('../assets/images/monzo.png')},
  {id: 6, name: 'Santander', icon: require('../assets/images/santander.png')},
  {id: 7, name: 'Revolut', icon: require('../assets/images/revolut.png')},
  {id: 8, name: 'Starling', icon: require('../assets/images/starling.png')},
];

const SelectBank = () => {
  const navigation = useNavigation();
  const [banklist, setbanklist] = useState([]);
  useEffect(() => {
    setbanklist(allbanks);
  }, []);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredBanks, setFilteredBanks] = useState(allbanks);
  const onChangeSearch = query => {
    setSearchQuery(query);
    const filtered = allbanks.filter(bank =>
      bank.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    );
    setFilteredBanks(filtered);
  };
  const handlePress = () => {
    // const text ='NatWest Bank needs your explicit consent to access the following information from the accounts held at your bank or building society';
    navigation.navigate('Consent');
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
          <TouchableOpacity key={bank.id} onPress={handlePress}>
            <Surface
              elevation={1}
              category="medium"
              style={SelectBankStyle.surface}>
              <Image source={bank.icon} style={SelectBankStyle.image} onPress />
            </Surface>
          </TouchableOpacity>
        ))}
      </Stack>
    );
    rows.push(row);
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, backgroundColor: 'white'}}>
        <View>
          <View
            style={{
              // backgroundColor: '#5a287d',
              paddingLeft: 30,
              paddingRight: 30,
              paddingBottom: 30,
              paddingTop: 20,
            }}>
            <Searchbar
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={searchQuery}
              icon={() => <Icon source="magnify" color="black" size={20} />}
              style={{
                borderRadius: 5,
                backgroundColor: '#f4ebfe',
                borderBottomWidth: 3,
                borderBottomColor: '#5a287d',
              }}
            />
            <Divider style={{marginTop: 20}} leadingInset={16} />
            {/* <Text style={{color: 'black', fontSize: 25, fontWeight: 'bold'}}>
              Select Your Bank
            </Text> */}
          </View>
        </View>

        <Stack fill left style={{backgroundColor: 'white'}}>
          <Text
            style={{
              fontSize: 18,
              padding: 15,
              color: 'black',
              fontWeight: 'bold',
            }}>
            Most Common
          </Text>
          {rows}
          {/* <Text
            style={{
              fontSize: 18,
              padding: 15,
              color: 'black',
              fontWeight: 'bold',
            }}>
            All Banks
          </Text> */}
        </Stack>
      </KeyboardAvoidingView>
    </>
  );
};
export default SelectBank;

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
    width: 110,

    height: 110,

    justifyContent: 'center',

    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 10,
  },

  image: {
    width: 100,

    height: 100,

    resizeMode: 'contain',

    // flexWrap:"wrap"
  },
});
