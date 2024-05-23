import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Divider} from 'react-native-paper';
import ResponseToggler from '../components/ResponseToggler';

const ApiLogDetails = ({route}) => {
  const {log} = route.params; // Get log data from navigation route
  const responseData = JSON.parse(log.response);

  return (
    <ScrollView>
      <View
        style={{
          padding: 10,
          marginVertical: 15,
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
          fontSize: 20,
          color: '#5a287d',
          fontWeight: 'bold',
          marginLeft: 20,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
  },

  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 18,
    color: '#5a287d',
  },
  value: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 18,
    color: 'brown',
  },
});

export default ApiLogDetails;