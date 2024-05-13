//finaldraft

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';


const ApiLogDetails = ({ route }) => {
  const { log } = route.params; // Get log data from navigation route
   //const responseData = JSON.parse(log.response);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>Api Log Details</Text>
        <View style={styles.tableRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{log.date}</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{log.time}</Text>
        </View>
        
        <View style={styles.tableRow}>
          <Text style={styles.label}>API Name:</Text>
          <Text style={styles.value}>{log.api_name}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.label}>Scope:</Text>
          <Text style={styles.value}>{log.scope}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{log.status}</Text>
        </View>
        
        <View style={styles.tableRow}>
          <Text style={styles.label}>Response:</Text>
          <Text style={styles.value}>{log.response}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  value: {
    flex: 1,
  },
});

export default ApiLogDetails;



