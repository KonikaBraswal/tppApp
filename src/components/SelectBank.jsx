import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, KeyboardAvoidingView} from 'react-native';
import {Surface, Stack,Divider,ListItem} from '@react-native-material/core';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Searchbar} from 'react-native-paper';
// import ConsentScreen from '../screens/ConsentScreen';
import {Icon,ScrollView} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { all } from 'axios';
const commonbanks = [
  {id: 1, name: 'Natwest', icon: require('../assets/images/natwest.png')},
  {id: 2, name: 'Barclays', icon: require('../assets/images/barclays.png')},
  {id: 3, name: 'Lloyds', icon: require('../assets/images/lloyds.png')},
  {id: 5, name: 'Monzo', icon: require('../assets/images/monzo.png')},
  {id: 6, name: 'Santander', icon: require('../assets/images/santander.png')},
  {id: 7, name: 'Revolut', icon: require('../assets/images/revolut.png')},
  {id: 8, name: 'Starling', icon: require('../assets/images/starling.png')},
];
const allbanks=[
  {id: 101, name: 'Barclays', icon: require('../assets/images/barclays.png')},
  {id: 102, name: 'Lloyds', icon: require('../assets/images/lloyds.png')},
  {id: 103, name: 'Monzo', icon: require('../assets/images/monzo.png')},
  {id: 104, name: 'Natwest', icon: require('../assets/images/natwest.png')},
  {id: 105, name: 'Revolut', icon: require('../assets/images/revolut.png')},
  {id: 106, name: 'Santander', icon: require('../assets/images/santander.png')},
  {id: 107, name: 'Starling', icon: require('../assets/images/starling.png')},
]

const SelectBank = () => {
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

  const handlePress = () => {
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
    category="medium"
    style={SelectBankStyle.surface}
  >
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
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      enableAutomaticScroll
      // extraScrollHeight={Platform.OS === 'ios' ? 30 : 0}
    >
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
        <Stack fill left style={{ backgroundColor: 'white', padding: 10 }}>
  <Surface elevation={10} category="medium">
    <Text
      style={{
        fontSize: 18,
        padding: 15,
        color: 'black',
        fontWeight: 'bold',
      }}
    >
      Most Common
    </Text>
{/* 
    {rows} */}
    {rows.map((row, index) => (
    <View key={`row_${index}`}>{row}</View>
  ))}
  </Surface>
</Stack>

        <Stack fill left style={{ backgroundColor: 'white', padding: 10 }}>
  <Surface elevation={10} category="medium">
    <Text
      style={{
        fontSize: 18,
        padding: 15,
        color: 'black',
        fontWeight: 'bold',
        padding:20
      }}
    >
      All Banks
    </Text>
      {allbanks.map(bank => (
        <ListItem
          key={`row_${bank.id}`}
          title={bank.name}
          leading={<Image source={bank.icon} style={{ height: 30, width: 30, resizeMode: 'contain' }} />}
          trailing={<Icon source="chevron-right" size={24}/>}
        />
      ))}
  </Surface>
</Stack>

</KeyboardAwareScrollView>
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
    width: 80,

    height:80,

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
