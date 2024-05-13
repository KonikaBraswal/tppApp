//final draft

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import {
  insertLog,
  displayResults,
  deleteAllLogs,
  deleteApiLogsTable,
  alterApiLogsTable
} from '../../database/DatabaseLogs';
import { useNavigation } from '@react-navigation/native';

const ApiLogs = () => {
  const navigation = useNavigation();
  const [isDataInserted, setIsDataInserted] = useState(false);
  const [retrievedData, setRetrievedData] = useState([]);

  const handleInsertData = () => {
    const details1 = {
      date: '2024-03-25',
      time: '10:00:00',
      api_name: 'API 1',
      scope: "Dummy Entry",
      status: 'Success',
      response: 'Response 1'
    };

    insertLog(details1);
    setIsDataInserted(true);
  };

  const handlePrintData = async () => {
    try {
      const data = await displayResults();
      setRetrievedData(data);
      navigation.navigate('ApiLogsList', { logs: data });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteLogs = async () => {
    try {
      await deleteAllLogs();
      setRetrievedData([]);
    } catch (error) {
      console.error('Error deleting logs:', error);
    }
  };

  const handleDeleteTable = async () => {
    try {
      await deleteApiLogsTable();
      setRetrievedData([]);
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  const handleAlterTable = async () => {
    try {
      await alterApiLogsTable();
      console.log('apiLogs table altered successfully');
    } catch (error) {
      console.error('Error altering table:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Api Logs Page</Text>

      <Button mode="contained" onPress={handleInsertData} style={styles.button}>
        Insert Data
      </Button>

      <Button mode="contained" onPress={handlePrintData} style={styles.button}>
        Print Data
      </Button>

      <Button mode="contained" onPress={handleAlterTable} style={styles.button}>
        Alter Table
      </Button>

      <Button mode="contained" onPress={handleDeleteLogs} style={styles.button}>
        Delete Logs
      </Button>

      <Button mode="contained" onPress={handleDeleteTable} style={styles.button}>
        Delete Table
      </Button>

      {isDataInserted && <Text>Data inserted successfully!</Text>}

      {retrievedData.length > 0 && (
        <View style={styles.retrievedDataContainer}>
          <Text style={styles.retrievedDataTitle}>Retrieved Data:</Text>
          {retrievedData.map((item, index) => (
            <Text key={index} style={styles.retrievedDataItem}>
              {`Date: ${item.date}, Time: ${item.time}, API Name: ${item.api_name}, Scope: ${item.scope}, Status: ${item.status}, Response: ${item.response}`}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    width: '100%',
  },
  retrievedDataContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  retrievedDataTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  retrievedDataItem: {
    fontSize: 16,
  },
});

export default ApiLogs;



