import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

class AndroidClientDb {
  private companyName: string;
  private apiClient: string;
  private scope: string;
  private androidDb: SQLiteDatabase;

  constructor(companyName: string, apiClient: string, scope: string) {
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
            console.log(`PISP Table ${tableName} created successfully.`);
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
    console.log("hi using aisp me");
    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${tableName} (
          userId TEXT,
          scope TEXT,
          bankName TEXT,
          consentId TEXT,
          consentPayload TEXT,
          refreshToken TEXT,
          accountsList TEXT
        );`,
          [],
          (_, result) => {
            console.log(`AISP Table ${tableName} created successfully.`);
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

  // Method to insert data into the SQLite database AISP
  async insertDataAisp(aispToStore: {
    userId: any;
    scope: string;
    bankName: string;
    consentId: string;
    consentPayload: string;
    refreshToken: string;
    accountsList: string;
  }): Promise<void> {
    const {
      userId,
      scope,
      bankName,
      consentId,
      consentPayload,
      refreshToken,
      accountsList,
    } = aispToStore;

    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${tableName} (userId, scope, bankName, consentId, consentPayload, refreshToken, accountsList) 
          VALUES (?, ?, ?, ?, ?, ?, ?);`,
          [
            userId,
            scope,
            bankName,
            consentId,
            consentPayload,
            refreshToken,
            accountsList,
          ],
          (_, results) => {
            if (results.rowsAffected > 0) {
              console.log('Data inserted successfully');
              resolve();
            } else {
              console.error('No rows affected during insertion');
              reject(new Error('No rows affected'));
            }
          },
          (_, error) => {
            console.error('Error inserting data: ', error);
            reject(error);
          },
        );
      });
    });
  }
  // async fetchRefreshedToken(userId: any): Promise<any> {
  //   console.log(userId);// Local variable to hold the fetched token
  //   const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
  //   console.log(tableName);
  //   await new Promise<any>((resolve, reject) => {
  //     this.androidDb.transaction(tx => {
  //       tx.executeSql(
  //         `SELECT refreshToken FROM ${tableName} WHERE userId =?;`,
  //         [userId],
  //         (_, results) => {
  //           console.log('Query results:', results.rows); // Log the results for debugging
  //           const rows = results.rows;
  //           if (rows.length > 0) {
  //             const row = rows.item(0);
  //             const refreshedtoken = row.refreshToken;
  //             console.log('Refreshed Token from database:', refreshedtoken); // Log the refreshedtoken for debugging
  //             resolve(userId);
  //           } else {
  //             console.log('No entry found for userId:', userId); // Log for debugging
  //             resolve(null);
  //           }
  //         },
  //         (_, error) => {
  //           console.error('Error fetching refreshedtoken: ', error);
  //           reject(error);
  //         },
  //       );
  //     });
  //   });
  // }

  async fetchRefreshedToken(userId: any): Promise<any[]> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    return new Promise((resolve, reject) => {
      this.androidDb.transaction(tx => {
        // Adjusted SQL query to include WHERE clause filtering by userId
        tx.executeSql(
          `SELECT refreshToken FROM ${tableName} WHERE userId =?;`,
          [userId], // Pass userId as a parameter to prevent SQL injection
          (_, {rows}) => {
            if (rows.length > 0) {
              console.log("refreshToken",rows.item(0).refreshToken)
              // Assuming refreshToken is stored directly in the row, adjust if structure is different
              resolve(rows.item(0).refreshToken); // Return the refreshToken of the first matching row
            } else {
              resolve([]); // No matching userId found
            }
          },
          (_, error) => {
            console.error('Error retrieving data:', error);
            reject(error);
          },
        );
      });
    });
  }


  //VRP
  async initDatabaseAndroidVrp(): Promise<void> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${tableName} (
          userId TEXT,
          scope TEXT,
          bankName TEXT,
          consentId TEXT,
          consentPayload TEXT,
          vrpId TEXT,
          vrpPayload TEXT,
          refreshToken TEXT,
          responseVrp TEXT,
          status TEXT
        );`,
          [],
          (_, result) => {
            console.log(`AISP Table ${tableName} created successfully.`);
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

  async insertDataVrp(vrpToStore: {
    userId: any;
    scope: string;
    bankName: string;
    consentId: string;
    consentPayload: string;
    vrpId: string;
    paymentId: string;
    vrpPayload: string;
    refreshToken: string;
    responseVrp: string;
  }): Promise<void> {
    const {
      userId,
      scope,
      bankName,
      consentId,
      consentPayload,
      vrpId,
      paymentId,
      vrpPayload,
      refreshToken,
      responseVrp,
    } = vrpToStore;

    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${tableName} (userId, scope, bankName, consentId, consentPayload, vrpId, paymentId, vrpPayload, refreshToken, responseVrp) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            userId,
            scope,
            bankName,
            consentId,
            consentPayload,
            vrpId,
            paymentId,
            vrpPayload,
            refreshToken,
            responseVrp,
          ],
          (_, results) => {
            if (results.rowsAffected > 0) {
              console.log('Data inserted successfully');
              resolve();
            } else {
              console.error('No rows affected during insertion');
              reject(new Error('No rows affected'));
            }
          },
          (_, error) => {
            console.error('Error inserting data: ', error);
            reject(error);
          },
        );
      });
    });
  }

  //CA

  async initDatabaseAndroidCa(): Promise<void> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${tableName} (
          userId TEXT,
          scope TEXT,
          bankName TEXT,
          consentId TEXT,
          consentPayload TEXT,
          vrpId TEXT,
          vrpPayload TEXT,
          refreshToken TEXT,
          responseVrp TEXT,
          status TEXT
        );`,
          [],
          (_, result) => {
            console.log(`AISP Table ${tableName} created successfully.`);
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

  async insertDatCA(caToStore: {
    userId: any;
    scope: string;
    bankName: string;
    consentId: string;
    consentPayload: string;
    vrpId: string;
    paymentId: string;
    vrpPayload: string;
    refreshToken: string;
    responseVrp: string;
  }): Promise<void> {
    const {
      userId,
      scope,
      bankName,
      consentId,
      consentPayload,
      vrpId,
      paymentId,
      vrpPayload,
      refreshToken,
      responseVrp,
    } = caToStore;

    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${tableName} (userId, scope, bankName, consentId, consentPayload, vrpId, paymentId, vrpPayload, refreshToken, responseVrp) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            userId,
            scope,
            bankName,
            consentId,
            consentPayload,
            vrpId,
            paymentId,
            vrpPayload,
            refreshToken,
            responseVrp,
          ],
          (_, results) => {
            if (results.rowsAffected > 0) {
              console.log('Data inserted successfully');
              resolve();
            } else {
              console.error('No rows affected during insertion');
              reject(new Error('No rows affected'));
            }
          },
          (_, error) => {
            console.error('Error inserting data: ', error);
            reject(error);
          },
        );
      });
    });
  }

  //COMMON
  // Method to delete all data entries from the database
  async deleteAllData(): Promise<void> {
    console.log("clicked");
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

  async displayData(): Promise<any[]> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    return new Promise((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM ${tableName};`,
          [],
          (_, {rows}) => {
            const rowData = [];
            for (let i = 0; i < rows.length; i++) {
              rowData.push(rows.item(i));
            }
            resolve(rowData); // Resolve the promise with the fetched data
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

export default AndroidClientDb;
