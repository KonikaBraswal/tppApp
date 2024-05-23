import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Divider} from 'react-native-paper';
import ResponseToggler from '../components/ResponseToggler';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ApiLogDetails = ({route}) => {
  const {log} = route.params; // Get log data from navigation route
  const responseData = JSON.parse(log.response);

  return (
    <ScrollView>
      <View
        style={{
          padding: wp('2.5%'),
          marginVertical: hp('3%'),
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <View style={styles.dataContainer}>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{log.date}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{log.time}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.label}>API Name</Text>
            <Text style={styles.value}>{log.api_name}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Scope</Text>
            <Text style={styles.value}>{log.scope}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>
              {responseData.status_code} {log.status}
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          fontSize: RFValue(20),
          color: '#5a287d',
          fontWeight: 'bold',
          marginLeft: hp('2%'),
          marginBottom: 10,
        }}>
        Response
      </Text>
      {Object.keys(responseData).map((key, index) => (
        <ResponseToggler
          key={index}
          keyText={key}
          valueText={responseData[key]}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dataContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 190, 190, 0.6)',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('5%'),
    marginTop: hp('1%'),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
  },

  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('0.5%'),
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: RFValue(16),
    color: '#5a287d',
  },
  value: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: RFValue(16),
    color: 'brown',
  },
});

export default ApiLogDetails;
