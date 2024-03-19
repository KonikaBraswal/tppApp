import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'dbSandbox.db', location: 'default' });

export const initDatabase = () => {
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
        account_details TEXT,
        last_updated_date TEXT,
        last_updated_time TEXT
      );`,
      [],
      (tx, results) => {
        console.log('userconsent_sandbox table created successfully');
      },
      error => {
        console.error('Error creating userconsent_sandbox table: ', error);
      },
    );
  });
};
export const initDatabaseTransaction = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS vrpTransactions_sandbox (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        scope TEXT,
        bankname TEXT,
        consentid TEXT,
        vrpid TEXT,
        vrppayload TEXT,
        status TEXT,
        date TEXT,
        time TEXT
      );`,
      [],
      (tx, results) => {
        console.log('vrpTransactions_sandbox table created successfully');
      },
      error => {
        console.error('Error creating vrpTransactions_sandbox table: ', error);
      },
    );
  });
};

export const addDetails = details => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

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
        account_details,
        last_updated_date,
        last_updated_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
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
        currentDate,
        currentTime,
      ],
      (_, results) => {
        console.log('Details added successfully', results);
      },
      (_, error) => {
        console.error('Error adding details: ', error);
      },
    );
  });
};
export const addTransactions = details => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO vrpTransactions_sandbox (
        userId,
        scope,
        bankname,
        consentid,
        vrpid,
        vrppayload,
        status,
        date,
        time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        details.userId,
        details.scope,
        details.bankname,
        details.consentid,
        details.vrpid,
        details.vrppayload,
        details.status,
        currentDate,
        currentTime,
      ],
      (_, results) => {
        console.log('Transactions added successfully', results);
      },
      (_, error) => {
        console.error('Error adding transactions: ', error);
      },
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
    db.transaction(tx => {
      // Construct SET clause dynamically based on columnsToUpdate
      const setClause = columnsToUpdate
        .map(column => `${column} = ?`)
        .join(', ');

      // Add last_updated_date and last_updated_time to SET clause
      const updatedSetClause = `${setClause}, last_updated_date = ?, last_updated_time = ?`;

      // Construct SQL query
      const query = `UPDATE userconsent_sandbox SET ${updatedSetClause} WHERE userId = ?;`;

      // Construct parameters array
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      const parameters = [
        ...columnsToUpdate.map(column => details[column].toString()),
        //...columnsToUpdate.map(column => details[column]),----------Sunil
        currentDate,
        currentTime,
        userId,
      ];

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
        },
      );
    });
  });
};

// userconsent_sandbox
// vrpTransactions_sandbox
export const RetrieveData = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM userconsent_sandbox;',
        [],
        (tx, results) => {
          const rows = results.rows;
          const len = rows.length;
          const data = [];

          if (len > 0) {
            for (let i = 0; i < len; i++) {
              const row = rows.item(i);
              data.push(row);
              console.log('Row ID:', row.id, 'Row:', row);
            }

            resolve(data);
          } else {
            console.log('No entries found in the database.');
            resolve([]);
          }
        },
        (_, error) => {
          console.error('Error querying database: ', error);
          reject(error);
        },
      );
    });
  });
};
export const RetrieveDataforVrp = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM vrpTransactions_sandbox;',
        [],
        (tx, results) => {
          const rows = results.rows;
          const len = rows.length;
          const data = [];

          if (len > 0) {
            for (let i = 0; i < len; i++) {
              const row = rows.item(i);
              if(row.consentid=='VRP-4206f31b-5d57-411b-86a3-bd86bcc42f49'){
                data.push(row);
                console.log('Row ID:', row.id, 'Row:', row);
              }
            }

            resolve(data);
          } else {
            console.log('No entries found in the database.');
            resolve([]);
          }
        },
        (_, error) => {
          console.error('Error querying database: ', error);
          reject(error);
        },
      );
    });
  });
};

export const updateDetailsForVrp = (details, consentid, columnsToUpdate) => {
  console.log('Updating details for consentid:', consentid);
  console.log('Details to update:', details);

  // Ensure there are columns to update
  if (!columnsToUpdate || columnsToUpdate.length === 0) {
    console.error('No columns specified for update.');
    return Promise.reject('No columns specified for update.');
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Construct SET clause dynamically based on columnsToUpdate
      const setClause = columnsToUpdate
        .map(column => `${column} = ?`)
        .join(', ');

      // Add last_updated_date and last_updated_time to SET clause
      const updatedSetClause = `${setClause}, last_updated_date = ?, last_updated_time = ?`;
        
        const query = `UPDATE userconsent_sandbox SET ${updatedSetClause} WHERE consentid = ?;`;
      // Construct SQL query

      // Construct parameters array
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      const parameters = [
        ...columnsToUpdate.map(column => details[column].toString()),
        //...columnsToUpdate.map(column => details[column]),----------Sunil
        currentDate,
        currentTime,
        consentid,
      ];

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
        },
      );
    });
  });
};



export const fetchTransactionsForUserConsent = consentid => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM vrpTransactions_sandbox WHERE consentid = ?;',
        [consentid],
        (_, results) => {
          console.log('Query results:', results.rows); // Log the results for debugging
          const rows = results.rows;
          const data = [];
          if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              if(row.status=='AcceptedSettlementCompleted'){
                data.push(row);
                console.log("transactions-->",row);
              }
            }
            if (data.length > 0) resolve(data);
          } else {
            // If no entry is found, clear the globalConsentId
            // globalConsentId = null;
            console.log('No entry found for this consentid:', consentid); // Log for debugging
            resolve(null);
          }
        },
        (_, error) => {
          //-----------------------------------------
          console.error('Error fetching consent Id: ', error);
          reject(error);
        },
      );
    });
  });
};

export const fetchAllDataforScope = scope => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM userconsent_sandbox WHERE scope = ?;',
        [scope],
        (_, results) => {
          console.log('Query results:', results.rows); // Log the results for debugging
          const rows = results.rows;
          const data = [];
          if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              if (row.status == 'Authorised') {
                data.push({
                  consentid: row.consentid,
                  consentpayload: row.consentpayload,
                  refreshtoken: row.refreshedtoken,
                });
              }
            }
            if (data.length > 0) resolve(data);
          } else {
            // If no entry is found, clear the globalConsentId
            // globalConsentId = null;
            console.log('No entry found for this scope:', scope); // Log for debugging
            resolve(null);
          }
        },
        (_, error) => {
          //-----------------------------------------
          console.error('Error fetching consent Id: ', error);
          reject(error);
        },
      );
    });
  });
};

export const displayResults = () => {
  RetrieveData()
    .then(data => {
      console.log('Retrieved data:', data);
    })
    .catch(error => {
      console.error('Error:', error);
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
          },
        );
      },
      (_, error) => {
        console.error('Error deleting entries: ', error);
      },
    );
  });
};

const deleteDatabase = () => {
  db.close(
    () => {
      console.log('Database closed successfully');
      SQLite.deleteDatabase(
        { name: 'dbSandbox.db', location: 'default' },
        () => {
          console.log('Database deleted successfully');
        },
        error => {
          console.error('Error deleting database: ', error);
        },
      );
    },
    error => {
      console.error('Error closing database: ', error);
    },
  );
};


export var globalRefreshedToken;

export const fetchRefreshedToken = userId => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT refreshedtoken FROM userconsent_sandbox WHERE userId = ?;',
        [userId],
        (_, results) => {
          console.log('Query results:', results.rows); // Log the results for debugging
          const rows = results.rows;
          if (rows.length > 0) {
            const row = rows.item(0);
            const refreshedtoken = row.refreshedtoken;
            // console.log('Refreshed Token from database:', refreshedtoken); // Log the refreshedtoken for debugging
            globalRefreshedToken = refreshedtoken;
            resolve(refreshedtoken);
          } else {
            // If no entry is found, clear the globalRefreshedToken
            globalRefreshedToken = null;
            console.log('No entry found for userId:', userId); // Log for debugging
            resolve(null);
          }
        },
        (_, error) => {
          //-----------------------------------------
          console.error('Error fetching refreshedtoken: ', error);
          reject(error);
        },
      );
    });
  });
};

const userIdToFetch = 1001;

fetchRefreshedToken(userIdToFetch)
  .then(refreshedtoken => {
    if (refreshedtoken !== null) {
      console.log(
        `Refreshed Token for userId ${userIdToFetch}:`,
        refreshedtoken,
      );
      // processRefreshedToken();
    } else {
      console.log(`No entry found for userId ${userIdToFetch}.`);
      globalRefreshedToken = null;
      processRefreshedToken();
    }
    // processRefreshedToken();
  })
  .catch(error => {
    //-----------------------------------------
    console.error('Error fetching Refreshed Token:', error);
  });

export const processRefreshedToken = () => {
  console.log('Refreshed Token:', globalRefreshedToken);
};

const Database = () => {
  return (
    <View>
      <Text>SQLite Database</Text>
      {/* <Button title="Add Dummy Entry" onPress={addDummyEntry} /> */}
      <Button title="Display Results" onPress={RetrieveDataforVrp} />
      <Button title="Delete All Entries" onPress={deleteAllEntries} />

      <Button title="Delete Database" onPress={deleteDatabase} />
    </View>
  );
};

export default Database;
