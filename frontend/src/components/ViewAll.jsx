import React, {useEffect, useState, useRef,useCallback} from 'react';
import {  useFocusEffect } from '@react-navigation/native';

import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Card, Title, Paragraph, Text, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {RetrieveData} from '../../database/Database';
import AndroidClient from '../../DatabaseFactory/AndroidClientDb';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ViewAll = () => {
  const androidClientAispNWG = new AndroidClient('NWG', 'Sandbox', 'accounts');
  const androidClientAispHSBC = new AndroidClient(
    'HSBC',
    'Sandbox',
    'accounts',
  );
  const androidClientAispUBN = new AndroidClient('UBN', 'Sandbox', 'accounts');
  const androidClientAispRBS = new AndroidClient('RBS', 'Sandbox', 'accounts');
  const navigation = useNavigation();
  const [retrievedData, setRetrievedData] = useState([]);

  const removeDuplicateAccounts = arr => {
    const seen = {};
    return arr.filter(item => {
      const key = `${item.AccountId}-${item.bankName}`;
      if (seen[key]) {
        return false;
      } else {
        seen[key] = true;
        return true;
      }
    });
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       console.log('I AM IN VIEWALL.jsx');
  //       const dataNWG = await androidClientAispNWG.displayData();
  //       const dataHSBC = await androidClientAispHSBC.displayData();
  //       const dataUBN = await androidClientAispUBN.displayData();
  //       const dataRBS = await androidClientAispRBS.displayData();
  //       let data = [];

  //       // Check if dataNWG is not empty
  //       if (dataNWG && dataNWG.length > 0) {
  //         data = [...data, ...dataNWG];
  //       }

  //       // Check if dataHSBC is not empty
  //       if (dataHSBC && dataHSBC.length > 0) {
  //         data = [...data, ...dataHSBC];
  //       }
  //       if (dataRBS && dataRBS.length > 0) {
  //         data = [...data, ...dataRBS];
  //       }
  //       if (dataUBN && dataUBN.length > 0) {
  //         data = [...data, ...dataUBN];
  //       }
  //       const filtered = data.filter(entry => entry.scope === 'accounts');
  //       const filteredData = removeDuplicateAccounts(filtered);

  //       console.log('accounts', filteredData);
  //       setRetrievedData(filteredData);
  //       console.log('Length of data', retrievedData.length);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const fetchData = async () => {
    try {
      console.log('I AM IN VIEWALL.jsx');
      const dataNWG = await androidClientAispNWG.displayData();
      const dataHSBC = await androidClientAispHSBC.displayData();
      const dataUBN = await androidClientAispUBN.displayData();
      const dataRBS = await androidClientAispRBS.displayData();
      let data = [];

      // Check if dataNWG is not empty
      if (dataNWG && dataNWG.length > 0) {
        data = [...data, ...dataNWG];
      }

      // Check if dataHSBC is not empty
      if (dataHSBC && dataHSBC.length > 0) {
        data = [...data, ...dataHSBC];
      }
      if (dataRBS && dataRBS.length > 0) {
        data = [...data, ...dataRBS];
      }
      if (dataUBN && dataUBN.length > 0) {
        data = [...data, ...dataUBN];
      }
      const filtered = data.filter(entry => entry.scope === 'accounts');
      const filteredData = removeDuplicateAccounts(filtered);

      console.log('accounts', filteredData);
      setRetrievedData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []) // Empty dependency array ensures fetchData runs only once when the screen is focused
  );

  // Helper function to determine the image source based on AccountId
  const getImageSource = subtype => {
    if (!subtype) {
      console.error('Invalid subtype:', subtype);
      return require('../assets/images/bank.png'); // Default image
    }
    switch (subtype) {
      case 'CurrentAccount':
        return require('../assets/images/card2.png');
      default:
        return require('../assets/images/card1.png');
    }
  };
  const screenWidth = Dimensions.get('window').width;
  const translateX = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: screenWidth,
        duration: 7000,
        useNativeDriver: true,
      }),
    ).start();
  }, [translateX, screenWidth]);
  return (
    <View style={{flex: 1, marginTop: 5}}>
      {retrievedData.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{padding: 8}}>
          {retrievedData.map((item, index) => {
            const accounts = (() => {
              if (!item.accountsList) {
                console.error('accountsListString is null or undefined');
                return [];
              }
              try {
                const parsedAccounts = JSON.parse(item.accountsList);
                return parsedAccounts.Account || [];
              } catch (error) {
                console.error('Error parsing accountsList:', error);
                return [];
              }
            })();

            return accounts.map((account, idx) => (
              <Card
                key={`${index}-${idx}`} // Ensures each card has a unique key
                style={styles.card}
                onPress={() => {
                  console.log(item.bankName);
                  navigation.navigate('View Added Bank Details', {
                    AccountId: account.AccountId,
                    bankName: item.bankName,
                  });
                }}>
                {/* Conditionally select the cover image based on AccountSubType */}
                <Card.Cover
                  source={getImageSource(account.AccountSubType)}
                  style={styles.coverImage}
                />
                <Card.Content style={styles.cardContent}>
                  <Title style={styles.title}>{account.AccountSubType}</Title>
                  {/* Display Identification and Nickname from the first account in the accounts array */}
                  <Paragraph style={styles.additionalInfo}>
                    {account.Account[0]?.Identification}
                  </Paragraph>
                  <Paragraph style={styles.additionalInfo}>
                    {account.Nickname},{item.bankName}
                  </Paragraph>
                </Card.Content>
              </Card>
            ));
          })}
          {/* "View All" Card */}
          <Card style={{elevation: 3}}>
            <Card.Content>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 40,
                  fontWeight: 'bold',
                  fontSize: RFValue(18),
                  color: '#5a287d',
                }}>
                View All
              </Text>
              <IconButton
                mode="contained-tonal"
                icon="chevron-right"
                color="#5a287d"
                containerColor="rgba(90, 40, 125, 0.3)"
                size={26}
                style={{
                  marginLeft: 15,
                }}
                onPress={() =>
                  navigation.navigate('Added Bank Accounts', {bankName: 'all'})
                }
              />
            </Card.Content>
          </Card>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'rgba(232, 232, 232, 0.3)',
              alignContent: 'center',
              width: '100%',
              padding: hp('0.5%'),
            }}>
            <Animated.View
              style={[styles.contentContainer, {transform: [{translateX}]}]}>
              <Text style={styles.text}>No Added Bank Accounts</Text>
              <IconButton icon="bank-plus" iconColor="#5a287d" />
            </Animated.View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 16,
    width: 275,
    overflow: 'hidden',
    height: '100%',
  },
  coverImage: {
    height: '110%',
    resizeMode: 'cover',
    marginTop: -10,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    color: 'white',
    fontSize: RFValue(15),
    marginBottom: -6,
  },
  additionalInfo: {
    color: 'white',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(200, 225, 204, 0.5)',
  },
  text: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#5a287d',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ViewAll;
