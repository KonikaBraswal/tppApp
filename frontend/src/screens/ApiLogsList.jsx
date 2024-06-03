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
  const handleLogPress = log => {
    navigation.navigate('ApiLogDetails', { log }); // Navigate to LogDetailsPage with log data
  };
  // Sort data by age in descending order
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
              ]}>
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
              style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
              <DataTable.Cell style={[styles.cell, styles.expandedCell]}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ fontSize: RFValue(14) }}>{log.date}</Text>
                  <Text style={{ fontSize: RFValue(14) }}>{log.time}</Text>
                </View>
              </DataTable.Cell>

              <DataTable.Cell style={[styles.cell, styles.expandedCell]}>
                <Text style={{ fontSize: RFValue(14), textAlign: 'center' }}>
                  {log.api_name}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell
                style={{
                  justifyContent: 'center',
                  paddingVertical: hp('2%'),
                }}>
                <Text style={{ fontSize: RFValue(14) }}>
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

// import React from 'react';
// import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
// import {DataTable, Text} from 'react-native-paper';

// import {useNavigation} from '@react-navigation/native';

// const ApiLogsList = ({route}) => {
//   const {logs} = route.params; // Get logs data from navigation route
//   const navigation = useNavigation(); // Hook for navigation
//   const handleLogPress = log => {
//     navigation.navigate('ApiLogDetails', {log}); // Navigate to LogDetailsPage with log data
//   };

//   return (
//     <View style={styles.container}>
//       <DataTable>
//         <DataTable.Header style={styles.header}>
//           <DataTable.Title style={[styles.headerCell, styles.expandedCell]}>
//             <Text style={styles.headerCell}>Date</Text>
//           </DataTable.Title>
//           <DataTable.Title style={[styles.headerCell, styles.expandedCell]}>
//             <Text style={styles.headerCell}>Time</Text>
//           </DataTable.Title>
//           <DataTable.Title style={styles.headerCell}>
//             <Text style={styles.headerCell}>API</Text>
//           </DataTable.Title>
//           <DataTable.Title style={styles.headerCell}>
//             <Text style={styles.headerCell}>Status</Text>
//           </DataTable.Title>
//         </DataTable.Header>

//         {logs.map((log, index) => (
//           <DataTable.Row
//             key={index}
//             onPress={() => handleLogPress(log)}
//             style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
//             <DataTable.Cell style={[styles.cell, styles.expandedCell]}>
//               <Text style={{ fontSize: RFValue(15)}}>{log.date}</Text>
//             </DataTable.Cell>
//             <DataTable.Cell style={[styles.cell, styles.expandedCell]}>
//               <Text style={{ fontSize: RFValue(15)}}>{log.time}</Text>
//             </DataTable.Cell>
//             <DataTable.Cell style={styles.cell}>
//               <Text style={{ fontSize: RFValue(15)}}>{log.api_name}</Text>
//             </DataTable.Cell>
//             <DataTable.Cell style={styles.cell}>
//               <Text style={{ fontSize: RFValue(15)}}> {log.status.substring(0, 3)}</Text>
//             </DataTable.Cell>
//           </DataTable.Row>
//         ))}
//       </DataTable>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   header: {
//     backgroundColor: 'rgba(220, 190, 190, 0.6)',
//   },
//   headerCell: {
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   expandedCell: {
//     flex: 2,
//   },
//   cell: {
//     paddingVertical: 10,
//   },
//   evenRow: {
//     backgroundColor: '#ffffff',
//   },
//   oddRow: {
//     backgroundColor: '#BDBEC0',
//   },
// });

// export default ApiLogsList;
