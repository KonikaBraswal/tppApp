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
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import TransactionListScreen from './src/screens/TransactionListScreen';
import AccountListScreen from './src/screens/AccountListScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {

    flex:1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={backgroundStyle}>
    <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      
    {/* <TransactionListScreen/> */}
    <AccountListScreen/>

    </SafeAreaView>
    </SafeAreaProvider>
  );
}



export default App;
