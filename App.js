// expowebcvrp code

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppDrawer from './src/components/AppDrawer';
import SelectBank from './src/components/SelectBank';
import ConsentScreen from './src/screens/ConsentScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import MainScreen from './src/screens/MainScreen';
import AllAccounts from './src/components/AllAccounts';
import SuccessfullTransaction from './src/screens/SuccessfullTransaction';
import PaymentConsentScreen from './src/screens/PaymentConsentScreen';
import ViewAllAccounts from './src/screens/ViewAllAccounts';
import ConsentsforVRP from './src/screens/VRP/ConsentsforVRP';
import CreditorDetailsforVRP from './src/screens/VRP/CreditorDetailsforVRP';
import GrantedForm from './src/screens/VRP/GrantedForm';
import VrpTransactions from './src/screens/VRP/VrpTransactions';
import VRPConsent from './src/screens/VRP/VRPConsent';
import VRPDetails from './src/screens/VRP/VRPDetails';
import TransactionList from './src/components/TransactionList';
import ViewAllLocalDetails from './src/screens/ViewAllLocalDetails';
import ViewNatwestAccounts from './src/screens/ViewNatwestAccounts';
import ProductListing from './src/screens/EcommScreens/ProductListing';
import ProductDetails from './src/screens/EcommScreens/ProductDetails';
import CustomerDetails from './src/screens/EcommScreens/CustomerDetails';
import BankList from './src/screens/EcommScreens/BankList';
import CartScreen from './src/screens/EcommScreens/CartScreen';
import AddressScreen from './src/screens/EcommScreens/AddressScreen';
import ConfirmDetails from './src/screens/EcommScreens/ConfirmDetails';
import OrderSuccessful from './src/screens/EcommScreens/OrderSuccessful';
import SecondCvrpCall from './src/screens/EcommScreens/SecondCvrpCall';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={AppDrawer}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Consent" component={ConsentScreen} />
            <Stack.Screen name="Select Your Bank" component={SelectBank} />
            <Stack.Screen name="Your Accounts" component={AllAccounts} />
            {/* <Stack.Screen name="Transaction Successful" component={SuccessfullTransaction} /> */}
            <Stack.Screen name="Transactions" component={TransactionList} />
            {/* Replace MakeTransfer with a suitable component */}
            {/* <Stack.Screen name="Transfer Money" component={MakeTransfer} /> */}
            <Stack.Screen name="PISP" component={PaymentConsentScreen} />
            <Stack.Screen name="Details" component={MainScreen} />
            <Stack.Screen name="Bank Accounts" component={ViewAllAccounts} />
            <Stack.Screen
              name="View Details"
              component={ViewAllLocalDetails}
            />
            <Stack.Screen
              name="Your Natwest Accounts"
              component={ViewNatwestAccounts}
            />
            <Stack.Screen name="ConsentsforVRP" component={ConsentsforVRP} />
            <Stack.Screen
              name="CreditorDetails"
              component={CreditorDetailsforVRP}
            />
            <Stack.Screen name="GrantedForm" component={GrantedForm} />
            <Stack.Screen name="VrpTransactions" component={VrpTransactions} />
            <Stack.Screen name="Review Creditor" component={VRPConsent} />
            <Stack.Screen name="VRP Details" component={VRPDetails} />
            
            {/* Additional screens */}
            <Stack.Screen name="Online Store" component={ProductListing} />
            <Stack.Screen name="Product Details" component={ProductDetails} />
            <Stack.Screen name="Customer Details" component={CustomerDetails} />
            <Stack.Screen name="Banklist" component={BankList} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Add Your Details" component={AddressScreen} />
            <Stack.Screen name="Confirm Details" component={ConfirmDetails} />
            <Stack.Screen name="Order Placed" component={OrderSuccessful} />
            <Stack.Screen name="Make Payment" component={SecondCvrpCall} />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
