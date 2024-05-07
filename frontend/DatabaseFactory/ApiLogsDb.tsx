import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
class ApiLogsDb {
  private companyName: string;
  private apiClient: string;
  private scope: string;
    private apiDb:SQLiteDatabase;
  constructor(companyName: string, apiClient: string,scope:string) {
    this.companyName = companyName;
    this.apiClient = apiClient;
    this.scope = scope;
    this.apiDb = SQLite.openDatabase({ name: 'apiLogs.db', location: 'default' })as unknown as SQLiteDatabase;;
  }

  async initDatabaseApi(): Promise<void>{
    await new Promise<void>((resolve, reject) => {
      this.apiDb.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS apiLogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            time TEXT,
            api_name TEXT,
            scope TEXT,
            status TEXT,
            response TEXT,
            userId TEXT,
            payload TEXT,
            consentId TEXT,
            refreshtoken TEXT,
            paymentId TEXT,
            bankName TEXT,
            accountsList TEXT,
            vrpId TEXT,
            vrpPayload TEXT
          );`,
          [],
          (_, results) => {
            console.log('apiLogs table created successfully');
            resolve();
          },
          (_,error) => {
            console.error('Error creating apiLogs table: ', error);
            reject(error);
          },
        );
      });
    });
  }

  async insertLog(logData: {
    date: any,
    time: any,
    api_name: any,
    scope: any,
    status: any,
    response: any,
    userId: any,
    payload: any,
    consentId: any,
    refreshtoken: any,
    paymentId: any,
    bankName: any,
    accountsList: any,
    vrpId: any,
    vrpPayload: any
}): Promise<void> {
    const {
        date,
        time,
        api_name,
        scope,
        status,
        response,
        userId,
        payload,
        consentId,
        refreshtoken,
        paymentId,
        bankName,
        accountsList,
        vrpId,
        vrpPayload
    } = logData;

    await new Promise<void>((resolve, reject) => {
        this.apiDb.transaction(tx => {
            tx.executeSql(
                `INSERT INTO apiLogs (
            date,
            time,
            api_name,
            scope,
            status,
            response,
            userId,
            payload,
            consentId,
            refreshtoken,
            paymentId,
            bankName,
            accountsList,
            vrpId,
            vrpPayload
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    date,
                    time,
                    api_name,
                    scope,
                    status,
                    response,
                    userId,
                    payload,
                    consentId,
                    refreshtoken,
                    paymentId,
                    bankName,
                    accountsList,
                    vrpId,
                    vrpPayload
                ],
                (_, results) => {
                    console.log('Log entry inserted successfully', results);
                    resolve();
                },
                (_, error) => {
                    console.error('Error inserting log entry: ', error);
                    reject(error);
                },
            );
        });
    });
}


  async retrieveData():Promise<void> {
    await new Promise((resolve, reject) => {
      this.apiDb.transaction(tx => {
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
  }

  async deleteApiLogsTable() {
    return new Promise<void>((resolve, reject) => {
      this.apiDb.transaction(tx => {
        tx.executeSql(
          'DROP TABLE IF EXISTS apiLogs;',
          [],
          (_, results) => {
            console.log('apiLogs table deleted successfully');
            resolve();
          },
          error => {
            console.error('Error deleting apiLogs table: ', error);
            reject(error);
          },
        );
      });
    });
  }

  async alterApiLogsTable() {
    return new Promise<void>((resolve, reject) => {
      this.apiDb.transaction(tx => {
        tx.executeSql(
          `ALTER TABLE apiLogs 
           ADD COLUMN vrpId TEXT;
           ALTER TABLE apiLogs 
           ADD COLUMN vrpPayload TEXT;
          `,
          [],
          (_, results) => {
            console.log('apiLogs table altered successfully');
            resolve();
          },
          error => {
            console.error('Error altering apiLogs table: ', error);
            reject(error);
          },
        );
      });
    });
  }
}

export default ApiLogsDb;
