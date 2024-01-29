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
} from 'react-native';
import {Surface, FAB} from '@react-native-material/core';
import {Icon, Searchbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
          <View
            style={{
              backgroundColor: '#c8e1cc',
              width: '100%',
              height: '500',
              borderRadius: 20,
              padding: 10,
              margin: 10,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: 'black',
                margin: 10,
              }}>
              Added Banks
            </Text>
            <FlatList
              data={cards}
              renderItem={renderCard}
              keyExtractor={item => String(item.id)}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={snapToInterval}
              contentContainerStyle={{
                ...styles.flatListContainer,
                backgroundColor: '#c8e1cc',
                justifyContent: 'space-around',
              }}
            />
          </View>
          <View style={styles.addBankContainer}>
            <Image
              style={styles.addbank}
              source={require('../assets/icons/bank.png')}
            />
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
    backgroundColor: '#5a28d',
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
  addbank: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  flatListContainer: {
    paddingHorizontal: 5,
  },
  addBankContainer: {
    alignItems: 'center',
  },
  lastrowBackground: {
    backgroundColor: '#5a287d',
    width: '100%',
    height: 300,
    borderRadius: 10,
    // marginTop:100
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
    marginTop: 80,
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
