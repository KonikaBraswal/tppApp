import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  IconButton,
  Icon,
} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RetrieveData} from '../../database/Database';

const {width} = Dimensions.get('window');
const cardWidth = width * 0.95;
const AccountListWithRefreshToken = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const [retrievedData, setRetrievedData] = useState([]);
  const filterDataByScope = data => {
    return data.filter(obj => obj.scope === 'accounts');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await RetrieveData();
        const filteredData = filterDataByScope(data);
        console.log(filteredData, '------------------');
        setRetrievedData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <View
        style={{
          backgroundColor: '#5a287d',
          padding: 10,
        }}>
        <Searchbar
          placeholder="Search account by ID"
          onChangeText={setSearchQuery}
          value={searchQuery}
          icon={() => <Icon source="magnify" color="black" size={20} />}
          style={{
            borderRadius: 5,
            backgroundColor: '#f4ebfe',
          }}
        />
      </View>

      <View style={styles.container}>
        <View style={styles.mainContent}>
          <View style={styles.rowContainer}>
            <View style={styles.searchBarContainer}></View>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>
            {retrievedData &&
              retrievedData[0] &&
              retrievedData[0].account_details &&
              JSON.parse(retrievedData[0].account_details).map(account => (
                <Card key={account.AccountId} style={styles.card}>
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <Title style={[styles.title, {marginTop: -hp('1%')}]}>
                        {account.AccountSubType} Account
                      </Title>

                      <Image
                        source={require('../assets/images/natwest2.png')}
                        style={styles.iconNatwest}
                      />
                    </View>
                    <View style={styles.cardContent}>
                      <View style={styles.textContainer}>
                        <Paragraph>{account.AccountId}</Paragraph>
                        <Paragraph>{account.Account[0].Name}</Paragraph>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <IconButton
                              icon="wallet"
                              size={25}
                              iconColor="#482164"
                              style={{marginLeft: -wp('2%')}}
                              onPress={() =>
                                navigation.navigate('Transfer Money', {
                                  DebtorAccount: {
                                    SchemeName: account.Account[0].SchemeName,
                                    Identification:
                                      account.Account[0].Identification,
                                    Name: account.Account[0].Name,
                                  },
                                })
                              }
                            />
                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#5a287d',
                                marginLeft: -wp('2%'),
                              }}
                              onPress={() =>
                                navigation.navigate('Transfer Money', {
                                  DebtorAccount: {
                                    SchemeName: account.Account[0].SchemeName,
                                    Identification:
                                      account.Account[0].Identification,
                                    Name: account.Account[0].Name,
                                  },
                                })
                              }>
                              Transfer Money
                            </Text>
                          </View>
                          <Card.Actions>
                            <IconButton
                              icon="chevron-right"
                              size={22}
                              onPress={() => {
                                navigation.navigate('View Added Bank Details', {
                                  AccountId: account.AccountId,
                                });
                              }}
                              style={styles.iconButton}
                            />
                          </Card.Actions>
                        </View>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))}
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Select Your Bank');
          }}
          style={styles.footer}
          activeOpacity={1}>
          <Text style={styles.footerText}>Add New Bank Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  searchBar: {
    height: hp('8%'),
    borderRadius: 0,
    width: wp('90%'),
  },
  searchBarContainer: {
    margin: wp('1%'),
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: hp('1%'),
  },
  card: {
    marginBottom: hp('2%'),
    backgroundColor: '#c8e1cc',
    borderRadius: wp('2%'),
    elevation: 3,
    paddingTop: hp('1%'),
    width: cardWidth,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
  },
  iconNatwest: {
    width: wp('14.5%'),
    height: wp('14.5%'),
    resizeMode: 'contain',
    justifyContent: 'flex-end',
  },
  iconButton: {
    marginRight: -wp('0.5%'),
    marginLeft: wp('1%'),
  },
  cardContent: {
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    marginTop: -wp('1%'),
  },
  footer: {
    backgroundColor: '#5a287d',
    padding: wp('4.2%'),
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('5%'),
  },
});

export default AccountListWithRefreshToken;
