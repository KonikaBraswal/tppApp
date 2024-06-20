
// please uncommment below code from line 3 to line 135 to use old working code
// import React, {useEffect} from 'react';
// import {View, Text, Button, Alert} from 'react-native';
// import SQLite from 'react-native-sqlite-storage';


// const db = SQLite.openDatabase({name: 'dbSandbox.db', location: 'default'});


// export const initDatabase = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS userconsent_sandbox (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         userId TEXT,
//         scope TEXT,
//         bankname TEXT,
//         refreshedtoken TEXT,
//         consentid TEXT,
//         consentexpiry TEXT,
//         paymentid TEXT,
//         consentpayload TEXT,
//         status TEXT,
//         account_customer_consented TEXT,
//         account_details TEXT,
//         last_updated_date TEXT,
//         last_updated_time TEXT
//       );`,
//       [],
//       (tx, results) => {
//         console.log('userconsent_sandbox table created successfully');
//       },
//       error => {
//         console.error('Error creating userconsent_sandbox table: ', error);
//       },
//     );
//   });
// };

// export const addDetails = details => {
//   const currentDate = new Date().toLocaleDateString();
//   const currentTime = new Date().toLocaleTimeString();

//   db.transaction(tx => {
//     tx.executeSql(
//       `INSERT INTO userconsent_sandbox (
//         userId,
//         scope,
//         bankname,
//         refreshedtoken,
//         consentid,
//         consentexpiry,
//         paymentid,
//         consentpayload,
//         status,
//         account_customer_consented,
//         account_details,
//         last_updated_date,
//         last_updated_time
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
//       [
//         details.userId,
//         details.scope,
//         details.bankname,
//         details.refreshedtoken,
//         details.consentid,
//         details.consentexpiry,
//         details.paymentid,
//         details.consentpayload,
//         details.status,
//         details.account_customer_consented,
//         details.account_details,
//         currentDate,
//         currentTime,
//       ],
//       (_, results) => {
//         console.log('Details added successfully', results);
//       },
//       (_, error) => {
//         console.error('Error adding details: ', error);
//       },
//     );
//   });
// };

// export const updateDetails = (details, userId, columnsToUpdate) => {
//   console.log('Updating details for userId:', userId);
//   console.log('Details to update:', details);

//   // Ensure there are columns to update
//   if (!columnsToUpdate || columnsToUpdate.length === 0) {
//     console.error('No columns specified for update.');
//     return Promise.reject('No columns specified for update.');
//   }

//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       // Construct SET clause dynamically based on columnsToUpdate
//       const setClause = columnsToUpdate
//         .map(column => `${column} = ?`)
//         .join(', ');

//       // Add last_updated_date and last_updated_time to SET clause
//       const updatedSetClause = `${setClause}, last_updated_date = ?, last_updated_time = ?`;

//       // Construct SQL query
//       const query = `UPDATE userconsent_sandbox SET ${updatedSetClause} WHERE userId = ?;`;

//       // Construct parameters array
//       const currentDate = new Date().toLocaleDateString();
//       const currentTime = new Date().toLocaleTimeString();
//       const parameters = [
//         ...columnsToUpdate.map(column => details[column].toString()),
//         //...columnsToUpdate.map(column => details[column]),----------Sunil
//         currentDate,
//         currentTime,
//         userId,
//       ];

//       tx.executeSql(
//         query,
//         parameters,
//         (_, results) => {
//           console.log('Details updated successfully', results);
//           resolve(results);
//         },
//         (_, error) => {
//           console.error('Error updating details: ', error);
//           reject(error);
//         },
//       );
//     });
//   });
// };

      // please uncomnment above code  to reuse  of old code  from  line 3 to line 136

// export const updateDetails = (details, userId) => {
//   console.log('Updating details for userId:', userId);
//   db.transaction((tx) => {
//     tx.executeSql(
//       `UPDATE userconsent_sandbox
//        SET
//         refreshedtoken = ?,
//         consentexpiry = ?,
//         paymentid = ?,
//         consentpayload = ?,
//         status = ?,
//         account_customer_consented = ?,
//         account_details = ?
//        WHERE userId = ?;`,
//       [
//         details.refreshedtoken,
//         details.consentexpiry,
//         details.paymentid,
//         details.consentpayload,
//         details.status,
//         details.account_customer_consented,
//         details.account_details,
//         userId,
//       ],
//       (_, results) => {
//         console.log('Details updated successfully', results);
//       },
//       (_, error) => {
//         console.error('Error updating details: ', error);
//       }
//     );
//   });
// };

// const displayResults = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       'SELECT * FROM userconsent_sandbox;',
//       [],
//       (tx, results) => {
//         const rows = results.rows;
//         const len = rows.length;
//         const data = [];

//         if (len > 0) {
//           for (let i = 0; i < len; i++) {
//             const row = rows.item(i);
//             data.push(rows.item(i));
//             console.log('Row ID:', row.id, 'Row:', row);
//           }
//         } else {
//           console.log('No entries found in the database.');
//         }
//       },
//       (_, error) => {
//         console.error('Error querying database: ', error);
//       },
//     );
//   });
// };

                 //please uncomment from line 198 to line 286 for reuse of old code 

// export const RetrieveData = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM userconsent_sandbox;',
//         [],
//         (tx, results) => {
//           const rows = results.rows;
//           const len = rows.length;
//           const data = [];

//           if (len > 0) {
//             for (let i = 0; i < len; i++) {
//               const row = rows.item(i);
//               data.push(row);
//               console.log('Row ID:', row.id, 'Row:', row);
//             }

//             resolve(data);
//           } else {
//             console.log('No entries found in the database.');
//             resolve([]);
//           }
//         },
//         (_, error) => {
//           console.error('Error querying database: ', error);
//           reject(error);
//         },
//       );
//     });
//   });
// };

// export const displayResults = () => {
//   RetrieveData()
//     .then(data => {
//       console.log('Retrieved data:', data);
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
// };

// const deleteAllEntries = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       'DELETE FROM userconsent_sandbox;',
//       [],
//       (_, results) => {
//         console.log('All entries deleted successfully');

//         // Reset auto-increment ID after deleting all entries
//         tx.executeSql(
//           'DELETE FROM sqlite_sequence WHERE name = "userconsent_sandbox";',
//           [],
//           (_, results) => {
//             console.log('Auto-increment ID reset successfully');
//           },
//           (_, error) => {
//             console.error('Error resetting auto-increment ID: ', error);
//           },
//         );
//       },
//       (_, error) => {
//         console.error('Error deleting entries: ', error);
//       },
//     );
//   });
// };

// const deleteDatabase = () => {
//   db.close(
//     () => {
//       console.log('Database closed successfully');
//       SQLite.deleteDatabase(
//         {name: 'dbSandbox.db', location: 'default'},
//         () => {
//           console.log('Database deleted successfully');
//         },
//         error => {
//           console.error('Error deleting database: ', error);
//         },
//       );
//     },
//     error => {
//       console.error('Error closing database: ', error);
//     },
//   );
// };

          //please uncomment above part if want to use old code from line 198 to line 286

// const addDummyEntry = () => {
//   const dummyDetails = {
//     userId: 'dummyUser123',
//     scope: 'dummyScope',
//     bankname: 'Dummy Bank',
//     refreshedtoken: 'dummyRefreshedToken',
//     consentid: 'dummyConsentId',
//     consentexpiry: 'dummyExpiryDate',
//     paymentid: 'dummyPaymentId',
//     consentpayload: 'dummyPayload',
//     status: 'dummyStatus',
//     account_customer_consented: 'dummyConsentedAccount',
//     account_details: 'dummyAccountDetails',
//   };

//   addDetails(dummyDetails);
// };

                    //below part need to be uncommented if needed from line 310 to line 383

// export var globalRefreshedToken;

// export const fetchRefreshedToken = userId => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT refreshedtoken FROM userconsent_sandbox WHERE userId = ?;',
//         [userId],
//         (_, results) => {
//           console.log('Query results:', results.rows); // Log the results for debugging
//           const rows = results.rows;
//           if (rows.length > 0) {
//             const row = rows.item(0);
//             const refreshedtoken = row.refreshedtoken;
//             // console.log('Refreshed Token from database:', refreshedtoken); // Log the refreshedtoken for debugging
//             globalRefreshedToken = refreshedtoken;
//             resolve(refreshedtoken);
//           } else {
//             // If no entry is found, clear the globalRefreshedToken
//             globalRefreshedToken = null;
//             console.log('No entry found for userId:', userId); // Log for debugging
//             resolve(null);
//           }
//         },
//         (_, error) => {
//           //-----------------------------------------
//           console.error('Error fetching refreshedtoken: ', error);
//           reject(error);
//         },
//       );
//     });
//   });
// };

// const userIdToFetch = 1001;

// fetchRefreshedToken(userIdToFetch)
//   .then(refreshedtoken => {
//     if (refreshedtoken !== null) {
//       console.log(
//         `Refreshed Token for userId ${userIdToFetch}:`,
//         refreshedtoken,
//       );
//       // processRefreshedToken();
//     } else {
//       console.log(`No entry found for userId ${userIdToFetch}.`);
//       globalRefreshedToken = null;
//       processRefreshedToken();
//     }
//     // processRefreshedToken();
//   })
//   .catch(error => {
//     //-----------------------------------------
//     console.error('Error fetching Refreshed Token:', error);
//   });

// export const processRefreshedToken = () => {
//   console.log('Refreshed Token:', globalRefreshedToken);
// };

// const Database = () => {
//   return (
//     <View>
//       <Text>SQLite Database</Text>
//       {/* <Button title="Add Dummy Entry" onPress={addDummyEntry} /> */}
//       <Button title="Display Results" onPress={displayResults} />
//       <Button title="Delete All Entries" onPress={deleteAllEntries} />

//       <Button title="Delete Database" onPress={deleteDatabase} />
//     </View>
//   );
// };

// export default Database;

//cvrpdatabsefile below code is taken from expocvrp database file

import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage helper functions
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log(`${key} stored successfully`);
  } catch (error) {
    console.error(`Error storing ${key}: `, error);
  }
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log(`${key} retrieved successfully`);
      return JSON.parse(value);
    }
    console.log(`${key} not found`);
    return null;
  } catch (error) {
    console.error(`Error retrieving ${key}: `, error);
  }
};

const deleteData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`${key} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting ${key}: `, error);
  }
};

// Initialization functions
export const initDatabase = async () => {
  await storeData('userconsent_sandbox', []);
};

export const initDatabaseCA = async () => {
  await storeData('CA_sandbox', []);
};

export const initDatabaseTransaction = async () => {
  await storeData('vrpTransactions_sandbox', []);
};

// Add details functions
export const addDetails = async (details) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  details.last_updated_date = currentDate;
  details.last_updated_time = currentTime;

  const userconsentData = await getData('userconsent_sandbox') || [];
  userconsentData.push(details);
  await storeData('userconsent_sandbox', userconsentData);
};

export const addDetailsCA = async (details) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  details.last_updated_date = currentDate;
  details.last_updated_time = currentTime;

  const caData = await getData('CA_sandbox') || [];
  caData.push(details);
  await storeData('CA_sandbox', caData);
};

export const addTransactions = async (details) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  details.date = currentDate;
  details.time = currentTime;

  const transactionsData = await getData('vrpTransactions_sandbox') || [];
  transactionsData.push(details);
  await storeData('vrpTransactions_sandbox', transactionsData);
};

// Update details functions
export const updateDetails = async (details, userId, columnsToUpdate) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  details.last_updated_date = currentDate;
  details.last_updated_time = currentTime;

  let userconsentData = await getData('userconsent_sandbox') || [];
  userconsentData = userconsentData.map((item) => {
    if (item.userId === userId) {
      columnsToUpdate.forEach((column) => {
        item[column] = details[column];
      });
      item.last_updated_date = currentDate;
      item.last_updated_time = currentTime;
    }
    return item;
  });

  await storeData('userconsent_sandbox', userconsentData);
};

export const updateDetailsForVrp = async (details, consentid, columnsToUpdate) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  details.last_updated_date = currentDate;
  details.last_updated_time = currentTime;

  let vrpData = await getData('vrpTransactions_sandbox') || [];
  vrpData = vrpData.map((item) => {
    if (item.consentid === consentid) {
      columnsToUpdate.forEach((column) => {
        item[column] = details[column];
      });
      item.last_updated_date = currentDate;
      item.last_updated_time = currentTime;
    }
    return item;
  });

  await storeData('vrpTransactions_sandbox', vrpData);
};

export const updateDetailsForCVrp = async (details, consentid, columnsToUpdate) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  details.last_updated_date = currentDate;
  details.last_updated_time = currentTime;

  let caData = await getData('CA_sandbox') || [];
  caData = caData.map((item) => {
    if (item.consentid === consentid) {
      columnsToUpdate.forEach((column) => {
        item[column] = details[column];
      });
      item.last_updated_date = currentDate;
      item.last_updated_time = currentTime;
    }
    return item;
  });

  await storeData('CA_sandbox', caData);
};

// Retrieve data functions
export const RetrieveData = async () => {
  return await getData('userconsent_sandbox');
};

export const RetrieveDataforVrp = async () => {
  const data = await getData('vrpTransactions_sandbox');
  return data ? data.filter(row => row.consentid === 'VRP-4206f31b-5d57-411b-86a3-bd86bcc42f49') : [];
};

export const fetchTransactionsForUserConsent = async (consentid) => {
  const data = await getData('vrpTransactions_sandbox');
  return data ? data.filter(row => row.consentid === consentid && row.status === 'AcceptedSettlementCompleted') : [];
};

export const fetchAllDataforScope = async (scope) => {
  const data = await getData('userconsent_sandbox');
  return data ? data.filter(row => row.scope === scope && row.status === 'Authorised').map(row => ({
    consentid: row.consentid,
    consentpayload: row.consentpayload,
    refreshtoken: row.refreshedtoken,
    vrppayload: row.account_details,
  })) : [];
};

export const fetchAllDataforScopeCA = async (scope) => {
  const data = await getData('CA_sandbox');
  return data ? data.filter(row => row.scope === scope) : [];
};

export const fetchRefreshedToken = async (userId) => {
  const data = await getData('userconsent_sandbox');
  const user = data ? data.find(row => row.userId === userId) : null;
  if (user) {
    globalRefreshedToken = user.refreshedtoken;
    return user.refreshedtoken;
  } else {
    globalRefreshedToken = null;
    return null;
  }
};

// UI functions
export const displayResults = async () => {
  const data = await RetrieveData();
  console.log('Retrieved data:', data);
};

const deleteAllEntries = async () => {
  await storeData('CA_sandbox', []);
};

const deleteDatabase = async () => {
  await AsyncStorage.clear();
};

export var globalRefreshedToken;

export const processRefreshedToken = () => {
  console.log('Refreshed Token:', globalRefreshedToken);
};

const Database = () => {
  return (
    <View>
      <Text>AsyncStorage Database</Text>
      <Button title="Display Results" onPress={displayResults} />
      <Button title="Delete All Entries" onPress={deleteAllEntries} />
      <Button title="Delete Database" onPress={deleteDatabase} />
    </View>
  );
};

export default Database;
