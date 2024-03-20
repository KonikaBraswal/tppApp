/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Appearance,
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
import SuccessfulTransaction from './src/screens/SuccessfulTransaction';
import ViewAccountsForTransactions from './src/screens/ViewAccountsForTransaction';

import MakeTransfer from './src/screens/MakeTransfer';
import {initDatabase} from './database/Database';
import AccountListWithRefreshToken from './src/screens/AccountListWithRefreshToken';
import ViewDetailsWithRefreshToken from './src/screens/ViewDetailsWithRefreshToken';
import PaymentConsentScreen from './src/screens/PaymentConsentScreen';
import ConsentsforVRP from './src/screens/VRP/ConsentsforVRP';
import CreditorDetailsforVRP from './src/screens/VRP/CreditorDetailsforVRP';
import GrantedForm from './src/screens/VRP/GrantedForm';
import VRPConsent from './src/screens/VRP/VRPConsent';
import VRPDetails from './src/screens/VRP/VRPDetails';
import { initDatabaseApi } from './database/DatabaseLogs';
import ApiLogsList from './src/screens/ApiLogsList';
import ApiLogDetails from './src/screens/ApiLogDetails';
const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    initDatabaseApi();
    initDatabase();
    
  }, []);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const Stack = createNativeStackNavigator();
  useEffect(() => Appearance.setColorScheme('light'), []);
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
              <Stack.Screen name="ApiLogsList" component={ApiLogsList} />
              <Stack.Screen name="ApiLogDetails" component={ApiLogDetails} />
              <Stack.Screen
                name="Added Bank Accounts"
                component={AccountListWithRefreshToken}
              />
              <Stack.Screen
                name="View Details"
                component={ViewAllLocalDetails}
              />
              <Stack.Screen
                name="View Added Bank Details"
                component={ViewDetailsWithRefreshToken}
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
                component={SuccessfulTransaction}
              />
              <Stack.Screen
                name="Added Accounts"
                component={ViewAccountsForTransactions}
              />

              <Stack.Screen name="Transfer Money" component={MakeTransfer} />
              <Stack.Screen name="PISP" component={PaymentConsentScreen} />
              <Stack.Screen name="ConsentsforVRP" component={ConsentsforVRP} />
              <Stack.Screen
                name="CreditorDetails"
                component={CreditorDetailsforVRP}
              />
              <Stack.Screen name="GrantedForm" component={GrantedForm} />
              <Stack.Screen name="Review Creditor" component={VRPConsent} />
              <Stack.Screen name="VRP Details" component={VRPDetails} />
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
