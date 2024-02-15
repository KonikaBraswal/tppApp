// either create a method like 

export const fetchAccountCustomerConsented = (userId) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT account_customer_consented FROM userconsent_sandbox WHERE userId = ?;',
          [userId],
          (_, results) => {
            const rows = results.rows;
            if (rows.length > 0) {
              const row = rows.item(0);
              const accountCustomerConsented = row.account_customer_consented;
              resolve(accountCustomerConsented);
            } else {
              // Handle the case where no entry is found for the specified userId
              resolve(null);
            }
          },
          (_, error) => {
            console.error('Error fetching account_customer_consented: ', error);
            reject(error);
          }
        );
      });
    });
  };

                                             // and use it in coponents like


  // Import the fetchAccountCustomerConsented function
import { fetchAccountCustomerConsented } from './path-to-your-file';

// ...

// Inside a component or other function
const userIdToFetch = 1001;

fetchAccountCustomerConsented(userIdToFetch)
  .then((accountCustomerConsented) => {
    if (accountCustomerConsented !== null) {
      console.log(`Account Customer Consented for userId ${userIdToFetch}:`, accountCustomerConsented);
    } else {
      console.log(`No entry found for userId ${userIdToFetch}.`);
    }
  })
  .catch((error) => {
    console.error('Error fetching account_customer_consented:', error);
  });





                                    //// OR ////// Use query directly in components like Below





import SQLite from 'react-native-sqlite-storage';
const db = SQLite.openDatabase({ name: 'dbSandbox.db', location: 'default' });

const userIdToFetch = 1001;

db.transaction(tx => {
  tx.executeSql(
    'SELECT account_customer_consented FROM userconsent_sandbox WHERE userId = ?;',
    [userIdToFetch],
    (_, results) => {
      const accountCustomerConsented = results.rows.item(0)?.account_customer_consented;
      console.log(`Account Customer Consented for userId ${userIdToFetch}:`, accountCustomerConsented || 'Not found');
    },
    (_, error) => {
      console.error('Error fetching account_customer_consented:', error);
    }
  );
});










////---------------------------Db backup---------------------------------////


import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'dbSandbox.db', location: 'default' });

const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS userconsent_sandbox (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        scope TEXT,
        bankname TEXT,
        refreshedtoken TEXT,
        consentid TEXT,
        consentexpiry TEXT,
        paymentid TEXT,
        consentpayload TEXT,
        status TEXT,
        account_customer_consented TEXT,
        account_details TEXT
      );`,
      [],
      (tx, results) => {
        console.log('userconsent_sandbox table created successfully');
      },
      error => {
        console.error('Error creating userconsent_sandbox table: ', error);
      }
    );
  });
};

export const addDetails = (details) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO userconsent_sandbox (
        userId,
        scope,
        bankname,
        refreshedtoken,
        consentid,
        consentexpiry,
        paymentid,
        consentpayload,
        status,
        account_customer_consented,
        account_details
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        details.userId,
        details.scope,
        details.bankname,
        details.refreshedtoken,
        details.consentid,
        details.consentexpiry,
        details.paymentid,
        details.consentpayload,
        details.status,
        details.account_customer_consented,
        details.account_details,
      ],
      (_, results) => {
        console.log('Details added successfully', results);
      },
      (_, error) => {
        console.error('Error adding details: ', error);
      }
    );
  });
};

export const updateDetails = (details, userId, columnsToUpdate) => {
  console.log('Updating details for userId:', userId);
  console.log('Details to update:', details);

  // Ensure there are columns to update
  if (!columnsToUpdate || columnsToUpdate.length === 0) {
    console.error('No columns specified for update.');
    return Promise.reject('No columns specified for update.');
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Construct SET clause dynamically based on columnsToUpdate
      const setClause = columnsToUpdate.map(column => `${column} = ?`).join(', ');

      // Construct SQL query
      const query = `UPDATE userconsent_sandbox SET ${setClause} WHERE userId = ?;`;

      // Construct parameters array
      const parameters = [...columnsToUpdate.map(column => details[column]), userId];

      tx.executeSql(
        query,
        parameters,
        (_, results) => {
          console.log('Details updated successfully', results);
          resolve(results);
        },
        (_, error) => {
          console.error('Error updating details: ', error);
          reject(error);
        }
      );
    });
  });
};



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







const displayResults = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM userconsent_sandbox;',
      [],
      (tx, results) => {
        const rows = results.rows;
        const len = rows.length;

        if (len > 0) {
          for (let i = 0; i < len; i++) {
            const row = rows.item(i);
            console.log('Row ID:', row.id, 'Row:', row);
          }
        } else {
          console.log('No entries found in the database.');
        }
      },
      (_, error) => {
        console.error('Error querying database: ', error);
      }
    );
  });
};

const deleteAllEntries = () => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM userconsent_sandbox;',
      [],
      (_, results) => {
        console.log('All entries deleted successfully');
        
        // Reset auto-increment ID after deleting all entries
        tx.executeSql(
          'DELETE FROM sqlite_sequence WHERE name = "userconsent_sandbox";',
          [],
          (_, results) => {
            console.log('Auto-increment ID reset successfully');
          },
          (_, error) => {
            console.error('Error resetting auto-increment ID: ', error);
          }
        );
      },
      (_, error) => {
        console.error('Error deleting entries: ', error);
      }
    );
  });
};

// const deleteDatabase = () => {
//   db.close(
//     () => {
//       console.log('Database closed successfully');
//       SQLite.deleteDatabase({ name: 'dbSandbox.db', location: 'default' },
//         () => {
//           console.log('Database deleted successfully');
//         },
//         (error) => {
//           console.error('Error deleting database: ', error);
//         }
//       );
//     },
//     (error) => {
//       console.error('Error closing database: ', error);
//     }
//   );
// };

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

export const fetchAccountCustomerConsented = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT account_details FROM userconsent_sandbox WHERE userId = ?;',
        [userId],
        (_, results) => {
          const rows = results.rows;
          if (rows.length > 0) {
            const row = rows.item(0);
            const account_details = row.account_details;
            resolve(account_details);
          } else {
            // Handle the case where no entry is found for the specified userId
            resolve(null);
          }
        },
        (_, error) => {
          console.error('Error fetching account_customer_consented: ', error);
          reject(error);
        }
      );
    });
  });
};


const userIdToFetch = 1001;

fetchAccountCustomerConsented(userIdToFetch)
  .then((account_details) => {
    if (account_details !== null) {
      console.log(`Account Customer Consented for userId ${userIdToFetch}:`, account_details);
    } else {
      console.log(`No entry found for userId ${userIdToFetch}.`);
    }
  })
  .catch((error) => {
    console.error('Error fetching account_customer_consented:', error);
  });

const Database = () => {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <View>
      <Text>SQLite Database</Text>
      {/* <Button title="Add Dummy Entry" onPress={addDummyEntry} /> */}
      <Button title="Display Results" onPress={displayResults} />
      <Button title="Delete All Entries" onPress={deleteAllEntries} />
      {/* <Button title="Delete Database" onPress={deleteDatabase} /> */}
    </View>
  );
};

export default Database;
