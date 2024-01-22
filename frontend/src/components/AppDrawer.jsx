import {createDrawerNavigator} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionListScreen from '../screens/TransactionListScreen';
import BottomTab from './BottomTab';
import ConsentScreen from '../screens/ConsentScreen';
import SelectBank from './SelectBank';

import Dummy from '../screens/Dummy';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator
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
          fontSize: 22,
        },
        headerTitleAlign: 'center',
      }}
      headerMode="screen">
      <Drawer.Screen
        name="NWBank"
        component={BottomTab}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={28} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Home"
        component={MyStack}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={28} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="Add Bank"
        component={SelectBank}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="bank-plus" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={Dummy}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="bell" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={Dummy}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="message" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Dummy}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Updates"
        component={Dummy}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="update" color={color} size={28} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
export default AppDrawer;
