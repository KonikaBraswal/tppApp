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
import {RFValue} from 'react-native-responsive-fontsize';
import {fetchAISPData} from '../../database/LocalDatabase';
import AndroidClient from '../../DatabaseFactory/AndroidClientDb';
const {width} = Dimensions.get('window');
const cardWidth = width * 0.95;
const AccountListWithRefreshToken = ({route}) => {
  const {bankName} = route.params || {};
  console.log('BankName', bankName);
  const androidClientAispNWG = new AndroidClient('NWG', 'Sandbox', 'accounts');
  const androidClientAispHSBC = new AndroidClient(
    'HSBC',
    'Sandbox',
    'accounts',
  );
  const androidClientAispRBS = new AndroidClient('RBS', 'Sandbox', 'accounts');
  const androidClientAispUBN = new AndroidClient('UBN', 'Sandbox', 'accounts');

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [retrievedData, setRetrievedData] = useState([]);
  const [localData, setlocalData] = useState([]);

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

  useEffect(() => {
    if (global.env === 'local') {
      fetchAISPData().then(results => {
        setlocalData(results);
      });
    } else {
      const fetchData = async () => {
        try {
          const dataNWG = await androidClientAispNWG.displayData();
          const dataHSBC = await androidClientAispHSBC.displayData();
          const dataRBS = await androidClientAispRBS.displayData();
          const dataUBN = await androidClientAispUBN.displayData();

          //const data= [...dataNWG, ...dataHSBC];

          let data = [];
          if (bankName == 'all') {
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
          } else if (bankName == 'Natwest') {
            data = dataNWG;
          } else if (bankName == 'HSBC') {
            data = dataHSBC;
          }else if (bankName == 'Ulster') {
            data = dataUBN;
          }else if (bankName == 'RBS') {
            data = dataRBS;
          } else {
            data = [];
            console.log('Wrong bank');
          }
          const filtered = data.filter(entry => entry.scope === 'accounts');
          const filteredData = removeDuplicateAccounts(filtered);

          console.log(filteredData, '------------------');
          setRetrievedData(filteredData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
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
            {retrievedData && retrievedData.length > 0 ? (
              retrievedData.map((item, index) => {
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

                if (item.bankName == 'HSBC') {
                  imageSource = require('../assets/images/hsbc.png');
                } else if (item.bankName == 'Ulster') {
                  imageSource = require('../assets/images/Ubn2.png');
                } else if (item.bankName == 'RBS') {
                  imageSource = require('../assets/images/Rbs2.png');
                } else {
                  imageSource = require('../assets/images/natwest2.png'); // replace with your other image path
                }

                return accounts.map((account, idx) => (
                  <Card key={account.AccountId} style={styles.card}>
                    <Card.Content>
                      <View style={styles.cardHeader}>
                        <Title style={[styles.title, {marginTop: -hp('1%')}]}>
                          {account.AccountSubType} Account
                        </Title>
                        <Image
                          source={imageSource}
                          //source={require('../assets/images/natwest2.png')}
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
                                    bankName: item.bankName,
                                  })
                                }
                              />
                              <Text
                                style={{
                                  fontSize: RFValue(18),
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
                                    bankName: item.bankName,
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
                                  navigation.navigate(
                                    'View Added Bank Details',
                                    {
                                      AccountId: account.AccountId,
                                      bankName: item.bankName,
                                    },
                                  );
                                }}
                                style={styles.iconButton}
                              />
                            </Card.Actions>
                          </View>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                ));
              })
            ) : localData && localData.length > 0 ? (
              localData.map(account => (
                <Card key={account.accID} style={styles.card}>
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <Title style={[styles.title, {marginTop: -hp('1%')}]}>
                        {account.accsubType} Account
                      </Title>
                      <Image
                        source={require('../assets/images/natwest2.png')}
                        style={styles.iconNatwest}
                      />
                    </View>
                    <View style={styles.cardContent}>
                      <View style={styles.textContainer}>
                        <Paragraph>{account.accID}</Paragraph>
                        <Paragraph>{account.debtorname}</Paragraph>
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
                                    SchemeName: 'UK.OBIE.SortCodeAccountNumber',
                                    Identification: account.accnum,
                                    Name: account.debtorname,
                                  },
                                })
                              }
                            />
                            <Text
                              style={{
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                color: '#5a287d',
                                marginLeft: -wp('2%'),
                              }}
                              onPress={() =>
                                navigation.navigate('Transfer Money', {
                                  DebtorAccount: {
                                    SchemeName: 'UK.OBIE.SortCodeAccountNumber',
                                    Identification: account.accnum,
                                    Name: account.debtorname,
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
                                navigation.navigate('Local Transactions');
                              }}
                              style={styles.iconButton}
                            />
                          </Card.Actions>
                        </View>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Text>No data</Text>
            )}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Select Your Bank');
              }}>
              {/* TouchableOpacity content goes here */}
            </TouchableOpacity>
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
