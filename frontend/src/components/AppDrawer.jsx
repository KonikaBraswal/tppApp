import {createDrawerNavigator} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionListScreen from '../screens/TransactionListScreen';
import BottomTab from './BottomTab';

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
          backgroundColor: '#f4ebfe',
        },
        headerTintColor: '#36013f',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 22,
        },
        headerTitleAlign: 'center',
      }}>
      <Drawer.Screen
        name="NWBank"
        component={BottomTab}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={TransactionListScreen}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="bell" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={TransactionListScreen}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="message" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={TransactionListScreen}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Updates"
        component={TransactionListScreen}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="update" color={color} size={28} />
          ),
        }}
      />
      <Drawer.Screen
        name="Signout"
        component={TransactionListScreen}
        options={{
          drawerIcon: ({color}) => (
            <MaterialCommunityIcons name="logout" color={color} size={28} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
export default AppDrawer;
