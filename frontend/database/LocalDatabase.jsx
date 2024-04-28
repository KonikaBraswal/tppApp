import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'Local.db', location: 'default' });

export const initLocalDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS local (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        flow TEXT,
        creditorname TEXT,
        debtoraccnum TEXT
      );`,
      [],
      (tx, results) => {
        console.log('local table created successfully');
      },
      error => {
        console.error('Error creating userconsent_sandbox table: ', error);
      },
    );
  });
};
export const initAISPLocalDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS localaisp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        accID TEXT,
        accsubType TEXT,
        accnum TEXT,
        debtorname TEXT
      );`,
      [],
      (tx, results) => {
        console.log('local aisp table created successfully');
      },
      error => {
        console.error('Error creating userconsent_sandbox table: ', error);
      },
    );
  });
};
// export const insertAISPData = (accID, accsubType, accnum, debtorname) => {
//   db.transaction(tx => {
//      tx.executeSql(
//        `INSERT INTO localaisp (accID, accsubType, accnum, debtorname) VALUES (?, ?, ?, ?);`,
//        [accID, accsubType, accnum, debtorname],
//        (tx, results) => {
//          // Log the data that was successfully inserted
//          console.log(`Successfully inserted aisp data: accID=${accID}, accsubType=${accsubType}, accnum=${accnum}, debtorname=${debtorname}`);
//          console.log('Local AISP Data inserted successfully');
//        },
//        error => {
//          console.error('Error inserting data: ', error);
//        },
//      );
//   });
//  };
export const insertAISPData = (accID, accsubType, accnum, debtorname) => {
  db.transaction(tx => {
     // First, check if the accID already exists in the localaisp table
     tx.executeSql(
       `SELECT * FROM localaisp WHERE accID = ?;`,
       [accID],
       (tx, results) => {
         // If the accID does not exist (results.rows.length is 0), proceed with the insertion
         if (results.rows.length === 0) {
           tx.executeSql(
             `INSERT INTO localaisp (accID, accsubType, accnum, debtorname) VALUES (?, ?, ?, ?);`,
             [accID, accsubType, accnum, debtorname],
             (tx, results) => {
               // Log the data that was successfully inserted
               console.log(`Successfully inserted aisp data: accID=${accID}, accsubType=${accsubType}, accnum=${accnum}, debtorname=${debtorname}`);
               console.log('Local AISP Data inserted successfully');
             },
             error => {
               console.error('Error inserting data: ', error);
             },
           );
         } else {
           // If the accID already exists, log a message or handle it as needed
           console.log(`Data for accID=${accID} already exists in the localaisp table.`);
         }
       },
       error => {
         console.error('Error checking for existing accID: ', error);
       },
     );
  });
 };
 
 export const fetchAISPData = () => {
  return new Promise((resolve, reject) => {
     db.transaction(tx => {
       tx.executeSql(
         `SELECT * FROM localaisp;`,
         [],
         (tx, results) => {
           // Process the results
           console.log("Query completed for AISP");
           // Get rows from Web SQL API
           var temp = [];
           for (let i = 0; i < results.rows.length; i++) {
             let row = results.rows.item(i);
             temp.push(row);
           }
           console.log(temp);
           resolve(temp); // Resolve the promise with the results
         },
         error => {
           console.error('Error fetching data: ', error);
           reject(error); // Reject the promise if there's an error
         },
       );
     });
  });
 };
export const insertVRPData = (userId, flow, creditorname, debtoraccnum) => {
  db.transaction(tx => {
     tx.executeSql(
       `INSERT INTO local (userId, flow, creditorname, debtoraccnum) VALUES (?, ?, ?, ?);`,
       [userId, flow, creditorname, debtoraccnum],
       (tx, results) => {
         // Log the data that was successfully inserted
         console.log(`Successfully inserted data: userId=${userId}, flow=${flow}, creditorname=${creditorname}, debtoraccnum=${debtoraccnum}`);
         console.log('Local VRP Data inserted successfully');
       },
       error => {
         console.error('Error inserting data: ', error);
       },
     );
  });
 };
 export const deleteAllRowsFromLocalTable = () => {
  db.transaction(tx => {
     // Delete from the 'local' table
     tx.executeSql(
       `DELETE FROM local;`,
       [],
       (tx, results) => {
         console.log('All rows deleted from local table successfully');
       },
       error => {
         console.error('Error deleting rows from local table: ', error);
       },
     );
 
     // Delete from the 'localaisp' table
     tx.executeSql(
       `DELETE FROM localaisp;`,
       [],
       (tx, results) => {
         console.log('All rows deleted from localaisp table successfully');
       },
       error => {
         console.error('Error deleting rows from localaisp table: ', error);
       },
     );
  });
 };
 

 export const fetchVRPData = () => {
  return new Promise((resolve, reject) => {
     db.transaction(tx => {
       tx.executeSql(
         `SELECT * FROM local;`,
         [],
         (tx, results) => {
           // Process the results
           console.log("Query completed");
           // Get rows from Web SQL API
           var temp = [];
           for (let i = 0; i < results.rows.length; i++) {
             let row = results.rows.item(i);
             temp.push(row);
           }
           console.log(temp);
           resolve(temp); // Resolve the promise with the results
         },
         error => {
           console.error('Error fetching data: ', error);
           reject(error); // Reject the promise if there's an error
         },
       );
     });
  });
 };
 
 
 
   
const LocalDatabase = () => {
    return (
      <View>
        <Text>Local Database</Text>
        {/* <Button title="Add Dummy Entry" onPress={addDummyEntry} /> */}
        {/* <Button title="Display Results" onPress={displayResults} /> */}
        <Button title="Delete All Entries" onPress={ deleteAllRowsFromLocalTable} />
  
        {/* <Button title="Delete Database" onPress={deleteDatabase} /> */}
      </View>
    );
  };
  
export default LocalDatabase;