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
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import AppDrawer from './src/components/AppDrawer';
import BottomTab from './src/components/BottomTab';
import ConsentScreen from './src/screens/ConsentScreen';
import SelectBank from './src/components/SelectBank';
import AccountListScreen from './src/screens/AccountListScreen';
import TransactionListScreen from './src/screens/TransactionListScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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
                  fontSize: 22,
                },
                headerTitleAlign: 'center',
              }}>
              <Stack.Screen
                name="Home"
                component={AppDrawer}
                options={{headerShown: false}}
              />
              <Stack.Screen name="Consent" component={ConsentScreen} />
              <Stack.Screen name="AddBank" component={SelectBank} />
              <Stack.Screen name="Accounts" component={AccountListScreen} />
              <Stack.Screen
                name="Transactions"
                component={TransactionListScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>

          {/* <ConsentScreen text="NWBank needs your explicit consent to access the following information from the accounts held at your bank or building society"/> */}
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default App;
