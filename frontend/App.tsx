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
import { PaperProvider } from 'react-native-paper';


import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import TransactionListScreen from './src/screens/TransactionListScreen';
import AccountListScreen from './src/screens/AccountListScreen';
import ConsentScreen from './src/screens/ConsentScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {

    flex:1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <PaperProvider >
    <SafeAreaProvider>
    <SafeAreaView style={backgroundStyle}>
    <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
       {/* <AccountListScreen/> */}
    {/* <TransactionListScreen/> */}
    <ConsentScreen text="NWBank needs your explicit consent to access the following information from the accounts held at your bank or building society"/>
   

    </SafeAreaView>
    </SafeAreaProvider>
    </PaperProvider>
  );
}



export default App;
