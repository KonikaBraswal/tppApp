import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ResponseToggler from '../screens/ResponseToggler'; // Make sure this path is correct

const ApiLogDetails = ({ route }) => {
  const { log } = route.params; // Get log data from navigation route
  const responseData = JSON.parse(log.response);

  // Function to recursively render JSON data
  const renderJsonData = (data, level = 0) => {
    if (!data || typeof data !== 'object') {
      return null; // Return null if data is null or not an object
    }

    return (
      <View key={level} style={{ marginLeft: level * 10 }}>
        {Object.keys(data).map((key, index) => {
          const value = data[key];
          if (typeof value === 'object' && value !== null) {
            // If value is an object or array, render it recursively
            return (
              <View key={index} style={styles.responseContainer}>
                <ResponseToggler
                  keyText={key}
                  valueText={renderJsonData(value, level + 1)}
                />
              </View>
            );
          } else {
            // Render non-object values directly
            return (
              <View key={index} style={styles.responseContainer}>
                <Text style={styles.responseKey}>{key}</Text>
                <Text style={styles.responseValue}>{value}</Text>
              </View>
            );
          }
        })}
      </View>
    );
  };

  return (
    <ScrollView>
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
            <Text style={styles.value}>{log.status}</Text>
          </View>
        </View>
      <Text style={styles.responseHeader}>Response</Text>
      {/* Render each key-value pair from responseData */}
      {/* {renderJsonData(responseData)}    */}
      {/* if dropdown required, uncomment above and remove below view */}
      <View style={styles.responseContainer}>
        <Text style={styles.responseJson}>
          {JSON.stringify(responseData, null, 2)}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dataContainer: {
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(220, 190, 190, 0.6)',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('5%'),
    marginTop: hp('1%'),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    width: wp('60%'),
    alignSelf: 'center'
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
    position: 'left'
  },
  value: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: RFValue(16),
    color: 'brown',
  },
  responseHeader: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: '#5a287d',
    marginLeft: hp('2%'),
    marginBottom: 10,
  },
  responseContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    elevation: 3,
  },
  responseKey: {
    fontWeight: 'bold',
    fontSize: RFValue(14),
    color: '#5a287d',
  },
  responseValue: {
    fontSize: RFValue(14),
    color: 'brown',
    marginLeft: 10,
  },
  responseContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    margin: hp('2%'),
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    elevation: 3,
    alignSelf: 'center',
    width: wp('90%'), // Match the width of dataContainer
  },

  // responseJson: {
  //   fontSize: RFValue(14),
  //   color: 'brown',
  // },
});

export default ApiLogDetails;


