import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MakeTransfer from './src/screens/MakeTransfer';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PaymentConscent from './src/screens/PaymentConscent';
import AppDrawer from './src/components/AppDrawer';
import SelectBank from './src/components/SelectBank';
import ConsentScreen from './src/screens/ConsentScreen';
// import AllAccounts from './src/components/AllAccounts';
import { Provider as PaperProvider } from 'react-native-paper';
import MainScreen from './src/screens/MainScreen';
import AllAccounts from './src/components/AllAccounts';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen
                name="Home"
                component={AppDrawer}
                options={{headerShown: false}}
              />
              <Stack.Screen name="Consent" component={ConsentScreen} />
              <Stack.Screen name="Select Your Bank" component={SelectBank} />
              <Stack.Screen name="Your Accounts" component={AllAccounts} />
              <Stack.Screen name="Transfer Money" component={MakeTransfer} />
              <Stack.Screen
                name="Consent For Payment"
                component={PaymentConscent}
              />
              <Stack.Screen name="Details" component={MainScreen} />
      </Stack.Navigator>
      </NavigationContainer>
      </PaperProvider>
      
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
