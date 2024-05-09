
import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
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

  // Function to insert dummy data
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

    // Setting state to indicate that data has been inserted
    setIsDataInserted(true);
  };

  // Function to print data
  const handlePrintData = async () => {
    try {
      const data = await displayResults();
      console.log('Retrieved data:', data);
      navigation.navigate('ApiLogsList', { logs: data });
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
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Api Logs Page</Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button title="Insert Data" onPress={handleInsertData} />
          <Button title="Print Data" onPress={handlePrintData} />
          <Button title="Alter Table" onPress={handleAlterTable} />
          <Button title="Delete Logs" onPress={handleDeleteLogs} />
          <Button title="Delete Table" onPress={handleDeleteTable} />
        </View>

        {/* Display message if data is inserted */}
        {isDataInserted && <Text>Data inserted successfully!</Text>}

        {/* Display retrieved data in a table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.columnHeader}>Date</Text>
            <Text style={styles.columnHeader}>Time</Text>
            <Text style={styles.columnHeader}>API Name</Text>
            <Text style={styles.columnHeader}>Scope</Text>
            <Text style={styles.columnHeader}>Status</Text>
            <Text style={styles.columnHeader}>Response</Text>
          </View>
          {retrievedData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.cell}>{item.date}</Text>
              <Text style={styles.cell}>{item.time}</Text>
              <Text style={styles.cell}>{item.api_name}</Text>
              <Text style={styles.cell}>{item.scope}</Text>
              <Text style={styles.cell}>{item.status}</Text>
              <Text style={styles.cell}>{item.response}</Text>
            </View>
          ))}
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
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
  },
});

export default ApiLogs;













// import React, {useState, useEffect} from 'react';
// import {View, Text, Button} from 'react-native';
// import {
//   insertLog,
//   displayResults,
//   deleteAllLogs,
//   deleteApiLogsTable,
//   alterApiLogsTable
// } from '../../database/DatabaseLogs';
// import { useNavigation } from '@react-navigation/native';

// const ApiLogs = () => {
//   const navigation =useNavigation();
//   const [isDataInserted, setIsDataInserted] = useState(false);
//   const [retrievedData, setRetrievedData] = useState([]);

//   // Function to insert dummy data
//   const handleInsertData = () => {
//     const details1 = {
//       date: '2024-03-25',
//       time: '10:00:00',
//       api_name: 'API 1',
//       scope:"Dummy Entry",
//       status: 'Success',
//       response: 'Response 1'
//     };

//     insertLog(details1);

//     // Setting state to indicate that data has been inserted
//     setIsDataInserted(true);
//   };

//   // Function to print data
//   const handlePrintData = async () => {
//     try {
//       const data = await displayResults();
//       console.log('Retrieved data:', data);
//       navigation.navigate('ApiLogsList',{logs:data});
//       setRetrievedData(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   // Function to delete all logs
//   const handleDeleteLogs = async () => {
//     try {
//       await deleteAllLogs();
//       console.log('All logs deleted successfully');
//       setRetrievedData([]); // Clear retrieved data
//     } catch (error) {
//       console.error('Error deleting logs:', error);
//     }
//   };

//   const handleDeleteTable = async () => {
//     try {
//       await deleteApiLogsTable();
//       console.log('apiLogs table deleted successfully');
//       setRetrievedData([]);
//     } catch (error) {
//       console.error('Error deleting table:', error);
//     }
//   };
//   const handleAlterTable = async () => {
//     try {
//       await alterApiLogsTable();
//       console.log('apiLogs table altered successfully');
//     } catch (error) {
//       console.error('Error altering table:', error);
//     }
//   };
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text style={{fontSize: 30, fontWeight: 'bold', marginBottom: 20}}>
//         Api Logs Page
//       </Text>

//       {/* Button to insert dummy data */}
//       <Button
//         title="Insert Data"
//         onPress={handleInsertData}
//       />

//       {/* Button to print data */}
//       <Button title="Print Data" onPress={handlePrintData} />
//       <Button title="Alter Table" onPress={handleAlterTable}/>
//       {/* Button to delete logs */}
//       <Button title="Delete Logs" onPress={handleDeleteLogs} />

//       <Button title="Delete Table" onPress={handleDeleteTable} />

//       {/* Display message if data is inserted */}
//       {isDataInserted && <Text>Data inserted successfully!</Text>}

//       {/* Display retrieved data
//       {retrievedData.map((item, index) => (
//         <Text key={index}>
//           {`Date: ${item.date}, Time: ${item.time}, API Name: ${item.api_name},Scope: ${item.scope}, Status: ${item.status}, Response: ${item.response}`}
//         </Text>
//       ))} */}
//     </View>
//   );
// };

// export default ApiLogs;












// import React, { useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Button } from 'react-native-paper';
// import {
//   insertLog,
//   displayResults,
//   deleteAllLogs,
//   deleteApiLogsTable,
//   alterApiLogsTable
// } from '../../database/DatabaseLogs';
// import { useNavigation } from '@react-navigation/native';

// const ApiLogs = () => {
//   const navigation = useNavigation();
//   const [isDataInserted, setIsDataInserted] = useState(false);
//   const [retrievedData, setRetrievedData] = useState([]);

//   const handleInsertData = () => {
//     const details1 = {
//       date: '2024-03-25',
//       time: '10:00:00',
//       api_name: 'API 1',
//       scope: "Dummy Entry",
//       status: 'Success',
//       response: 'Response 1'
//     };

//     insertLog(details1);
//     setIsDataInserted(true);
//   };

//   const handlePrintData = async () => {
//     try {
//       const data = await displayResults();
//       setRetrievedData(data);
//       navigation.navigate('ApiLogsList', { logs: data });
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleDeleteLogs = async () => {
//     try {
//       await deleteAllLogs();
//       setRetrievedData([]);
//     } catch (error) {
//       console.error('Error deleting logs:', error);
//     }
//   };

//   const handleDeleteTable = async () => {
//     try {
//       await deleteApiLogsTable();
//       setRetrievedData([]);
//     } catch (error) {
//       console.error('Error deleting table:', error);
//     }
//   };

//   const handleAlterTable = async () => {
//     try {
//       await alterApiLogsTable();
//       console.log('apiLogs table altered successfully');
//     } catch (error) {
//       console.error('Error altering table:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Api Logs Page</Text>

//       <Button mode="contained" onPress={handleInsertData} style={styles.button}>
//         Insert Data
//       </Button>

//       <Button mode="contained" onPress={handlePrintData} style={styles.button}>
//         Print Data
//       </Button>

//       <Button mode="contained" onPress={handleAlterTable} style={styles.button}>
//         Alter Table
//       </Button>

//       <Button mode="contained" onPress={handleDeleteLogs} style={styles.button}>
//         Delete Logs
//       </Button>

//       <Button mode="contained" onPress={handleDeleteTable} style={styles.button}>
//         Delete Table
//       </Button>

//       {isDataInserted && <Text>Data inserted successfully!</Text>}

//       {retrievedData.length > 0 && (
//         <View style={styles.retrievedDataContainer}>
//           <Text style={styles.retrievedDataTitle}>Retrieved Data:</Text>
//           {retrievedData.map((item, index) => (
//             <Text key={index} style={styles.retrievedDataItem}>
//               {`Date: ${item.date}, Time: ${item.time}, API Name: ${item.api_name}, Scope: ${item.scope}, Status: ${item.status}, Response: ${item.response}`}
//             </Text>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   button: {
//     marginVertical: 10,
//     width: '100%',
//   },
//   retrievedDataContainer: {
//     marginTop: 20,
//     alignItems: 'flex-start',
//   },
//   retrievedDataTitle: {
//     fontSize: 20,
//     marginBottom: 10,
//   },
//   retrievedDataItem: {
//     fontSize: 16,
//   },
// });

// export default ApiLogs;
