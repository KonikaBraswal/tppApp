import SQLite from 'react-native-sqlite-storage';

const apiDb = SQLite.openDatabase({ name: 'apiLogs.db', location: 'default' });

export const initDatabaseApi = () => {
  apiDb.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS apiLogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        time TEXT,
        api_name TEXT,
        scope TEXT,
        status TEXT,
        response TEXT
      );`,
      [],
      (tx, results) => {
        console.log('apiLogs table created successfully');
      },
      error => {
        console.error('Error creating apiLogs table: ', error);
      },
    );
  });
};

export const insertLog = details => {
  const { date, time, api_name, scope, status, response } = details; // Destructure details object

  apiDb.transaction(tx => {
    tx.executeSql(
      `INSERT INTO apiLogs (
        date,
        time,
        api_name,
        scope,
        status,
        response
      ) VALUES (?, ?, ?, ?, ?, ?);`,
      [date, time, api_name, scope, status, response],
      (_, results) => {
        console.log('Log entry inserted successfully', results);
      },
      (_, error) => {
        console.error('Error inserting log entry: ', error);
      },
    );
  });
};
export const RetrieveData = () => {
  return new Promise((resolve, reject) => {
    apiDb.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM apiLogs',
        [],
        (_, results) => {
          const rows = results.rows;
          const len = rows.length;
          const data = [];

          for (let i = 0; i < len; i++) {
            const row = rows.item(i);
            data.push(row);
          }

          resolve(data);
        },
        (_, error) => {
          console.error('Error querying database: ', error);
          reject(error);
        },
      );
    });
  });
};
export const displayResults = async () => {
  try {
    const data = await RetrieveData();
    console.log('Retrieved data:', data.response);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
export const deleteAllLogs = () => {
  return new Promise((resolve, reject) => {
    apiDb.transaction(tx => {
      tx.executeSql(
        'DELETE FROM apiLogs',
        [],
        (_, results) => {
          console.log('All logs deleted successfully');
          resolve();
        },
        (_, error) => {
          console.error('Error deleting logs: ', error);
          reject(error);
        }
      );
    });
  });
};

// Function to delete the apiLogs table
export const deleteApiLogsTable = () => {
  apiDb.transaction(tx => {
    tx.executeSql(
      'DROP TABLE IF EXISTS apiLogs;',
      [],
      (_, results) => {
        console.log('apiLogs table deleted successfully');
      },
      error => {
        console.error('Error deleting apiLogs table: ', error);
      },
    );
  });
};

//alter table
export const alterApiLogsTable = () => {
  apiDb.transaction(tx => {
    tx.executeSql(
      `ALTER TABLE apiLogs 
       ADD COLUMN scope TEXT;`,
      [],
      (_, results) => {
        console.log('apiLogs table altered successfully');
      },
      error => {
        console.error('Error altering apiLogs table: ', error);
      },
    );
  });
};

