import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

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
  //update details via consentId PISP

  async updateDataByConsentIdPisp(
    consentId: string,
    newData: { [key: string]: any },
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
          (_, { rows }) => {
            if (rows.length > 0) {
              console.log("refreshToken", rows.item(0).refreshToken)
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


  //create table for vrp transactions
  async initDatabaseAndroidVrpTransactions(): Promise<void> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${tableName} (
        userId TEXT,
        scope TEXT,
        consentId TEXT,
        vrpId TEXT,
        vrpPayload TEXT,
        status TEXT,
        last_updated_date TEXT,
        last_updated_time TEXT
      );`,
          [],
          (_, result) => {
            console.log(`VRP Transactions Table ${tableName} created successfully.`);
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
  //insert VRP transactions
  async insertDataVrpTransact(vrpTransactToStore: {
    userId: any;
    scope: any;
    consentId: any;
    vrpId: any;
    vrpPayload: any;
    status: any;
    last_updated_date?: any;
    last_updated_time?: any;
  }): Promise<void> {
    const {
      userId,
      scope,
      consentId,
      vrpId,
      vrpPayload,
      status
    } = vrpTransactToStore;

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${tableName} (userId,
            scope,
            consentId,
            vrpId,
            vrpPayload,
            status,
            last_updated_date,
            last_updated_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            userId,
            scope,
            consentId,
            vrpId,
            vrpPayload,
            status,
            currentDate,
            currentTime
          ],
          (_, results) => {
            if (results.rowsAffected > 0) {
              console.log('Data inserted successfully in Vrp Transactions table', results);
              resolve();
            } else {
              console.error('No rows affected during insertion');
              reject(new Error('No rows affected'));
            }
          },
          (_, error) => {
            console.error('Error inserting data in Vrp transactions Table: ', error);
            reject(error);
          },
        );
      });
    });
  }
  //create table for vrp 
  async initDatabaseAndroidVrp(): Promise<void> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${tableName} (
          userId TEXT,
          scope TEXT,
          refreshToken TEXT,
          consentId TEXT,
          consentPayload TEXT,
          consentExpiry TEXT,
          status TEXT,
          accountDetails TEXT,
        last_updated_date TEXT,
        last_updated_time TEXT
      );`,
          [],
          (_, result) => {
            console.log(`VRP Table ${tableName} created successfully.`);
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
  //insert VRP 
  async insertDataVrp(vrpToStore: {
    userId: any;
    scope: any;
    refreshToken: any;
    consentId: any;
    consentPayload: any;
    consentExpiry: any;
    status: any;
    accountDetails: any;
    last_updated_date?: any;
    last_updated_time?: any;
  }): Promise<void> {
    const {
      userId,
      scope,
      refreshToken,
      consentId,
      consentPayload,
      consentExpiry,
      status,
      accountDetails
    } = vrpToStore;

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${tableName} (userId,
            scope,
            refreshToken,
            consentId,
            consentPayload,
            consentExpiry,
            status,
            accountDetails,
            last_updated_date,
            last_updated_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            userId,
            scope,
            refreshToken,
            consentId,
            consentPayload,
            consentExpiry,
            status,
            accountDetails,
            currentDate,
            currentTime
          ],
          (_, results) => {
            if (results.rowsAffected > 0) {
              console.log('Data inserted successfully in Vrp table',results);
              resolve();
            } else {
              console.error('No rows affected during insertion');
              reject(new Error('No rows affected'));
            }
          },
          (_, error) => {
            console.error('Error inserting data in Vrp Table: ', error);
            reject(error);
          },
        );
      });
    });
  }
  //create table for CA
  async initDatabaseAndroidCa(): Promise<void> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${tableName} (
        userId TEXT,
        scope TEXT,
        consentId TEXT,
        customerDetails TEXT,
        accountDetails TEXT,
        last_updated_date TEXT,
        last_updated_time TEXT
      );`,
          [],
          (_, result) => {
            console.log(`CA Table ${tableName} created successfully.`);
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
  //insert CA
  async insertDataCA(caToStore: {
    userId: any;
    scope: any;
    consentId: any;
    customerDetails: any;
    accountDetails: any;
    last_updated_date?: any;
    last_updated_time?: any;
  }): Promise<void> {
    const {
      userId,
      scope,
      consentId,
      customerDetails,
      accountDetails
    } = caToStore;

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${tableName} (userId,
            scope,
            consentId,
            customerDetails,
            accountDetails,
            last_updated_date,
            last_updated_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?);`,
          [
            userId,
            scope,
            consentId,
            customerDetails,
            accountDetails,
            currentDate,
            currentTime
          ],
          (_, results) => {
            if (results.rowsAffected > 0) {
              console.log('Data inserted successfully in CA table', results);
              resolve();
            } else {
              console.error('No rows affected during insertion');
              reject(new Error('No rows affected'));
            }
          },
          (_, error) => {
            console.error('Error inserting data in CA Table: ', error);
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
  //fetch data according to scope or consentId
  async fetchDataUsingScope(scope: string): Promise<any> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    return new Promise((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM ${tableName} WHERE scope = ? ;`,
          [scope],
          (_, results) => {
            console.log(results);
            const rows = results.rows;
            const data = [];
            if (rows.length > 0) {
              for (let i = 0; i < rows.length; i++) {
                const row = rows.item(i);
                data.push(row);
              }
              if (data.length > 0) {
                resolve(data);
              }
            } else {
              // console.log(`No entry found for ${ 'scope:' + scope}`);
              resolve(null);
            }
          },
          (_, error) => {
            console.error('Error fetching data in database:', error);
            reject(error);
          },
        );
      });
    });
  }

  async checkTableOrEntryExist(): Promise<string> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    return new Promise((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`,
          [tableName],
          (_, { rows: tableCheck }) => {
            if (tableCheck.length === 0) {
              console.log(`Table ${tableName} does not exist`);
              resolve(`Table ${tableName} does not exist`); // Resolve with an empty array if the table does not exist
            } else {
              tx.executeSql(
                `SELECT COUNT(*) FROM ${tableName};`,
                [],
                (_, { rows }) => {
                  if (rows.length === 0 || rows === null || rows === undefined) {
                    console.log('Table is empty');
                    resolve('Table is empty'); // Resolve with an empty array if the table is empty
                  } else {
                    resolve('yes'); // Resolve the promise with the fetched data
                  }
                },
                (_, error) => {
                  console.error('Error retrieving data in display data:', error);
                  resolve(error.toString()); // Resolve with an empty array if there's an error
                }
              );
            }
          },
          (_, error) => {
            console.error('Error checking table existence:', error);
            resolve(error.toString()); // Resolve with an empty array if there's an error checking table existence
          }
        );
      });
    });
  }

  async fetchDataUsingConsentId(consentId: string): Promise<any> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    return new Promise((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM ${tableName} WHERE consentId = ?ORDER BY last_updated_date DESC,last_updated_time DESC ;`,
          [consentId],
          (_, { rows }) => {
            if (rows.length > 0) {
              const rowData = [];
              for (let i = 0; i < rows.length; i++) {
                rowData.push(rows.item(i));
              }
              if (rowData.length > 0) {
                resolve(rowData);
              }
            } else {
              // console.log(`No entry found for ${consentId ? 'consentId:' + consentId }`);
              resolve(null);
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
  // Method to update data based on consentId 
  async updateDataByConsentId(
    consentId: string,
    details: any,
    columnsToUpdate: any,
  ): Promise<void> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    if (!columnsToUpdate || columnsToUpdate.length === 0) {
      console.error('No columns specified for update.');
      return Promise.reject('No columns specified for update.');
    }

    return new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        const setClause = columnsToUpdate
          .map((column: any) => `${column} = ?`)
          .join(', ');
        const updatedSetClause = `${setClause}, last_updated_date = ?, last_updated_time = ?`;

        const query = `UPDATE ${tableName} SET ${updatedSetClause} WHERE consentid = ?;`;
        // Construct SQL query

        // Construct parameters array
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        const parameters = [
          ...columnsToUpdate.map((column: string | number) => details[column].toString()),
          currentDate,
          currentTime,
          consentId,
        ];

        tx.executeSql(
          query,
          parameters,
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

  //method to delete entire table
  async deleteTable(): Promise<void> {
    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `DROP TABLE IF EXISTS ${tableName};`,
          [],
          (_, result) => {
            console.log(`${tableName} database deleted successfully`, result);
            resolve();
          },
          (_, error) => {
            console.error(`${tableName} Error deleting database:`, error);
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
