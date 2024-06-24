// import AsyncStorage from '@react-native-async-storage/async-storage';

// const LOGS_STORAGE_KEY = 'apiLogs';

// // Initialize the database
// export const initDatabaseApi = async () => {
//   try {
//     const existingLogs = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
//     if (existingLogs === null) {
//       await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify([]));
//       console.log('apiLogs storage initialized');
//     } else {
//       console.log('apiLogs storage already exists');
//     }
//   } catch (error) {
//     console.error('Error initializing apiLogs storage: ', error);
//   }
// };

// interface LogDetails {
//   date: string;
//   time: string;
//   api_name: string;
//   scope: string;
//   status: string;
//   response: string;
// }

// // Insert a log entry
// export const insertLog = async (details: LogDetails) => {
//   try {
//     const existingLogs = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
//     const logs = existingLogs ? JSON.parse(existingLogs) : [];
//     logs.push(details);
//     await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
//     console.log('Log entry inserted successfully');
//   } catch (error) {
//     console.error('Error inserting log entry: ', error);
//   }
// };

// // Retrieve all log entries
// export const retrieveData = async (): Promise<LogDetails[]> => {
//   try {
//     const existingLogs = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
//     return existingLogs ? JSON.parse(existingLogs) : [];
//   } catch (error) {
//     console.error('Error retrieving data: ', error);
//     throw error;
//   }
// };

// // Display all log entries
// export const displayResults = async () => {
//   try {
//     const data = await retrieveData();
//     console.log('Retrieved data:', data);
//     return data;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// };

// // Delete all log entries
// export const deleteAllLogs = async () => {
//   try {
//     await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify([]));
//     console.log('All logs deleted successfully');
//   } catch (error) {
//     console.error('Error deleting logs: ', error);
//     throw error;
//   }
// };

// // Function to delete the apiLogs storage
// export const deleteApiLogsTable = async () => {
//   try {
//     await AsyncStorage.removeItem(LOGS_STORAGE_KEY);
//     console.log('apiLogs storage deleted successfully');
//   } catch (error) {
//     console.error('Error deleting apiLogs storage: ', error);
//   }
// };

// // Function to alter the logs (not applicable in AsyncStorage, but can be simulated)
// export const alterApiLogsTable = async () => {
//   try {
//     const existingLogs = await retrieveData();
//     const alteredLogs = existingLogs.map(log => ({
//       ...log,
//       scope: log.scope || '', // Add scope if it doesn't exist
//     }));
//     await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(alteredLogs));
//     console.log('apiLogs storage altered successfully');
//   } catch (error) {
//     console.error('Error altering apiLogs storage: ', error);
//   }
// };

import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGS_STORAGE_KEY = 'apiLogs';

// Initialize the database
export const initDatabaseApi = async () => {
  try {
    const existingLogs = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
    if (existingLogs === null) {
      await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify([]));
      console.log('apiLogs storage initialized');
    } else {
      console.log('apiLogs storage already exists');
    }
  } catch (error) {
    console.error('Error initializing apiLogs storage: ', error);
  }
};

interface LogDetails {
  date: string;
  time: string;
  api_name: string;
  scope: string;
  status: string;
  response: string;
  bankName: string;
}

// Insert a log entry
export const insertLog = async (details: LogDetails) => {
  try {
    const existingLogs = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(details);
    await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    console.log('Log entry inserted successfully');
  } catch (error) {
    console.error('Error inserting log entry: ', error);
  }
};

// Retrieve all log entries
export const retrieveData = async (): Promise<LogDetails[]> => {
  try {
    const existingLogs = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
    return existingLogs ? JSON.parse(existingLogs) : [];
  } catch (error) {
    console.error('Error retrieving data: ', error);
    throw error;
  }
};

// Display all log entries
export const displayResults = async () => {
  try {
    const data = await retrieveData();
    console.log('Retrieved data:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Delete all log entries
export const deleteAllLogs = async () => {
  try {
    await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify([]));
    console.log('All logs deleted successfully');
  } catch (error) {
    console.error('Error deleting logs: ', error);
    throw error;
  }
};

// Function to delete the apiLogs storage
export const deleteApiLogsTable = async () => {
  try {
    await AsyncStorage.removeItem(LOGS_STORAGE_KEY);
    console.log('apiLogs storage deleted successfully');
  } catch (error) {
    console.error('Error deleting apiLogs storage: ', error);
  }
};

// Function to alter the logs (not applicable in AsyncStorage, but can be simulated)
export const alterApiLogsTable = async () => {
  try {
    const existingLogs = await retrieveData();
    const alteredLogs = existingLogs.map(log => ({
      ...log,
      scope: log.scope || '', // Add scope if it doesn't exist
      bankName: log.bankName || '', // Add bankName if it doesn't exist
    }));
    await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(alteredLogs));
    console.log('apiLogs storage altered successfully');
  } catch (error) {
    console.error('Error altering apiLogs storage: ', error);
  }
};
