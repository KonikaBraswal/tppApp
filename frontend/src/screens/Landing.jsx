import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Surface, FAB} from '@react-native-material/core';
import {Icon, Searchbar, Card, Title} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ViewAll from '../components/ViewAll';

const Landing = () => {
  const navigation = useNavigation();

  const cards = [
    {id: 1, name: 'Natwest', icon: require('../assets/icons/natwest.png')},
    {id: 2, name: 'Barclays', icon: require('../assets/icons/barclays.png')},
    {id: 3, name: 'Lloyds', icon: require('../assets/icons/lloyds.png')},
    {id: 5, name: 'Monzo', icon: require('../assets/icons/monzo.png')},
    {id: 6, name: 'Santander', icon: require('../assets/icons/santander.png')},
  ];

  const renderCard = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        // navigation.navigate('Your Accounts', {
        //   selectedIcon: item.icon,
        //   selectedBank: item.name,
        // })
        navigation.navigate('Consent')
      }>
      <Surface elevation={6} category="medium" style={styles.surface}>
        <Image source={item.icon} style={styles.icon} />
      </Surface>
    </TouchableOpacity>
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

  return (
    <KeyboardAwareScrollView
      style={{flex: 1, backgroundColor: 'white'}}
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled">
      <View style={{flex: 1}}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
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
            }}>
            <View
              style={{
                flexDirection: 'column',
                marginTop: 45,
                marginHorizontal: 10,
              }}>
              <FAB
                icon={() => <Icon source="plus" color="white" size={20} />}
                style={{alignSelf: 'center', backgroundColor: 'black'}}
                onPress={AddBank}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  marginBottom: 40,
                  marginTop: 10,
                }}>
                Add Bank Account
              </Text>
            </View>
            {cards.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  if (item.name === 'Natwest') {
                    navigation.navigate('Your Natwest Accounts');
                  } else if (item.name === 'Barclays') {
                    navigation.navigate('Your Barclays Accounts');
                  }
                }}>
                <Surface elevation={6} category="medium" style={styles.surface}>
                  <Image source={item.icon} style={styles.icon} />
                </Surface>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.addBankContainer}>
            <ViewAll />
          </View>
          <View style={styles.lastrowBackground}>
            <View style={styles.lastrow}>
              <TouchableOpacity>
                <Surface
                  elevation={1}
                  category="medium"
                  style={styles.cardsurface}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontWeight: 'bold',
                      marginTop: 10,
                    }}>
                    Payments
                  </Text>
                  <Image source={Payments.image} style={styles.images} />
                </Surface>
              </TouchableOpacity>
              <TouchableOpacity>
                <Surface
                  elevation={1}
                  category="medium"
                  style={styles.cardsurface}>
                  <Text
                    style={{
                      fontSize: 16,
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
    backgroundColor: '#5a287d',
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
