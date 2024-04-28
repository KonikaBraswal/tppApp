
import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTab from './BottomTab';
import ConsentScreen from '../screens/ConsentScreen';
import SelectBank from './SelectBank';
import LocalAccountList from '../screens/LocalEnvironment/LocalAccountList';
import { Icon } from 'react-native-paper';
import Dummy from '../screens/Dummy';
import { Checkbox } from 'react-native-paper';
import Test from './Test';
import Database from '../../database/Database';
import { initAISPLocalDatabase, initLocalDatabase } from '../../database/LocalDatabase';
import { envChangeEmitter } from '../../eventEmitter';
import { useGlobalEnv } from '../../GlobalEnvContext';
// import { useGlobalState } from './GlobalStateContext';
const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mode,setMode]=useState('sandbox');
  const { setEnv } = useGlobalEnv();
  useEffect(() => {
    global.env = mode;
    console.log("Mode changed to:", global.env);
    envChangeEmitter.emit('globalEnvChanged', mode);
    if(mode==='local')
    {
      initLocalDatabase();
      initAISPLocalDatabase();
    }
 }, [mode]); 

  console.log("hiiiiiiiiiiiiiiiiiiiiiii",global.env);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMenuItemClick = (item) => {
    console.log('Clicked:', item);
    // setModeinDatabase(item);
    setMode(item);
   
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Your drawer content goes here */}
      {/* <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        <Text>Toggle Drawer</Text>
      </TouchableOpacity> */}
      {/* Header */}
   
      {/* Drawer content */}
      <TouchableOpacity onPress={() => navigation.navigate('ONEBank')}>
        <Text>ONEBank</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Add Bank')}>
        <Text>Add Bank</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
        <Text>Notifications</Text>
      </TouchableOpacity>
      <View style={{ backgroundColor: '#5a287d', padding: 10 }}>
        <TouchableOpacity onPress={toggleDropdown}>
          <Icon source="code-tags" color="white" size={25} />
          <Text>Environment</Text>
        </TouchableOpacity>
        {showDropdown && (
          <View style={{ backgroundColor: 'white', marginTop: 5 }}>
            <TouchableOpacity onPress={() => handleMenuItemClick('sandbox')}>
            <Checkbox.Item label="Sandbox" status={mode === 'sandbox' ? 'checked' : 'unchecked'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuItemClick('local')}>
            <Checkbox.Item label="Local" status={mode === 'local' ? 'checked' : 'unchecked'} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
        <Text>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Text>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Database')}>
        <Text style={{color:'black'}}>Database</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Local')}>
        <Text>Local</Text>
      </TouchableOpacity>
      {/* Add more drawer items as needed */}
    </View>
  );
};

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#f4ebfe',
          width: 250,
        },
        headerStyle: {
          backgroundColor: '#5a287d',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: RFValue(22),
        },
        headerTitleAlign: 'center',
        // headerRight: () => (
        //   <Icon source="code-tags" color="white" size={25}  />
        // ),
      }}
      headerMode="screen">
      <Drawer.Screen
        name="ONEBank"
        component={BottomTab}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Add Bank"
        component={SelectBank}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="bank-plus" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={Dummy}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={Dummy}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="message" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Dummy}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Local"
        component={LocalAccountList}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="update" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Environment"
        component={Dummy}
        options={{
          drawerIcon: ({ color }) => (
            <Icon source="code-tags" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="API Logs"
        component={Dummy}
        options={{
          drawerIcon: ({ color }) => (
            <Icon source="database-cog" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Database"
        component={Database}
        options={{
          drawerIcon: ({ color }) => (
            <Icon source="database-cog" color={color} size={28} />
          ),
        }}
      />

      <Drawer.Screen
        name="Test Result"
        component={Test}
        options={{
          drawerIcon: ({ color }) => (
            <Icon source="database-cog" color={color} size={28} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
export default AppDrawer;
// import {createDrawerNavigator} from '@react-navigation/drawer';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import TransactionListScreen from './TransactionList';
// import {RFValue} from 'react-native-responsive-fontsize';
// import BottomTab from './BottomTab';
// import ConsentScreen from '../screens/ConsentScreen';
// import SelectBank from './SelectBank';
// import {Icon} from 'react-native-paper';
// import Dummy from '../screens/Dummy';
// import Test from './Test';
// import Database from '../../database/Database';

// const Drawer = createDrawerNavigator();

// const AppDrawer = () => {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         drawerStyle: {
//           backgroundColor: '#f4ebfe',
//           width: 250,
//         },
//         headerStyle: {
//           backgroundColor: '#5a287d',
//         },
//         headerTintColor: 'white',
//         headerTitleStyle: {
//           fontWeight: 'bold',
//           fontSize: RFValue(22),
//         },
//         headerTitleAlign: 'center',
//       }}
//       headerMode="screen">
//       <Drawer.Screen
//         name="ONEBank"
//         component={BottomTab}
//         options={{
//           drawerIcon: ({color}) => (
//             <MaterialCommunityIcons name="home" color={color} size={28} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Add Bank"
//         component={SelectBank}
//         options={{
//           drawerIcon: ({color}) => (
//             <MaterialCommunityIcons name="bank-plus" color={color} size={28} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Notifications"
//         component={Dummy}
//         options={{
//           drawerIcon: ({color}) => (
//             <MaterialCommunityIcons name="bell" color={color} size={28} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Messages"
//         component={Dummy}
//         options={{
//           drawerIcon: ({color}) => (
//             <MaterialCommunityIcons name="message" color={color} size={28} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Profile"
//         component={Dummy}
//         options={{
//           drawerIcon: ({color}) => (
//             <MaterialCommunityIcons name="account" color={color} size={28} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Updates"
//         component={Dummy}
//         options={{
//           drawerIcon: ({color}) => (
//             <MaterialCommunityIcons name="update" color={color} size={28} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Environment"
//         component={Dummy}
//         options={{
//           drawerIcon: ({color}) => (
//             <Icon source="code-tags" color={color} size={28} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="API Logs"
//         component={Dummy}
//         options={{
//           drawerIcon: ({color}) => (
//             // <MaterialCommunityIcons name="settings" color={color} size={28} />
//             <Icon source="database-cog" color={color} size={28} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Database"
//         component={Database}
//         options={{
//           drawerIcon: ({color}) => (
//             <Icon source="database-cog" color={color} size={28} />
//           ),
//         }}
//       />

//       <Drawer.Screen
//         name="Test Result"
//         component={Test}
//         options={{
//           drawerIcon: ({color}) => (
//             <Icon source="database-cog" color={color} size={28} />
//           ),
//         }}
//       />
//     </Drawer.Navigator>
//   );
// };
// export default AppDrawer;