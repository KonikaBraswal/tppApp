import {createDrawerNavigator} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, TouchableOpacity} from 'react-native';
// import TransactionListScreen from './TransactionList';
import React, { useState, useEffect } from 'react';
import BottomTab from './BottomTab';
import { RFValue } from 'react-native-responsive-fontsize';
// import ConsentScreen from '../screens/ConsentScreen';
// import { initAISPLocalDatabase, initLocalDatabase } from '../../database/LocalDatabase';
import SelectBank from './SelectBank';
import {Icon,List,Checkbox} from 'react-native-paper';
import Dummy from '../screens/Dummy';

const Drawer = createDrawerNavigator();
const CustomDrawerContent = ({ navigation }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mode,setMode]=useState('sandbox');
  // const { setEnv } = useGlobalEnv();
  useEffect(() => {
    global.env = mode;
    console.log("Mode changed to:", global.env);
    // envChangeEmitter.emit('globalEnvChanged', mode);
    if(mode==='local')
    {
      // initLocalDatabase();
      // initAISPLocalDatabase();
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
      <List.Item
    title="ONEBank"
    left={props => <List.Icon {...props} icon="home" />}
  />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Add Bank')}>
      <List.Item
    title="Add Bank"
    left={props => <List.Icon {...props} icon="bank-plus" />}
  />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
      <List.Item
    title="Notifications"
    left={props => <List.Icon {...props} icon="bell" />}
  />
      </TouchableOpacity>
        <TouchableOpacity onPress={toggleDropdown}>
        <List.Item
    title="Environment"
    left={props => <List.Icon {...props} icon="code-tags" />}
  />
        </TouchableOpacity>
        {showDropdown && (
          <View style={{ marginTop: 5 }}>
            <TouchableOpacity onPress={() => handleMenuItemClick('sandbox')}>
            <Checkbox.Item label="Sandbox" status={mode === 'sandbox' ? 'checked' : 'unchecked'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuItemClick('local')}>
            <Checkbox.Item label="Local" status={mode === 'local' ? 'checked' : 'unchecked'} />
            </TouchableOpacity>
          </View>
        )}
 
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      <List.Item
    title="Profile"
    left={props => <List.Icon {...props} icon="account" />}
  />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
      <List.Item
    title="Messages"
    left={props => <List.Icon {...props} icon="message" />}
  />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Database')}>
      <List.Item
    title="Database"
    left={props => <List.Icon {...props} icon="database-cog" />}
  />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Updates')}>
      <List.Item
    title="Updates"
    left={props => <List.Icon {...props} icon="update" />}
  />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('API Logs')}>
      <List.Item
    title="API Logs"
    left={props => <List.Icon {...props} icon="api" />}
  />
      </TouchableOpacity>
    </View>
  );
};
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
//           fontSize: 22,
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
//     </Drawer.Navigator>
//   );
// };

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
      {/* <Drawer.Screen
        name="Local"
        component={LocalAccountList}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="update" color={color} size={28} />
          ),
        }}
      /> */}
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
        component={Dummy}
        options={{
          drawerIcon: ({ color }) => (
            <Icon source="database-cog" color={color} size={28} />
          ),
        }}
      />
    <Drawer.Screen
        name="Updates"
        component={Dummy}
        options={{
          drawerIcon: ({ color }) => (
            <Icon source="database-cog" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Test Result"
        component={Dummy}
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
