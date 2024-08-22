import React, {useEffect, useState, useRef, useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  ScrollView,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Card, Title, Paragraph, Text, IconButton} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ViewAll = () => {
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

  const fetchData = async () => {
    try {
      console.log('I AM IN VIEWALL.jsx');
      const dataNWG = JSON.parse(await AsyncStorage.getItem('NWG_accounts')) || [];
      const dataHSBC = JSON.parse(await AsyncStorage.getItem('HSBC_accounts')) || [];
      const dataUBN = JSON.parse(await AsyncStorage.getItem('UBN_accounts')) || [];
      const dataRBS = JSON.parse(await AsyncStorage.getItem('RBS_accounts')) || [];
      let data = [];

      if (dataNWG.length > 0) {
        data = [...data, ...dataNWG];
      }
      if (dataHSBC.length > 0) {
        data = [...data, ...dataHSBC];
      }
      if (dataRBS.length > 0) {
        data = [...data, ...dataRBS];
      }
      if (dataUBN.length > 0) {
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
    }, [])
  );

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
      })
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
                <Card.Cover
                  source={getImageSource(account.AccountSubType)}
                  style={styles.coverImage}
                />
                <Card.Content style={styles.cardContent}>
                  <Title style={styles.title}>{account.AccountSubType}</Title>
                  <Paragraph style={styles.additionalInfo}>
                    {account.Account[0]?.Identification}
                  </Paragraph>
                  <Paragraph style={styles.additionalInfo}>
                    {account.Nickname}, {item.bankName}
                  </Paragraph>
                </Card.Content>
              </Card>
            ));
          })}
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
