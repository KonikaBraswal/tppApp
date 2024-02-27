// import React, {useState, useEffect} from 'react';
// import {View, FlatList} from 'react-native';
// import axios from 'axios';
// import AccountCard from '../components/AccountCard';

// const AccountListScreen = () => {
//   const [accounts, setAccounts] = useState([]);

//   useEffect(() => {
//     // async function fetchData() {
//     //   axios
//     //     .get('http://192.168.1.6:3000/Data')
//     //     .then(response => setAccounts(response.data.Account))
//     //     .catch(error => console.error('Error fetching account data:', error));
//     // }
//     // fetchData();

//   }, []);

//   return (
//     <View style={{padding: 10, marginVertical: 8}}>
//       <FlatList
//         data={accounts}
//         keyExtractor={item => item.AccountId}
//         renderItem={({item}) => <AccountCard account={item} />}
//       />
//     </View>
//   );
// };

// export default AccountListScreen;
// json-server --watch ./src/assets/data/accounts.json

// import React, { useEffect, useState } from 'react';
// import { View, FlatList, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
// import { Icon,Checkbox } from 'react-native-paper';
// import { ListItem } from '@react-native-material/core';
// import AccountCard from '../components/AccountCard';
// import read from '../jsonfiles/accounts.json';

// const AccountListScreen = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [checked, setChecked] = React.useState(true);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const accountData = read?.Account;
//   const dropdownItems = [{id:1,name:'Natwest'},
//   {id:2,name:'Barclays'},
//   {id:3,name:'Lloyds'},
//   {id:4,name:'Revolut'},
//   {id:5,name:'Santander'},
//   {id:6,name:'Starling'},
//   {id:7,name:'Monzo'}
// ];

//   useEffect(() => {
//     setAccounts(accountData);
//   }, []);

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };
//   const handleCheck=()=>{
//    setChecked(!checked)

//   }

//   return (
//     <View style={{ padding: 10, marginVertical: 8, position: 'relative' }}>
//       <View style={styles.contain}>
//         <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
//           <Text style={{ color: '#5a287d' }}>{'Consolidated'}</Text>
//           <Icon source="gamepad-circle-outline" color="#5a287d" size={20} />
//         </TouchableOpacity>
//         {showDropdown && (
//           <ScrollView style={styles.dropdownContainer}>
//             {dropdownItems.map((item, index) => (

//             <ListItem key={index}
//                 title={item.name}
//                 trailing={<Checkbox.Android
//                 status={checked ? 'checked' : 'unchecked'}
//                 onPress={handleCheck}
//               />}/>
//             ))}
//           </ScrollView>
//         )}
//       </View>
//       <FlatList
//         data={accounts}
//         renderItem={({ item }) => <AccountCard item={item} />}
//         keyExtractor={(item) => item.AccountId.toString()}
//       />
//     </View>
//   );
// };

// export default AccountListScreen;

// const styles = StyleSheet.create({
//   contain: {
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end',
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: 200,
//     padding: 10,
//     borderColor: '#5a287d',
//     borderWidth: 1,
//     borderRadius: 5,
//   },
//   dropdownContainer: {
//     position: 'absolute',
//     top: 50, // Adjust this value based on your layout
//     right: 1, // Adjust this value based on your layout
//     width: 200,
//     maxHeight: 150, // Set a maximum height for the dropdown
//     backgroundColor: 'white', // Set background color as needed
//     elevation: 5, // Add elevation for shadow
//     borderRadius: 5,
//   },
//   dropdownItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
// });

// import React, { useEffect, useState } from 'react';
// import { View, FlatList, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
// import { Icon, Checkbox } from 'react-native-paper';
// import { ListItem } from '@react-native-material/core';
// import AccountCard from '../components/AccountCard';
// import read from '../jsonfiles/accounts.json';

// const AccountListScreen = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const accountData = read?.Account;
//   const dropdownItems = [
//     { id: 1, name: 'Natwest' },
//     { id: 2, name: 'Barclays' },
//     { id: 3, name: 'Lloyds' },
//     { id: 4, name: 'Revolut' },
//     { id: 5, name: 'Santander' },
//     { id: 6, name: 'Starling' },
//     { id: 7, name: 'Monzo' },
//   ];

//   const [checkedItems, setCheckedItems] = useState(false);
//   const handleCheck=()=>{
//     setCheckedItems(!checkedItems);
//   }

//   useEffect(() => {
//     setAccounts(accountData);
//   }, []);

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   return (
//     <View style={{ padding: 10, marginVertical: 8, position: 'relative' }}>
//       <View style={styles.contain}>
//         <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
//           <Text style={{ color: '#5a287d' }}>{'Consolidated'}</Text>
//           <Icon source="gamepad-circle-outline" color="#5a287d" size={20} />
//         </TouchableOpacity>
//         {showDropdown && (
//           <ScrollView style={styles.dropdownContainer}>
//             {/* {dropdownItems.map((item) => (
//               <ListItem
//                 key={item.id}
//                 title={item.name}
//                 trailing={
//                   <Checkbox.Android
//                     status={checkedItems[item.id] ? 'checked' : 'unchecked'}
//                     onPress={() => handleCheck(item.id)}
//                   />
//                 }
//               />
//             ))} */}
//                   <Checkbox
//                     status={checked ? 'checked' : 'unchecked'}
//                     onPress={() => {
//                       setChecked(!checked);
//                     }}
//           />
//           </ScrollView>
//         )}
//       </View>
//       <FlatList
//         data={accounts}
//         renderItem={({ item }) => <AccountCard item={item} />}
//         keyExtractor={(item) => item.AccountId.toString()}
//       />
//     </View>
//   );
// };

// export default AccountListScreen;

// const styles = StyleSheet.create({
//     contain: {
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end',
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: 200,
//     padding: 10,
//     borderColor: '#5a287d',
//     borderWidth: 1,
//     borderRadius: 5,
//   },
//   dropdownContainer: {
//     position: 'absolute',
//     top: 50, // Adjust this value based on your layout
//     right: 1, // Adjust this value based on your layout
//     width: 200,
//     maxHeight: 150, // Set a maximum height for the dropdown
//     backgroundColor: 'white', // Set background color as needed
//     elevation: 5, // Add elevation for shadow
//     borderRadius: 5,
//   },
//   dropdownItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
// });

import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {Icon, Checkbox} from 'react-native-paper';
import {ListItem} from '@react-native-material/core';
import AccountCard from '../components/AccountCard';

import axios from 'axios';

const AccountListScreen = () => {
  const [accounts, setAccounts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownItems = [
    {id: 1, name: 'Natwest'},
    {id: 2, name: 'Barclays'},
    {id: 3, name: 'Lloyds'},
    {id: 4, name: 'Revolut'},
    {id: 5, name: 'Santander'},
    {id: 6, name: 'Starling'},
    {id: 7, name: 'Monzo'},
  ];

  const [checkedItems, setCheckedItems] = useState(() => {
    const initialCheckedState = {};
    dropdownItems.forEach(item => {
      initialCheckedState[item.id] = false;
    });
    return initialCheckedState;
  });

  useEffect(() => {
    async function fetchData() {
      axios
        .get('http://192.168.1.4:3000/Data')
        .then(response => setAccounts(response.data.Account))
        .catch(error => console.error('Error fetching account data:', error));
    }
    fetchData();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const [checked, setChecked] = React.useState(false);
  const handleCheck = () => {
    setChecked(!checked);
  };

  return (
    <View style={{padding: 10, marginVertical: 8, position: 'relative'}}>
      <View style={styles.contain}>
        <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
          <Text style={{color: '#5a287d'}}>{'Consolidated'}</Text>
          <Icon source="gamepad-circle-outline" color="#5a287d" size={20} />
        </TouchableOpacity>
        {showDropdown && (
          <ScrollView style={styles.dropdownContainer}>
            <ListItem
              title="Barclays"
              trailing={
                <Checkbox
                  status={checked ? 'checked' : 'unchecked'}
                  onPress={handleCheck}
                />
              }
            />
            <ListItem
              title="hii"
              trailing={
                <Checkbox
                  status={checked ? 'checked' : 'unchecked'}
                  onPress={handleCheck}
                />
              }
            />
            <ListItem
              title="hii"
              trailing={
                <Checkbox
                  status={checked ? 'checked' : 'unchecked'}
                  onPress={handleCheck}
                />
              }
            />
            <ListItem
              title="hii"
              trailing={
                <Checkbox
                  status={checked ? 'checked' : 'unchecked'}
                  onPress={handleCheck}
                />
              }
            />
          </ScrollView>
        )}
      </View>
      <FlatList
        data={accounts}
        renderItem={({item}) => <AccountCard item={item} />}
        keyExtractor={item => item.AccountId.toString()}
      />
    </View>
  );
};

export default AccountListScreen;

const styles = StyleSheet.create({
  contain: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
    padding: 10,
    borderColor: '#5a287d',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 50, // Adjust this value based on your layout
    right: 1, // Adjust this value based on your layout
    width: 200,
    maxHeight: 150, // Set a maximum height for the dropdown
    backgroundColor: 'white', // Set background color as needed
    elevation: 5, // Add elevation for shadow
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
