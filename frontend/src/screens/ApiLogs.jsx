import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {
  insertLog,
  displayResults,
  deleteAllLogs,
  deleteApiLogsTable,
  alterApiLogsTable
} from '../../database/DatabaseLogs';
import { useNavigation } from '@react-navigation/native';

const ApiLogs = () => {
  const navigation =useNavigation();
  const [isDataInserted, setIsDataInserted] = useState(false);
  const [retrievedData, setRetrievedData] = useState([]);

  // Function to insert dummy data
  const handleInsertData = () => {
    const details1 = {
      date: '2024-03-25',
      time: '10:00:00',
      api_name: 'API 1',
      scope:"Dummy Entry",
      status: 'Success',
      response: 'Response 1'
    };

    insertLog(details1);

    // Setting state to indicate that data has been inserted
    setIsDataInserted(true);
  };

  // Function to print data
  const handlePrintData = async () => {
    try {
      const data = await displayResults();
      console.log('Retrieved data:', data);
      navigation.navigate('ApiLogsList',{logs:data});
      setRetrievedData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to delete all logs
  const handleDeleteLogs = async () => {
    try {
      await deleteAllLogs();
      console.log('All logs deleted successfully');
      setRetrievedData([]); // Clear retrieved data
    } catch (error) {
      console.error('Error deleting logs:', error);
    }
  };

  const handleDeleteTable = async () => {
    try {
      await deleteApiLogsTable();
      console.log('apiLogs table deleted successfully');
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
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 30, fontWeight: 'bold', marginBottom: 20}}>
        Api Logs Page
      </Text>

      {/* Button to insert dummy data */}
      <Button
        title="Insert Data"
        onPress={handleInsertData}
      />

      {/* Button to print data */}
      <Button title="Print Data" onPress={handlePrintData} />
      <Button title="Alter Table" onPress={handleAlterTable}/>
      {/* Button to delete logs */}
      <Button title="Delete Logs" onPress={handleDeleteLogs} />

      <Button title="Delete Table" onPress={handleDeleteTable} />

      {/* Display message if data is inserted */}
      {isDataInserted && <Text>Data inserted successfully!</Text>}

      {/* Display retrieved data
      {retrievedData.map((item, index) => (
        <Text key={index}>
          {`Date: ${item.date}, Time: ${item.time}, API Name: ${item.api_name},Scope: ${item.scope}, Status: ${item.status}, Response: ${item.response}`}
        </Text>
      ))} */}
    </View>
  );
};

export default ApiLogs;
