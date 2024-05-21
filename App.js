// import { StatusBar } from 'expo-status-bar';
// import 'setimmediate'
// import { StyleSheet, Text, View } from 'react-native';
// import MakeTransfer from './src/screens/MakeTransfer';
// import { NavigationContainer } from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import AppDrawer from './src/components/AppDrawer';
// import SelectBank from './src/components/SelectBank';
// import ConsentScreen from './src/screens/ConsentScreen';
// // import AllAccounts from './src/components/AllAccounts';
// import { Provider as PaperProvider } from 'react-native-paper';
// import MainScreen from './src/screens/MainScreen';
// import AllAccounts from './src/components/AllAccounts';
// import SuccessfullTransaction from './src/screens/SuccessfullTransaction';
// import PaymentConsentScreen from './src/screens/PaymentConsentScreen';
// import ViewAllAccounts from './src/screens/ViewAllAccounts';
// import ConsentsforVRP from './src/screens/VRP/ConsentsforVRP';
// import CreditorDetailsforVRP from './src/screens/VRP/CreditorDetailsforVRP';
// import GrantedForm from './src/screens/VRP/GrantedForm';
// import VrpTransactions from './src/screens/VRP/VrpTransactions';
// import VRPConsent from './src/screens/VRP/VRPConsent';
// import VRPDetails from './src/screens/VRP/VRPDetails';
// import TransactionList from './src/components/TransactionList';
// import ViewAllLocalDetails from './src/screens/ViewAllLocalDetails';
// import ViewNatwestAccounts from './src/screens/ViewNatwestAccounts';

// const Stack = createNativeStackNavigator();
// export default function App() {
//   return (
//     <PaperProvider>
//       <NavigationContainer>
//         <Stack.Navigator>
//         <Stack.Screen
//                 name="Home"
//                 component={AppDrawer}
//                 options={{headerShown: false}}
//               />
//               <Stack.Screen name="Consent" component={ConsentScreen} />
//               <Stack.Screen name="Select Your Bank" component={SelectBank} />
//               <Stack.Screen name="Your Accounts" component={AllAccounts} />
//               {/* <Stack.Screen name="Transaction Successful" component={SuccessfullTransaction} /> */}
//               <Stack.Screen name="Transactions" component={TransactionList} />
//               <Stack.Screen name="Transfer Money" component={MakeTransfer} />
//               <Stack.Screen name="PISP" component={PaymentConsentScreen} />
//               <Stack.Screen name="Details" component={MainScreen} />
//               <Stack.Screen name="Bank Accounts" component={ViewAllAccounts} />
//               <Stack.Screen
//                 name="View Details"
//                 component={ViewAllLocalDetails}
//               />
//               <Stack.Screen
//                 name="Your Natwest Accounts"
//                 component={ViewNatwestAccounts}
//               />
             
//               <Stack.Screen name="ConsentsforVRP" component={ConsentsforVRP} />
//               <Stack.Screen
//                 name="CreditorDetails"
//                 component={CreditorDetailsforVRP}
//               />
//               <Stack.Screen name="GrantedForm" component={GrantedForm} />
//               <Stack.Screen name="VrpTransactions" component={VrpTransactions} />
//               <Stack.Screen name="Review Creditor" component={VRPConsent} />
//               <Stack.Screen name="VRP Details" component={VRPDetails} />
            
//       </Stack.Navigator>
//       </NavigationContainer>
//       </PaperProvider>
      
    
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });








import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Appearance,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import { initDatabase, initDatabaseTransaction } from './database/Database';
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

function App() {
  useEffect(() => {
    initDatabase();
    initDatabaseTransaction();
  }, []);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: Colors.lighter,
  };

  const Stack = createNativeStackNavigator();

  useEffect(() => Appearance.setColorScheme('light'), []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeAreaView style={backgroundStyle}>
          <StatusBar barStyle="dark-content" backgroundColor={backgroundStyle.backgroundColor} />
          <View></View>
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
              }}
            >
              <Stack.Screen name="Home" component={AppDrawer} options={{ headerShown: false }} />
              <Stack.Screen name="Natwest Cart" component={ProductListing} />
              <Stack.Screen name="ONEBank" component={Landing} />
              <Stack.Screen name="Consent" component={ConsentScreen} />
              <Stack.Screen name="Select Your Bank" component={SelectBank} />
              <Stack.Screen name="Transactions" component={TransactionList} />
              <Stack.Screen name="Details" component={MainScreen} />
              <Stack.Screen name="Your Accounts" component={AllAccounts} />
              <Stack.Screen name="Bank Accounts" component={ViewAllAccounts} />
              <Stack.Screen name="Added Bank Accounts" component={AccountListWithRefreshToken} />
              <Stack.Screen name="View Details" component={ViewAllLocalDetails} />
              <Stack.Screen name="View Added Bank Details" component={ViewDetailsWithRefreshToken} />
              <Stack.Screen name="Your Natwest Accounts" component={ViewNatwestAccounts} />
              <Stack.Screen name="Your Barclays Accounts" component={ViewBarclaysAccounts} />
              <Stack.Screen name="Transaction Successful" component={SuccessfulTransaction} />
              <Stack.Screen name="Added Accounts" component={ViewAccountsForTransactions} />
              <Stack.Screen name="Transfer Money" component={MakeTransfer} />
              <Stack.Screen name="PISP" component={PaymentConsentScreen} />
              <Stack.Screen name="ConsentsforVRP" component={ConsentsforVRP} />
              <Stack.Screen name="CreditorDetails" component={CreditorDetailsforVRP} />
              <Stack.Screen name="GrantedForm" component={GrantedForm} />
              <Stack.Screen name="Vrp Transactions" component={VrpTransactions} />
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
              <Stack.Screen name="Second Cvrp Call" component={SecondCvrpCall} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default App;
