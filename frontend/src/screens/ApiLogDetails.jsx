//finaldraft

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const ApiLogDetails = ({ route }) => {
  const { log } = route.params; // Get log data from navigation route

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



// //working
// import React from 'react';
// import { View, Text, ScrollView } from 'react-native';

// const ApiLogDetails = ({ route }) => {
//   const { log } = route.params; // Get log data from navigation route
//   //const responseData = JSON.parse(log.response);
//   return (
//     <ScrollView>
//       <View style={{ flex: 1, padding: 20 }}>
//         <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
//           Api Log Details
//         </Text>
//         <Text>{`Date: ${log.date}`}</Text>
//         <Text>{`API Name: ${log.api_name}`}</Text>
//         <Text>{`Scope: ${log.scope}`}</Text>
//         <Text>{`Status: ${log.status}`}</Text>
//         <Text>{`Time: ${log.time}`}</Text>
//         <Text>{`Response: ${log.response}`}</Text>
//       </View>
//     </ScrollView>
//   );
// };

// export default ApiLogDetails;



// //trail3

// import React from 'react';
// import { View, Text, ScrollView, StyleSheet } from 'react-native';
// import PropTypes from 'prop-types';
// import { useTheme } from 'react-native-paper';

// const ApiLogDetails = ({ route }) => {
//   const { colors } = useTheme();
//   const { log } = route.params || {};
//   const responseData = log ? JSON.parse(log.response) : {};

//   const tableRows = [
//     { label: 'Date', value: responseData.headers?.date || '' },
//     { label: 'API Name', value: log?.api_name || '' },
//     { label: 'Scope', value: responseData.data?.scope || '' },
//     { label: 'Status', value: responseData.status || '' },
//     { label: 'Method', value: responseData.config?.method || '' },
//     { label: 'Response', value: log?.response || '' },
//   ];

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={[styles.title, { color: colors.primary }]}>Api Log Details</Text>
//       {tableRows.map((row, index) => (
//         <View key={index} style={styles.row}>
//           <Text style={styles.label}>{row.label}</Text>
//           <Text style={styles.value}>{row.value}</Text>
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// ApiLogDetails.propTypes = {
//   route: PropTypes.object.isRequired,
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   row: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   label: {
//     flex: 1,
//     fontWeight: 'bold',
//   },
//   value: {
//     flex: 2,
//   },
// });

// export default ApiLogDetails;
