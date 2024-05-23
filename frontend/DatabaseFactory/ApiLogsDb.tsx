import SQLite, { ResultSet, SQLError, SQLiteDatabase, Transaction } from 'react-native-sqlite-storage';

class ApiLogsDb {
  private companyName: string;
  private apiClient: string;
  private scope: string;
  private apiDb: SQLiteDatabase;

  constructor(companyName: string, apiClient: string, scope: string) {
    this.companyName = companyName;
    this.apiClient = apiClient;
    this.scope = scope;
    this.apiDb = SQLite.openDatabase({ name: 'apiLogs.db', location: 'default' }) as unknown as SQLiteDatabase;
  }

  async initDatabaseApi(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.apiDb.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS apiLogsData (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            time TEXT,
            api_name TEXT,
            scope TEXT,
            status TEXT,
            response TEXT
          );`,
          [],
          (_, results) => {
            console.log('apiLogsData table created successfully');
            resolve();
          },
          (_, error) => {
            console.error('Error creating apiLogsData table: ', error);
            reject(error);
          }
        );
      });
    });
  }

  async insertLog(logData: {
    date: string;
    time: string;
    api_name: string;
    scope: string;
    status: string;
    response: string;
  }): Promise<void> {
    const { date, time, api_name, scope, status, response } = logData;

    return new Promise<void>((resolve, reject) => {
      if (!this.apiDb) {
        console.error('Database not initialized');
        reject(new Error('Database not initialized'));
        return;
      }

      this.apiDb.transaction((tx: Transaction) => {
        tx.executeSql(
          `INSERT INTO apiLogsData (
            date,
            time,
            api_name,
            scope,
            status,
            response
          ) VALUES (?, ?, ?, ?, ?, ?);`,
          [date, time, api_name, scope, status, response],
          (_: Transaction, results: ResultSet) => {
            console.log('Log entry inserted successfully', results);
            resolve();
          },
          (_: Transaction, error: SQLError) => {
            console.error('Error inserting log entry:', error);
            reject(error);
          }
        );
      }, (transactionError: SQLError) => {
        console.error('Transaction error:', transactionError);
        reject(transactionError);
      });
    });
  }

  async retrieveData(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.apiDb.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM apiLogsData',
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
          }
        );
      });
    });
  }

  async displayResults() {
    try {
      const data = await this.retrieveData();
      console.log('Retrieved data:', data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async deleteAllLogs() {
    return new Promise<void>((resolve, reject) => {
      this.apiDb.transaction(tx => {
        tx.executeSql(
          'DELETE FROM apiLogsData',
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
  }

  async deleteApiLogsTable() {
    return new Promise<void>((resolve, reject) => {
      this.apiDb.transaction(tx => {
        tx.executeSql(
          'DROP TABLE IF EXISTS apiLogsData;',
          [],
          (_, results) => {
            console.log('apiLogsData table deleted successfully');
            resolve();
          },
          error => {
            console.error('Error deleting apiLogsData table: ', error);
            reject(error);
          }
        );
      });
    });
  }

  async alterApiLogsTable(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.apiDb.transaction(tx => {
        tx.executeSql(
          `ALTER TABLE apiLogsData ADD COLUMN vrpId TEXT;`,
          [],
          (_, results) => {
            console.log('Added vrpId column to apiLogsData table');
          },
          (_, error) => {
            console.error('Error adding vrpId column:', error);
            reject(error);
          }
        );
        tx.executeSql(
          `ALTER TABLE apiLogsData ADD COLUMN vrpPayload TEXT;`,
          [],
          (_, results) => {
            console.log('Added vrpPayload column to apiLogsData table');
            resolve();
          },
          (_, error) => {
            console.error('Error adding vrpPayload column:', error);
            reject(error);
          }
        );
      });
    });
  }
}


export default ApiLogsDb;
