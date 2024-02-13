/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import AppDrawer from './src/components/AppDrawer';
import BottomTab from './src/components/BottomTab';
import ConsentScreen from './src/screens/ConsentScreen';
import SelectBank from './src/components/SelectBank';
import AccountListScreen from './src/screens/AccountListScreen';
import TransactionList from './src/components/TransactionList';
import Landing from './src/screens/Landing';

import AllAccounts from './src/components/AllAccounts';
import MainScreen from './src/screens/MainScreen';
import ViewAllAccounts from './src/screens/ViewAllAccounts';
import ViewAllLocalDetails from './src/screens/ViewAllLocalDetails';
import ViewNatwestAccounts from './src/screens/ViewNatwestAccounts';
import ViewBarclaysAccounts from './src/screens/ViewBarclaysAccounts';
import SuccessfullTransaction from './src/screens/SuccessfullTransaction';
import ViewAccountsForTransactions from './src/screens/ViewAccountsForTransaction';
import PaymentConscent from './src/screens/PaymentConscent';
import MakeTransfer from './src/screens/MakeTransfer';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const Stack = createNativeStackNavigator();
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeAreaView style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#5a287d',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 21,
                },
                headerTitleAlign: 'center',
              }}>
              <Stack.Screen
                name="Home"
                component={AppDrawer}
                options={{headerShown: false}}
              />
              <Stack.Screen name="Consent" component={ConsentScreen} />
              <Stack.Screen name="Select Your Bank" component={SelectBank} />
              {/* <Stack.Screen name="Accounts" component={AllAccounts} /> */}
              <Stack.Screen name="Transactions" component={TransactionList} />
              <Stack.Screen name="Details" component={MainScreen} />
              <Stack.Screen name="Your Accounts" component={AllAccounts} />
              <Stack.Screen name="Bank Accounts" component={ViewAllAccounts} />
              <Stack.Screen
                name="View Details"
                component={ViewAllLocalDetails}
              />
              <Stack.Screen
                name="Your Natwest Accounts"
                component={ViewNatwestAccounts}
              />
              <Stack.Screen
                name="Your Barclays Accounts"
                component={ViewBarclaysAccounts}
              />
              <Stack.Screen
                name="Transaction Successful"
                component={SuccessfullTransaction}
              />
              <Stack.Screen
                name="Added Accounts"
                component={ViewAccountsForTransactions}
              />
              <Stack.Screen
                name="Consent For Payment"
                component={PaymentConscent}
              />
              <Stack.Screen name="Transfer Money" component={MakeTransfer} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
    //  <AccountListScreen/>
    // <MyComponent/>
  );
}

export default App;
