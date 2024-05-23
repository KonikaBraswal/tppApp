//final draft

import React, {useState} from 'react';
import {View, Text, Alert, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  insertLog,
  displayResults,
  deleteAllLogs,
  deleteApiLogsTable,
  alterApiLogsTable,
} from '../../database/DatabaseLogs';
import {useNavigation} from '@react-navigation/native';

const ApiLogs = () => {
  const navigation = useNavigation();
  const [isDataInserted, setIsDataInserted] = useState(false);
  const [retrievedData, setRetrievedData] = useState([]);

  const handleInsertData = () => {
    const now = new Date();
    const details1 = {
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(now.getDate()).padStart(2, '0')}`,

      time: `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,

      api_name: 'AISP',
      scope: 'Payments',
      status: '200 Success',
      response: `{
        "headers": {
          "Content-Type": "application/json",
          "X-Request-ID": "req-001"
        },
        "body": {
          "id": "1234",
          "username": "khushiujjawal",
          "email": "khushiujjawal@yahoo.com",
          "created_at": "2024-05-20T12:00:00Z"
        }
      }`,
    };

    insertLog(details1);
    setIsDataInserted(true);
    Alert.alert('Data Inserted', 'Successfully', [
      {text: 'OK', onPress: () => console.log('Data Inserted')},
    ]);
  };

  const handlePrintData = async () => {
    try {
      const data = await displayResults();
      setRetrievedData(data);
      navigation.navigate('ApiLogsList', {logs: data});
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
      <Text style={styles.title}>APILOG DASHBOARD</Text>

      <Button
        icon="basket-fill"
        mode="contained"
        onPress={handleInsertData}
        style={styles.button}
        labelStyle={{
          fontSize: RFValue(16),
          fontWeight: 'bold',
          color: 'brown',
        }}>
        Insert Data
      </Button>

      <Button
        icon="printer"
        mode="contained"
        onPress={handlePrintData}
        style={styles.button}
        labelStyle={{
          fontSize: RFValue(16),
          fontWeight: 'bold',
          color: 'brown',
        }}>
        Print Data
      </Button>

      <Button
        icon="update"
        mode="contained"
        onPress={handleAlterTable}
        style={styles.button}
        labelStyle={{
          fontSize: RFValue(16),
          fontWeight: 'bold',
          color: 'brown',
        }}>
        Alter Table
      </Button>

      <Button
        icon="delete"
        mode="contained"
        onPress={handleDeleteLogs}
        style={styles.button}
        labelStyle={{
          fontSize: RFValue(16),
          fontWeight: 'bold',
          color: 'brown',
        }}>
        Delete Logs
      </Button>

      <Button
        icon="delete-sweep"
        mode="contained"
        onPress={handleDeleteTable}
        style={styles.button}
        labelStyle={{
          fontSize: RFValue(16),
          fontWeight: 'bold',
          color: 'brown',
        }}>
        Delete Table
      </Button>

      {/* {isDataInserted && <Text>Data inserted successfully!</Text>} */}

      {/* {retrievedData.length > 0 && (
        <View style={styles.retrievedDataContainer}>
          <Text style={styles.retrievedDataTitle}>Retrieved Data:</Text>
          {retrievedData.map((item, index) => (
            <Text key={index} style={styles.retrievedDataItem}>
              {`Date: ${item.date}, Time: ${item.time}, API Name: ${item.api_name}, Scope: ${item.scope}, Status: ${item.status}, Response: ${item.response}`}
            </Text>
          ))}
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: hp('2%'),
  },
  title: {
    fontSize: RFValue(22),
    fontWeight: 'bold',
    marginVertical: hp('2%'),
    color: 'green',
  },
  button: {
    marginVertical: hp('1.2%'),
    padding: wp('2.5%'),
    width: '100%',
    backgroundColor: 'rgba(220, 190, 190, 0.8)',
    borderRadius: 4,
  },
  retrievedDataContainer: {
    marginTop: hp('1%'),
    alignItems: 'flex-start',
  },
  retrievedDataTitle: {
    fontSize: RFValue(18),
    marginBottom: hp('1%'),
  },
  retrievedDataItem: {
    fontSize: RFValue(15),
  },
});

export default ApiLogs;
