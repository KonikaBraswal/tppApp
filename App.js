import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MakeTransfer from './src/screens/MakeTransfer';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PaymentConscent from './src/screens/PaymentConscent';
import AppDrawer from './src/components/AppDrawer';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen
                name="Home"
                component={AppDrawer}
                options={{headerShown: false}}
              />
      <Stack.Screen name="Transfer Money" component={MakeTransfer} />
      <Stack.Screen
                name="Consent For Payment"
                component={PaymentConscent}
              />
      </Stack.Navigator>
      </NavigationContainer>
      
    
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
