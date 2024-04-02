import React from 'react';
import {
  Card,
  Title,
  Text,
  Divider,
  IconButton,
  MD3Colors,
} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {StyleSheet, View} from 'react-native';

const VrpTransactionCard = ({transaction}) => {
  // console.log("list",transaction.vrppayload);
  const list=JSON.parse(transaction.vrppayload);
  // console.log("string::",list.Instruction.InstructedAmount.Currency);
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.transactionRow}>
          <View style={styles.transactionDetail}>
              <IconButton
                icon="arrow-top-right"
                mode="contained-tonal"
                iconColor="red"
                style={styles.icon}
                size={wp('5%')}
              />
            
            <Text style={styles.indicatorText}>
              Debited
            </Text>
          </View>
          <Text style={styles.amountText}>
          £{list.Instruction.InstructedAmount.Amount}
          </Text>
        </View>
      </Card.Content>

      <Divider style={styles.divider} />

      <Card.Content>
        <View>
          <Text style={styles.title}>CreditorAccountNumber: {list.Initiation.CreditorAccount.Identification}</Text>
          <Text style={styles.text}>
            Transaction ID: {transaction.vrpid}
          </Text>
          <Text style={styles.text}>
          CreditorAccountName: {list.Initiation.CreditorAccount.Name}
          </Text>
          
          
          <View style={styles.dateTimeContainer}>
            <Text style={styles.text}>
            CreationDateTime: {new Date(list.CreationDateTime).toLocaleDateString()}
            </Text>
            
          </View>
          <View style={styles.dateTimeContainer}>
          <Text style={styles.text}>
            StatusUpdateDateTime: {new Date(list.StatusUpdateDateTime).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: wp('1%'),
    padding: wp('1%'),
    borderRadius: wp('1%'),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDetail: {
    flexDirection: 'row',
    marginLeft: wp('1%'),
  },
  indicatorText: {
    color: '#5a287d',
    fontSize: wp('4.6%'),
    fontWeight: 'bold',
    marginTop: hp('1.2%'),
    marginLeft: wp('1%'),
  },
  icon: {
    fontWeight: 'bold',
    marginLeft: -wp('1.5%'),
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
  divider: {
    borderBottomWidth: wp('0.6%'),
    borderBottomColor: '#d3d3d3',
    margin: wp('0.8%'),
  },
  title: {
    fontSize: wp('3.8%'),
    fontWeight: 'bold',
    marginVertical: hp('1%'),
  },
  text: {
    fontSize: wp('3.8%'),
    fontWeight:'normal',
    marginVertical: hp('0.5%'),
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
});

export default VrpTransactionCard;
