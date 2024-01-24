import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {Divider, Card, Surface, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Footer from '../components/Footer';

const HomeScreen = () => {
  const navigation = useNavigation();
  const handleAddBankClick = () => {
    navigation.navigate('AddBank');
  };
  return (
    <>
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text style={styles.headerText}>Added Banks</Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginLeft: 5,
            marginVertical: 10,
          }}>
          <Surface style={styles.surface}>
            <Image
              source={require('../assets/images/natwest.png')}
              style={{
                width: 50,
                height: 70,
              }}
            />
          </Surface>
          <Surface style={styles.surface}>
            <Image
              source={require('../assets/images/barclays.png')}
              style={{
                width: 70,
                height: 70,
              }}
            />
          </Surface>
        </View>
        <Divider
          style={{
            marginVertical: 80,
            height: 2,
            marginHorizontal: 12,
          }}
        />
      </View>
      <View
        style={{
          flex: 2,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 80,
        }}>
        <IconButton
          icon="bank-plus"
          iconColor={'#36013f'}
          size={60}
          onPress={handleAddBankClick}
        />
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            color: '#36013f',
          }}
          onPress={handleAddBankClick}>
          Add Bank Account
        </Text>
      </View>
      <View
        style={{
          flex: 3,
          flexDirection: 'row',
          backgroundColor: '#4B0082',
          padding: 12,
        }}>
        <Card
          style={{
            flex: 1,
            marginHorizontal: 5,
            height: '20%',
            marginTop: 3,
            marginHorizontal: 5,
            paddingTop: 20,
            marginRight: 20,
            backgroundColor: 'white',
          }}>
          <Card.Cover source={require('../assets/images/payments.png')} />
        </Card>
        <Card
          style={{
            flex: 1,
            marginHorizontal: 5,
            height: '20%',
            marginTop: 3,
            marginHorizontal: 5,
            paddingTop: 20,
            backgroundColor: 'white',
          }}>
          <Card.Cover source={require('../assets/images/VRP.png')} />
        </Card>
      </View>
    </View>
    <Footer/>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#36013f',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  surface: {
    height: 10,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
    marginTop: 30,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
