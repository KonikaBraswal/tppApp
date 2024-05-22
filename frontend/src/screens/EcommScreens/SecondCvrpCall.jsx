import { ScrollView, StyleSheet, View, Alert } from "react-native";
import { Card, Divider, IconButton, Text } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
import {
  Keyboard,
  Pressable,
  TouchableOpacity,
  VirtualizedList,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';

import { fetchAllDataforScope } from '../../../database/Database';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

const SecondCvrpCall = ({ route }) => {
  const { totalAmount, data } = route.params;
  const navigation = useNavigation();
  const debitorDetails = JSON.parse(data.account_details);
  const payload = JSON.parse(data.consentpayload);
  const customer = JSON.parse(data.customer_details);
  const handleSubmit = async () => {
    console.log(data);
    const formData = {
      firstName: 'Natwest Cart',
      sortCode: '000996',
      accountNumber: '50499910',
      reference: 'Tools',
      amount: String(totalAmount),
    };
    try {
      const selectconsentData = {
        consentid: debitorDetails.ConsentId,
        refreshtoken: data.refreshedtoken
      };
      console.log("details", selectconsentData);
      const response = await sandboxApiClient.refreshToken(
        selectconsentData,
        formData,
      );
      console.log('response', response);
      if (response.Data.Status === 'AcceptedSettlementCompleted') {
        navigation.navigate('Order Placed');
      } else {
        Alert.alert('Payment Failed ', 'Amount Balance is insufficient', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        console.log("error");
      }
    } catch (error) {
      console.log('error in fetching refresh', error);
    }
  }
  return (
    <>
      <ScrollView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <View style={styles.cardTitleContainer}>
              <Card.Content>
                <Text style={styles.title}>Current Account</Text>
              </Card.Content>
              <Card.Actions>
                <IconButton
                  icon="chevron-right"
                  mode="outlined"
                  iconColor={'black'}
                  size={wp('7%')}
                  style={{ marginTop: hp('1.5%'), marginLeft: wp('3.5%') }}
                  onPress={() => navigation.navigate('Order Placed')}
                />
              </Card.Actions>
            </View>
            <Card.Content>
              <Text>Identification</Text>
              <Text>{debitorDetails.DebtorAccount.Identification}</Text>
            </Card.Content>
            <Card style={styles.selectedCard}>
              <Card.Content>
                <Text>Account Selected</Text>
                <Card.Actions>
                <IconButton
                  icon="tick"
                  mode="outlined"
                  iconColor={'black'}
                  size={wp('7%')}
                  style={{ marginTop: hp('1.5%'), marginLeft: wp('1.5%') }}
                  onPress={() => navigation.navigate('Order Placed')}
                />
              </Card.Actions>
              </Card.Content>
            </Card>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Account</Text>
              <Divider style={styles.divider} />
              <Text>To</Text>
              <Text>{payload.Initiation.CreditorAccount.Name}</Text>
              <Divider style={styles.divider} />
              <Text>From</Text>
              <Text>{customer.data.name.full_name}</Text>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Payment</Text>
              <Divider style={styles.divider} />
              <Text>Amount</Text>
              <Text>£{totalAmount}</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.footer}
          activeOpacity={1}>
          <Text style={styles.footerText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.footer}
          activeOpacity={1}>
          <Text style={styles.footerText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    
    </>

  );

};

const styles = StyleSheet.create({
  card: {
    alignContent: 'center',
    margin: 8,
    padding: 10
  },
  selectedCard: {
    backgroundColor: '#FFFFF',
    borderColor: 'grey',
    borderRadius: 8,
    margin: 8,
    borderWidth:3
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor:'white',
    
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
  },
  chevron: {
    marginRight: 10,
  },
  divider: {
    marginVertical: 10,
  },
  footer: {
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20,
    margin: 10,// Add space between the buttons
    alignItems: 'center', // Center text horizontally
    borderRadius: 20,
    borderColor:'#EDDDF3',
    borderWidth:3
  },
  footerText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: wp('5%'),
  },
});

export default SecondCvrpCall;