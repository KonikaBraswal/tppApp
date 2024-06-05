//final draft

import React, {useState} from 'react';
import {View, Text, Alert, StyleSheet} from 'react-native';
import {Button, Icon} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ApiLogsDb from '../../DatabaseFactory/ApiLogsDb';
const logClient = new ApiLogsDb('NWG', 'Sandbox', 'logs');
import {useNavigation} from '@react-navigation/native';

const ApiLogs = () => {
  const navigation = useNavigation();
  const [isDataInserted, setIsDataInserted] = useState(false);
  const [retrievedData, setRetrievedData] = useState([]);

  const handleInsertData = async () => {
    await logClient.initDatabaseApi();
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
          "username": "xyz",
          "email": "xyz@yahoo.com",
          "created_at": "2024-05-20T12:00:00Z"
        }
      }`,
    };

    await logClient.initDatabaseApi();
    setIsDataInserted(true);
    Alert.alert('Data Inserted', 'Successfully', [
      {text: 'OK', onPress: () => console.log('Data Inserted')},
    ]);
  };

  const handlePrintData = async () => {
    try {
      const data = await logClient.displayResults();
      setRetrievedData(data);
      navigation.navigate('ApiLogsList', {logs: data});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteLogs = async () => {
    try {
      await logClient.deleteAllLogs();
      setRetrievedData([]);
    } catch (error) {
      console.error('Error deleting logs:', error);
    }
  };

  const handleDeleteTable = async () => {
    try {
      await logClient.deleteApiLogsTable();
      setRetrievedData([]);
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  const handleAlterTable = async () => {
    try {
      await logClient.alterApiLogsTable();
      console.log('apiLogs table altered successfully');
    } catch (error) {
      console.error('Error altering table:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Icon source="chart-bar" color="brown" size={28} />
        <Text style={styles.title}>APILOG DASHBOARD</Text>
      </View>

      {/* <Button
        icon="basket-fill"
        mode="contained-tonal"
        onPress={handleInsertData}
        style={styles.button}
        labelStyle={{
          fontSize: RFValue(16),
          fontWeight: 'bold',
          color: '#5a287d',
        }}>
        Insert Data
      </Button> */}

      <Button
        icon="printer"
        mode="contained-tonal"
        onPress={handlePrintData}
        style={styles.button}
        labelStyle={{
          fontSize: RFValue(16),
          fontWeight: 'bold',
          color: '#5a287d',
        }}>
        View Api Logs
      </Button>

      {/* <Button
        icon="update"
        mode="contained-tonal"
        onPress={handleAlterTable}
        style={styles.button}
        labelStyle={{
          fontSize: RFValue(16),
          fontWeight: 'bold',
          color: '#5a287d',
        }}>
        Alter Table
      </Button> */}

      <Button
        icon="delete"
        mode="contained-tonal"
        onPress={handleDeleteLogs}
        style={styles.button}
        labelStyle={{
          fontSize: RFValue(16),
          fontWeight: 'bold',
          color: '#5a287d',
        }}>
        Delete All API Logs
      </Button>

      <Button
        icon="delete-sweep"
        mode="contained-tonal"
        onPress={handleDeleteTable}
        style={styles.button}
        labelStyle={{
          fontSize: RFValue(16),
          fontWeight: 'bold',
          color: '#5a287d',
        }}>
        Delete API Logs Table
      </Button>
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
    marginHorizontal: hp('1%'),
    color: 'green',
  },
  button: {
    marginVertical: hp('1.2%'),
    padding: wp('2.5%'),
    width: '100%',
    backgroundColor: 'rgba(220, 190, 190, 0.8)',
    borderRadius: 5,
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
