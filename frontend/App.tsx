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
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppDrawer from './src/components/AppDrawer';
import ConsentScreen from './src/screens/ConsentScreen';
import SelectBank from './src/components/SelectBank';
import TransactionList from './src/components/TransactionList';

import AllAccounts from './src/components/AllAccounts';
import MainScreen from './src/screens/MainScreen';
import ViewAllAccounts from './src/screens/ViewAllAccounts';
import ViewAllLocalDetails from './src/screens/ViewAllLocalDetails';
import ViewNatwestAccounts from './src/screens/ViewNatwestAccounts';
import ViewBarclaysAccounts from './src/screens/ViewBarclaysAccounts';
import SuccessfulTransaction from './src/screens/SuccessfulTransaction';
import ViewAccountsForTransactions from './src/screens/ViewAccountsForTransaction';

import MakeTransfer from './src/screens/MakeTransfer';
import AccountListWithRefreshToken from './src/screens/AccountListWithRefreshToken';
import ViewDetailsWithRefreshToken from './src/screens/ViewDetailsWithRefreshToken';
import PaymentConsentScreen from './src/screens/PaymentConsentScreen';
import ConsentsforVRP from './src/screens/VRP/ConsentsforVRP';
import CreditorDetailsforVRP from './src/screens/VRP/CreditorDetailsforVRP';
import GrantedForm from './src/screens/VRP/GrantedForm';
import VRPConsent from './src/screens/VRP/VRPConsent';
import VRPDetails from './src/screens/VRP/VRPDetails';
import VrpTransactions from './src/screens/VRP/VrpTransactions';
import ConsentInfo from './src/screens/VRP/ConsentInfo';
import ProductDetails from './src/screens/EcommScreens/ProductDetails';
import ProductListing from './src/screens/EcommScreens/ProductListing';
import Landing from './src/components/Landing';
import CartScreen from './src/screens/EcommScreens/CartScreen';
import OrderSuccessful from './src/screens/EcommScreens/OrderSuccessful';
import CustomerDetails from './src/screens/EcommScreens/CustomerDetails';
import BankList from './src/screens/EcommScreens/BankList';
import AddressScreen from './src/screens/EcommScreens/AddressScreen';
import ConfirmDetails from './src/screens/EcommScreens/ConfirmDetails';
import SecondCvrpCall from './src/screens/EcommScreens/SecondCvrpCall';
import AndroidClient from './DatabaseFactory/AndroidClientDb';

function App(): React.JSX.Element {
  let androidClientVrp=new AndroidClient("NWG", "Sandbox", "vrp");
  let androidClientAisp=new AndroidClient("NWG", "Sandbox", "accounts");
  let androidClientPisp=new AndroidClient("NWG", "Sandbox", "payments");
  let androidClientVrpTransact=new AndroidClient("NWG", "Sandbox", "vrp_transactions");
  let androidClientCA=new AndroidClient("NWG", "Sandbox", "customer_checkout");
  
  useEffect( () => {
    try {
      androidClientVrp.initDatabaseAndroidVrp();
      androidClientCA.initDatabaseAndroidCa();
      androidClientVrpTransact.initDatabaseAndroidVrpTransactions();
      await androidClientAisp.initDatabaseAndroidAisp();
      await androidClientPisp.initDatabaseAndroidPisp();
    } catch (error) {
      console.error('Error fetching data for consents:', error);
    }
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
          <View></View>
          <NavigationContainer>
            {/* <Landing/> */}
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#114188',
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
              <Stack.Screen name="Online Store" component={ProductListing} />

              <Stack.Screen name="ONEBank" component={Landing} />

              <Stack.Screen name="Consent" component={ConsentScreen} />
              <Stack.Screen name="Select Your Bank" component={SelectBank} />
              {/* <Stack.Screen name="Accounts" component={AllAccounts} /> */}
              <Stack.Screen name="Transactions" component={TransactionList} />
              <Stack.Screen name="Details" component={MainScreen} />
              <Stack.Screen name="Your Accounts" component={AllAccounts} />
              <Stack.Screen name="Bank Accounts" component={ViewAllAccounts} />
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
              <Stack.Screen
                name="Vrp Transactions"
                component={VrpTransactions}
              />
              <Stack.Screen name="Review Creditor" component={VRPConsent} />
              <Stack.Screen name="VRP Details" component={VRPDetails} />
              <Stack.Screen name="Consent Info" component={ConsentInfo} />
              <Stack.Screen name="Product Details" component={ProductDetails} />
              <Stack.Screen name="Customer Details" component={CustomerDetails} />
              <Stack.Screen name="Banklist" component={BankList} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="Add Your Details" component={AddressScreen} />
              <Stack.Screen name="Confirm Details" component={ConfirmDetails} />
              <Stack.Screen name="Order Placed" component={OrderSuccessful} />
              <Stack.Screen name="Make Payment" component={SecondCvrpCall} />

            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>

    // <MyComponent/>
  );
}

export default App;
