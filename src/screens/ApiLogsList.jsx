
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DataTable, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const ApiLogsList = ({ route }) => {
  const { logs } = route.params; // Get logs data from navigation route
  const navigation = useNavigation(); // Hook for navigation

  const handleLogPress = (log) => {
    navigation.navigate('ApiLogDetails', { log }); // Navigate to LogDetailsPage with log data
  };

  // Sort data by date and time in descending order
  const sortedData = logs.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB - dateA;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={{ marginTop: hp('2%') }}>
        <DataTable>
          <DataTable.Header style={styles.header}>
            <DataTable.Title style={[styles.headerCell, styles.expandedCell]}>
              <Text style={styles.headerText}>Date</Text>
            </DataTable.Title>
            <DataTable.Title
              style={[
                styles.headerCell,
                styles.expandedCell,
                { marginLeft: hp('8%') },
              ]}
            >
              <Text style={styles.headerText}>API</Text>
            </DataTable.Title>
            <DataTable.Title style={styles.headerCell}>
              <Text style={styles.headerText}>Status</Text>
            </DataTable.Title>
          </DataTable.Header>

          {sortedData.map((log, index) => (
            <DataTable.Row
              key={index}
              onPress={() => handleLogPress(log)}
              style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
            >
              <DataTable.Cell style={[styles.cell, styles.expandedCell]}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ fontSize: RFValue(14), color: 'rgb(54, 69, 79)' }}>{log.date}</Text>
                  <Text style={{ fontSize: RFValue(14), color: 'rgb(54, 69, 79)' }}>{log.time}</Text>
                  <Text style={{ fontSize: RFValue(14), color: 'rgb(54, 69, 79)' }}>{log.bankName}</Text>
                </View>
              </DataTable.Cell>
              <DataTable.Cell style={[styles.cell, styles.expandedCell]}>
                <Text style={{ fontSize: RFValue(14), textAlign: 'center', color: 'rgb(54, 69, 79)' }}>
                  {log.api_name}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell
                style={{
                  justifyContent: 'center',
                  paddingVertical: hp('2%'),
                  color: 'rgb(54, 69, 79)'
                }}
              >
                <Text style={{ fontSize: RFValue(14), color: 'rgb(54, 69, 79)' }}>
                  {log.status.substring(0, 3)}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('3%'),
  },
  header: {
    backgroundColor: 'rgba(220, 190, 190, 0.6)',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: RFValue(17),
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: RFValue(16),
    color: 'rgb(54, 69, 79)'
  },
  expandedCell: {
    flex: 2,
  },
  cell: {
    paddingVertical: hp('2%'),
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#BDBEC0',
  },
});

export default ApiLogsList;
