import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

class AndroidClient {
  private companyName: string;
  private apiClient: string;
  private scope: string;
  private androidDb: SQLiteDatabase;

  constructor(companyName: string, apiClient: string,scope:string) {
    this.companyName = companyName;
    this.apiClient = apiClient;
    this.scope = scope;
    this.androidDb = SQLite.openDatabase({
      name: 'android.db',
      location: 'default',
    }) as unknown as SQLiteDatabase;
  }

 //PISP
  // Method to initialize the SQLite database for Android PISP
  async initDatabaseAndroidPisp(): Promise<void> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${tableName} (
            consentId TEXT,
            scope TEXT,
            payload TEXT,
            refreshtoken TEXT,
            paymentId TEXT,
            response TEXT,
            userId TEXT
          );`,
          [],
          (_, result) => {
            console.log(`Table ${tableName} created successfully.`);
            resolve();
          },
          (_, error) => {
            console.error(`Error creating table ${tableName}:`, error);
            reject(error);
          },
        );
      });
    });
  }

  // Method to insert data into the SQLite database PISP
  async insertDataPisp(pispToStore: {
    consentId: any;
    scope: any;
    payload: any;
    refreshtoken: any;
    paymentId: any;
    response: any;
    userId: any;
  }): Promise<void> {
    const {
      consentId,
      scope,
      payload,
      refreshtoken,
      paymentId,
      response,
      userId,
    } = pispToStore;
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${tableName} (consentId, scope, payload, refreshtoken, paymentId, response, userId) 
          VALUES (?, ?, ?, ?, ?, ?, ?);`,
          [
            consentId,
            scope,
            payload,
            refreshtoken,
            paymentId,
            response,
            userId,
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

  // Method to update data based on consentId PISP
  async updateDataByConsentIdPisp(
    consentId: string,
    newData: {[key: string]: any},
  ): Promise<void> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    const updateSet = Object.keys(newData)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(newData);
    values.push(consentId);

    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `UPDATE ${tableName} SET ${updateSet} WHERE consentId = ?;`,
          values,
          (_, result) => {
            console.log('Data updated successfully', result);
            resolve();
          },
          (_, error) => {
            console.error('Error updating data:', error);
            reject(error);
          },
        );
      });
    });
  }

//AISP
// Method to initialize the SQLite database for Android AISP
async initDatabaseAndroidAisp(): Promise<void> {
  const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

  await new Promise<void>((resolve, reject) => {
    this.androidDb.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableName} (
          consentId TEXT,
          scope TEXT,
          payload TEXT,
          refreshtoken TEXT,
          status TEXT,
          bankName TEXT,
          accountList TEXT,
          userId TEXT
        );`,
        [],
        (_, result) => {
          console.log(`Table ${tableName} created successfully.`);
          resolve();
        },
        (_, error) => {
          console.error(`Error creating table ${tableName}:`, error);
          reject(error);
        },
      );
    });
  });
}


//VRP


//COMMON
  // Method to delete all data entries from the database
  async deleteAllData(): Promise<void> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `DELETE FROM ${tableName};`,
          [],
          (_, result) => {
            console.log('All data entries deleted successfully', result);
            resolve();
          },
          (_, error) => {
            console.error('Error deleting data entries:', error);
            reject(error);
          },
        );
      });
    });
  }

  // Method to display data from the database
  async displayData(): Promise<void> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM ${tableName};`,
          [],
          (_, {rows}) => {
            console.log('Rows:');
            for (let i = 0; i < rows.length; i++) {
              console.log(rows.item(i));
            }
            resolve();
          },
          (_, error) => {
            console.error('Error retrieving data:', error);
            reject(error);
          },
        );
      });
    });
  }
}

export default AndroidClient;
