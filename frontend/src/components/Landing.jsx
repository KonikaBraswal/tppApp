import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Surface, FAB } from '@react-native-material/core';
import { Icon, Searchbar, Card, Title } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AndroidClient from '../../DatabaseFactory/AndroidClientDb';
import ViewAll from './ViewAll';
import ViewAllLocal from '../components/ViewAllLocal';
import BottomTab from './BottomTab';


const Landing = () => {
  const navigation = useNavigation();
  let androidClientNWG = new AndroidClient("NWG", "Sandbox", "accounts");
  let androidClientHSBC = new AndroidClient("HSBC", "Sandbox", "accounts");
  const [checkNWB, setCheckNWB] = useState('');
  const [checkHSBC, setCheckHSBC] = useState('');
  const cards = [
    {id: 1, name: 'Natwest', icon: require('../assets/icons/natwest.png')},
    {id: 2, name: 'HSBC', icon: require('../assets/icons/hsbc.png')},
    {id: 3, name: 'Barclays', icon: require('../assets/icons/barclays.png')},
    {id: 4, name: 'Lloyds', icon: require('../assets/icons/lloyds.png')},
    {id: 5, name: 'Monzo', icon: require('../assets/icons/monzo.png')},
    {id: 6, name: 'Santander', icon: require('../assets/icons/santander.png')},
  ];
  const [env, setEnv] = useState(global.env);
  const [key, setKey] = useState(Date.now());
  const render = () => {
    if (env === 'sandbox') {
      return <ViewAll />;
    } else {
      return <ViewAllLocal />;
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      // This function runs when the screen comes into focus
      const checkEnvChange = () => {
        if (global.env !== env) {
          setEnv(global.env);
          setKey(Date.now()); // Trigger remount by changing the key
        }
      };
      checkEnvChange();
      const check = async () => {
        if (global.env === 'sandbox') {
          let resultNWB, resultHSBC;
          try {
            resultNWB = await androidClientNWG.checkTableOrEntryExist();
            resultHSBC = await androidClientHSBC.checkTableOrEntryExist();
            if (resultNWB === 'yes') {
              setCheckNWB(resultNWB);
            }
            if (resultHSBC === 'yes') {
              setCheckHSBC(resultHSBC);
            }

          } catch (error) {
            console.error('Error fetching transactions:', error);
          }
        }
      };
      check();

      const intervalId = setInterval(checkEnvChange, 1000); // Check every second
      return () => clearInterval(intervalId); // Cleanup on unmount
    }, [env]),
  );


  const snapToInterval = 100;
  const Payments = {
    name: 'Payments',
    image: require('../assets/icons/payments.png'),
  };
  const VRP = {name: 'VRP', image: require('../assets/icons/VRP.png')};
  const [searchQuery, setSearchQuery] = React.useState('');

  const AddBank = () => {
    navigation.navigate('Select Your Bank');
  };
  const filteredCards = cards.filter(card => {
    if (card.name === 'Natwest' && checkNWB === 'yes') return true;
    if (card.name === 'HSBC' && checkHSBC === 'yes') return true;
    if (card.name !== 'Natwest' && card.name !== 'HSBC') return true;
    return false;
  });

  return (
    <KeyboardAwareScrollView
      style={{flex: 1, backgroundColor: 'white'}}
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled">
      <View style={{flex: 1}}>
        <View
          style={{
            backgroundColor: '#5a287d',
            padding: 10,
          }}>
          <Searchbar
            placeholder="Search here"
            onChangeText={setSearchQuery}
            value={searchQuery}
            icon={() => <Icon source="magnify" color="black" size={20} />}
            style={{
              borderRadius: 5,
              backgroundColor: '#f4ebfe',
            }}
          />
        </View>
        <Text
          style={{
            margin: 5,
            marginLeft: 10,
            fontWeight: 'bold',
            color: '#5a287d',
            fontSize: RFValue(17),
          }}>
          Added Banks
        </Text>
        <View style={styles.container}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={snapToInterval}
            contentContainerStyle={{
              ...styles.ListContainer,
              backgroundColor: '#c8e1cc',
              justifyContent: 'space-around',
              alignItems: 'center',
              maxHeight: 175,
              marginTop: 5,
              borderRadius: 200,
            }}>
            <View
              style={{
                flexDirection: 'column',
                marginTop: 40,
                marginHorizontal: 10,
              }}>
              <FAB
                icon={() => <Icon source="plus" color="white" size={20} />}
                style={{
                  alignSelf: 'center',
                  backgroundColor: '#5a287d',
                  marginTop: 10,
                }}
                onPress={AddBank}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  marginBottom: 40,
                  marginTop: 10,
                }}>
                Add Bank
              </Text>
            </View>
            {filteredCards.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (item.name === 'Natwest') {
                    navigation.navigate('Added Bank Accounts', {
                      bankName: 'Natwest',
                    });
                  } else if (item.name === 'HSBC') {
                    navigation.navigate('Added Bank Accounts', {
                      bankName: 'HSBC',
                    });
                  } else if (item.name === 'Barclays') {
                    navigation.navigate('Your Barclays Accounts');
                  } else {
                    navigation.navigate('Bank Accounts');
                  }
                }}>
                <Surface elevation={6} category="medium" style={styles.surface}>
                  <Image source={item.icon} style={styles.icon} />
                </Surface>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.addBankContainer}>{render()}</View>
          <View style={styles.lastrowBackground}>
            <View style={styles.lastrow}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Select Bank For Payment');
                }}>
                <Surface
                  elevation={1}
                  category="medium"
                  style={styles.cardsurface}>
                  <Text
                    style={{
                      fontSize: RFValue(16),
                      color: 'black',
                      fontWeight: 'bold',
                      marginTop: 10,
                    }}>
                    Payments
                  </Text>
                  <Image source={Payments.image} style={styles.images} />
                </Surface>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ConsentsforVRP');
                }}>
                <Surface
                  elevation={1}
                  category="medium"
                  style={styles.cardsurface}>
                  <Text
                    style={{
                      fontSize: RFValue(16),
                      color: 'black',
                      fontWeight: 'bold',
                      marginTop: 10,
                    }}>
                    VRP
                  </Text>
                  <Image source={VRP.image} style={styles.images} />
                </Surface>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bottombar}>
            <BottomTab />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottombar: {
    marginBottom: 0,
    height: 50,
    width: '100%',
    backgroundColor: '#5a287d',
  },
  image: {
    width: 50,
    height: 100,
    // aspectRatio:1,
    // marginTop: -hp('60%'),
    resizeMode: 'contain',
    // borderRadius: 8,
    // marginBottom: 8,
    // marginLeft: hp('7%'),
    // marginRight: -hp('6%')
  },
  surface: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  addBankContainer: {
    width: '100%',
    height: 200,
    backgroundColor: 'white',
    resizeMode: 'contain',
  },
  ListContainer: {
    paddingHorizontal: 5,
  },

  lastrowBackground: {
    backgroundColor: '#5a287d',
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  lastrow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cardsurface: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  images: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
  searchbar: {
    marginBottom: 0,
    borderRadius: 20,
    backgroundColor: 'white',
  },
});

export default Landing;
