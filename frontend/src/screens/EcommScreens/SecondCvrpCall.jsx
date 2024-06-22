import {ScrollView, StyleSheet, View, Alert} from 'react-native';
import {Card, Divider, Icon, IconButton, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import ApiFactory from '../../../ApiFactory/ApiFactory';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useEffect, useState} from 'react';
import {
  Keyboard,
  Pressable,
  TouchableOpacity,
  VirtualizedList,
} from 'react-native';
import AndroidClient from '../../../DatabaseFactory/AndroidClientDb';

import {useIsFocused} from '@react-navigation/native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const switchEnvironment = (newEnv, bankName) => {
  global.env = newEnv; // Update the global environment variable
  const apiFactory = new ApiFactory();
  const apiClient = apiFactory.createApiClient(global.env, 'vrp', bankName);
  return apiClient;
  // Use the new apiClient as needed
};

const SecondCvrpCall = ({route}) => {
  const {totalAmount, debitordetails, customerdetails, consentId} =
    route.params;
  const isFocused = useIsFocused();
  const [vrpData, setVrpData] = useState(null);
  // let androidClientVrp = new AndroidClient('NWG', 'Sandbox', 'vrp');
  // const debitorDetails=(debitordetails);
  // const customerDetails=(customerdetails);
  // console.log(JSON.parse(customerdetails));
  let androidClientVrp;
  if (route.params.bankName === 'Natwest') {
    androidClientVrp = new AndroidClient('NWG', 'Sandbox', 'vrp');
  }
  if (route.params.bankName === 'Ulster') {
    androidClientVrp = new AndroidClient('UBN', 'Sandbox', 'vrp');
  }
  if (route.params.bankName === 'RBS') {
    androidClientVrp = new AndroidClient('RBS', 'Sandbox', 'vrp');
  }
  useEffect(() => {
    const newApiClient = switchEnvironment(global.env, route.params.bankName);
    setEnvApiClient(newApiClient);
    const fetchData = async () => {
      if (isFocused) {
        try {
          console.log(consentId);
          // VRP-a883310d-3233-4872-b790-3d060b5ce516
          const data = await androidClientVrp.fetchDataUsingConsentId(
            consentId,
          );
          // const data = await androidClientVrp.displayData();
          console.log('data in second vrp call', data[0].refreshToken);
          setVrpData(data[0]);
        } catch (error) {
          console.error(
            'Error fetching data in second vrp call screen:',
            error,
          );
        }
      }
    };
    fetchData();
  }, [isFocused, consentId]);
  const [EnvApiClient, setEnvApiClient] = useState(null);

  const navigation = useNavigation();
  // console.log((customer));
  // console.log(debitorDetails.DebtorAccount);
  const handleSubmit = async () => {
    // console.log(data);
    const formData = {
      firstName: 'Natwest Cart',
      sortCode: '000996',
      accountNumber: '50499910',
      reference: 'Tools',
      amount: String(totalAmount),
    };
    try {
      const selectconsentData = {
        consentId: consentId,
        refreshToken: vrpData.refreshToken,
      };
      console.log(selectconsentData);
      // console.log( "data2",JSON.parse(vrpData.refreshToken));
      const response = await EnvApiClient.refreshTokenForVRP(
        selectconsentData,
        formData,
      );
      console.log('response', response);
      if (response.Data.Status === 'AcceptedSettlementCompleted') {
        navigation.navigate('Order Placed');
      } else {
        Alert.alert('Payment Failed ', 'Account Balance is insufficient', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        console.log('error');
      }
    } catch (error) {
      console.log('error in fetching refresh', error);
    }
  };
  return (
    <>
      <ScrollView style={{backgroundColor: '#A6E4FD', flex: 1}}>
        <View style={styles.container}>
          {/* to add multiple styles */}
          <View style={{height: wp('5%')}} />
          <Text style={{fontSize: wp('5%'), fontWeight: 'bold'}}>
            Selected Account
          </Text>
          <Card style={styles.card}>
            <View style={styles.cardTitleContainer}>
              <Card.Content>
                <Text style={styles.title}>
                  {customerdetails.data.name.given_name}{' '}
                  {customerdetails.data.name.family_name}
                </Text>
              </Card.Content>
              <Card.Actions>
                <IconButton
                  icon="chevron-right"
                  mode="outlined"
                  iconColor={'black'}
                  size={wp('7%')}
                  style={{marginTop: hp('1.5%'), marginLeft: wp('3.5%')}}
                  // onPress={() => navigation.navigate('Order Placed')}
                />
              </Card.Actions>
            </View>
            <Divider style={styles.divider} />
            <Card.Content>
              <Text style={{fontSize: wp('5%')}}>Current Account</Text>
              <Text>{debitordetails.DebtorAccount.Identification}</Text>
            </Card.Content>
            <View style={{height: wp('1%')}} />
            <Card style={styles.selectedCard}>
              <View style={styles.cardTitleContainer}>
                <Card.Content>
                  <Text>Account Selected</Text>
                </Card.Content>
                <Card.Actions>
                  <MaterialCommunityIcons
                    name="check-circle"
                    color="white"
                    size={35}
                  />
                </Card.Actions>
              </View>
            </Card>
          </Card>

          <View style={{height: wp('5%')}} />
          <Text style={{fontSize: wp('5%'), fontWeight: 'bold'}}>
            Payment Details
          </Text>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Payment</Text>
              <Divider style={styles.divider} />
              <View style={{height: wp('1%')}} />
              <Text Text style={{fontSize: wp('5%')}}>
                Amount
              </Text>
              <Text>£{totalAmount}</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.footer}
          activeOpacity={1}>
          <Text style={styles.footerText}>Make Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Online Store');
          }}
          style={styles.footer}
          activeOpacity={1}>
          <Text style={styles.footerText}>Cancel Payment</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    alignContent: 'center',
    margin: 8,
    padding: 10,
    elevation: 5,
    borderColor: '#114188',
    borderRadius: 5,
    borderWidth: 2,
    flex: 1,
  },
  selectedCard: {
    backgroundColor: '#70CDF5',
    borderColor: '#3559AA',
    borderRadius: 5,
    margin: 8,
    borderWidth: 3,
    flex: 1,
  },
  bottom: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderColor: '#3559AA',
    borderRadius: 5,
    // margin: 8,
    padding: wp('3%'),
    borderWidth: 3,
  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 0,
  },
  chevron: {
    marginRight: 10,
    paddingLeft: 0,
  },
  divider: {
    marginVertical: 10,
    height: 2, // Increase height to make it more visible
    backgroundColor: '#3559AA',
  },
  footer: {
    paddingVertical: wp('1.6%'), // Vertical padding
    margin: 10, // Add space between the buttons
    alignItems: 'center', // Center text horizontally
    borderRadius: 20,
    borderColor: '#3559AA',
    backgroundColor: '#3559AA',
    borderWidth: 3,
    width: wp('80%'),
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('5%'),
  },
});

export default SecondCvrpCall;
