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


  

  async fetchConsentId(userId: any): Promise<any[]> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    return new Promise((resolve, reject) => {
      this.androidDb.transaction(tx => {
        // Adjusted SQL query to include WHERE clause filtering by userId
        tx.executeSql(
          `SELECT consentId FROM ${tableName} WHERE userId =?;`,
          [userId], // Pass userId as a parameter to prevent SQL injection
          (_, {rows}) => {
            if (rows.length > 0) {
              console.log("consentId", rows.item(0).consentId);
              // Assuming consentId is stored directly in the row, adjust if structure is different
              resolve(rows.item(0).consentId); // Return the consentId of the first matching row
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
 // Method to update the refresh token for AISP based on userId
 async updateRefreshTokenAisp(userId: string, newRefreshToken: string,consentId:string): Promise<void> {
  const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
  
  await new Promise<void>((resolve, reject) => {
    this.androidDb.transaction(tx => {
      tx.executeSql(
        `UPDATE ${tableName} SET refreshToken = ? WHERE userId = ? AND consentId=?;`,
        [newRefreshToken, userId,consentId],
        (_, result) => {
          if (result.rowsAffected > 0) {
            console.log('Refresh token updated successfully');
            resolve();
          } else {
            console.error('No rows affected during update');
            reject(new Error('No rows affected'));
          }
        },
        (_, error) => {
          console.error('Error updating refresh token:', error);
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
          `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`,
          [tableName],
          (_, { rows: tableCheck }) => {
            if (tableCheck.length === 0) {
              console.log(`Table ${tableName} does not exist`);
              resolve([]); // Resolve with an empty array if the table does not exist
            } else {
              tx.executeSql(
                `SELECT * FROM ${tableName};`,
                [],
                (_, { rows }) => {
                  if (rows.length === 0 || rows === null || rows === undefined) {
                    console.log('Table is empty');
                    resolve([]); // Resolve with an empty array if the table is empty
                  } else {
                    const rowData = [];
                    for (let i = 0; i < rows.length; i++) {
                      rowData.push(rows.item(i));
                    }
                    resolve(rowData); // Resolve the promise with the fetched data
                  }
                },
                (_, error) => {
                  console.error('Error retrieving data in display data:', error);
                  resolve([]); // Resolve with an empty array if there's an error
                }
              );
            }
          },
          (_, error) => {
            console.error('Error checking table existence:', error);
            resolve([]); // Resolve with an empty array if there's an error checking table existence
          }
        );
      });
    });
  }
  
  
  
}

export default AndroidClientDb;
