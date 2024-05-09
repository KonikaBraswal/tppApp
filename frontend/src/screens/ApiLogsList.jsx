import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ApiLogsList = ({ route }) => {
  const { logs } = route.params; // Get logs data from navigation route
  const navigation = useNavigation(); // Hook for navigation

  const handleLogPress = (log) => {
    navigation.navigate('ApiLogDetails', { log }); // Navigate to LogDetailsPage with log data
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Api Logs List
      </Text>
      {/* Table Header */}
      <View style={{ flexDirection: 'row', marginBottom: 5 }}>
        <Text style={{ flex: 1, fontWeight: 'bold' }}>Date</Text>
        <Text style={{ flex: 1, fontWeight: 'bold' }}>Time</Text>
        <Text style={{ flex: 2, fontWeight: 'bold' }}>API Name</Text>
        <Text style={{ flex: 1, fontWeight: 'bold' }}>Status</Text>
        <Text style={{ flex: 1, fontWeight: 'bold' }}>Scope</Text>
      </View>
      {/* Table Rows */}
      <FlatList
        data={logs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLogPress(item)} style={{ flexDirection: 'row', marginBottom: 5 }}>
            <Text style={{ flex: 1 }}>{item.date}</Text>
            <Text style={{ flex: 1 }}>{item.time}</Text>
            <Text style={{ flex: 2 }}>{item.api_name}</Text>
            <Text style={{ flex: 1 }}>{item.status}</Text>
            <Text style={{ flex: 1 }}>{item.scope}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ApiLogsList;

// import React from 'react';
// import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const ApiLogsList = ({ route }) => {
//   const { logs } = route.params; // Get logs data from navigation route
//   const navigation = useNavigation(); // Hook for navigation

//   const handleLogPress = (log) => {
//     navigation.navigate('ApiLogDetails', { log }); // Navigate to LogDetailsPage with log data
//   };

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
//         Api Logs List
//       </Text>
//       <FlatList
//         data={logs}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handleLogPress(item)}>
//             <Text>{`Date: ${item.date}, Time: ${item.time}, API Name: ${item.api_name}, Status: ${item.status}, Scope: ${item.scope}`}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// export default ApiLogsList;

// import React from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const ApiLogsList = ({ route }) => {
//   const { logs } = route.params; // Get logs data from navigation route
//   const navigation = useNavigation(); // Hook for navigation

//   const handleLogPress = (log) => {
//     navigation.navigate('ApiLogDetails', { log }); // Navigate to LogDetailsPage with log data
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Api Logs List</Text>
//       <FlatList
//         data={logs}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handleLogPress(item)} style={styles.logItem}>
//             <Text style={styles.logText}>{`Date: ${item.date}, Time: ${item.time}`}</Text>
//             <Text style={styles.logText}>{`API Name: ${item.api_name}`}</Text>
//             <Text style={styles.logText}>{`Status: ${item.status}, Scope: ${item.scope}`}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   logItem: {
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   logText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
// });

// export default ApiLogsList;

