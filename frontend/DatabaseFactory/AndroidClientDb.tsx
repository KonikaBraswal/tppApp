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

  // Method to update data based on consentId PISP
  async updateDataByConsentId(
    consentId: string,
    details:any,
    columnsToUpdate:any,
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
          refreshToken TEXT,
          consentId TEXT,
          consentPayload TEXT,
          consentExpiry TEXT,
          status TEXT,
          account_customer_consented TEXT,
        account_details TEXT,
        last_updated_date TEXT,
        last_updated_time TEXT
        );`,
          [],
          (_, result) => {
            console.log(`VRP Table ${tableName} created successfully.`);
            resolve();
          },
          (_, error) => {
            console.error(`Error creating VRP table ${tableName}:`, error);
            reject(error);
          },
        );
      });
    });
  }
  //insert data in vrp table
  async insertDataVrp(vrpToStore: {
    userId: any;
    scope: string;
    bankName: string;
    refreshToken: string;
    consentId: string;
    consentPayload: string;
    consentExpiry: string;
    status: string;
    account_customer_consented: string;
    account_details: string;
    last_updated_date?: string;
    last_updated_time?: string;
  }): Promise<void> {
    const {
      userId,
      scope,
      bankName,
      refreshToken,
      consentId,
      consentPayload,
      consentExpiry,
      status,
      account_customer_consented,
      account_details,
      last_updated_date,
      last_updated_time
    } = vrpToStore;

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    await new Promise<void>((resolve, reject) => {
      this.androidDb.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${tableName} (userId,
            scope,
            bankName,
            refreshToken,
            consentId,
            consentPayload,
            consentExpiry,
            status,
            account_customer_consented,
            account_details,
            last_updated_date,
            last_updated_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);`,
          [
            userId,
            scope,
            bankName,
            refreshToken,
            consentId,
            consentPayload,
            consentExpiry,
            status,
            account_customer_consented,
            account_details,
            last_updated_date || currentDate,
            last_updated_time || currentTime
          ],
          (_, results) => {
            if (results.rowsAffected > 0) {
              console.log('Data inserted successfully in VRP table');
              resolve();
            } else {
              console.error('No rows affected during insertion');
              reject(new Error('No rows affected'));
            }
          },
          (_, error) => {
            console.error('Error inserting data in VRP table: ', error);
            reject(error);
          },
        );
      });
    });
  }
  //update details via consentId

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

  //create table for vrp transactions
  async initDatabaseAndroidVrpTransactions(): Promise < void> {
  const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

  await new Promise<void>((resolve, reject) => {
    this.androidDb.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableName} (
        userId TEXT,
        scope TEXT,
        bankName TEXT,
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
  async insertDatVrpTransact(vrpTransactToStore: {
  userId: any;
  scope: string;
  bankName: string;
  consentId: string;
  vrpId: string;
  vrpPayload: string;
  status: string;
  last_updated_date?: string;
  last_updated_time?: string;
}): Promise < void> {
  const {
    userId,
    scope,
    bankName,
    consentId,
    vrpId,
    vrpPayload,
    status,
    last_updated_date,
    last_updated_time
  } = vrpTransactToStore;

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
  await new Promise<void>((resolve, reject) => {
    this.androidDb.transaction(tx => {
      tx.executeSql(
        `INSERT INTO ${tableName} (userId,
            scope,
            bankName,
            consentId,
            vrpId,
            vrpPayload,
            status,
            last_updated_date,
            last_updated_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          userId,
          scope,
          bankName,
          consentId,
          vrpId,
          vrpPayload,
          status,
          last_updated_date || currentDate,
          last_updated_time || currentTime
        ],
        (_, results) => {
          if (results.rowsAffected > 0) {
            console.log('Data inserted successfully in Vrp Transactions table');
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


  //CA
  async initDatabaseAndroidCa(): Promise < void> {
  const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

  await new Promise<void>((resolve, reject) => {
    this.androidDb.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableName} (
            userId TEXT,
            scope TEXT,
            bankName TEXT,
            refreshToken TEXT,
            consentId TEXT,
            consentExpiry TEXT,
            consentPayload TEXT,
            status TEXT,
            customer_details TEXT,
            account_details TEXT,
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
  // insert data in CA
  async insertDatCA(caToStore: {
  userId: any;
  scope: string;
  bankName: string;
  refreshToken: string;
  consentId: string;
  consentExpiry: number;
  consentPayload: string;
  status: string;
  customer_details: string;
  account_details: string;
  last_updated_date?: string;
  last_updated_time?: string;
}): Promise < void> {
  const {
    userId,
    scope,
    bankName,
    refreshToken,
    consentId,
    consentExpiry,
    consentPayload,
    status,
    customer_details,
    account_details,
    last_updated_date,
    last_updated_time
  } = caToStore;

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
  await new Promise<void>((resolve, reject) => {
    this.androidDb.transaction(tx => {
      tx.executeSql(
        `INSERT INTO ${tableName} (userId,
            scope,
            bankName,
            refreshToken,
            consentId,
            consentExpiry,
            consentPayload,
            status,
            customer_details,
            account_details,
            last_updated_date,
            last_updated_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?);`,
        [
          userId,
          scope,
          bankName,
          refreshToken,
          consentId,
          consentExpiry,
          consentPayload,
          status,
          customer_details,
          account_details,
          last_updated_date || currentDate,
          last_updated_time || currentTime
        ],
        (_, results) => {
          if (results.rowsAffected > 0) {
            console.log('Data inserted successfully in CA table');
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


  //fetch data according to scope or consentId
  async fetchDataUsingScope(scope: string): Promise < any > {
  const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
  let whereClause = '';
  const queryParams: any[] = [];
  console.log(tableName);
  // if (consentId) {
  //   whereClause = 'WHERE consentId = ?';
  //   queryParams.push(consentId);
  // } else if (scope) {
  //   whereClause = 'WHERE scope = ?';
  //   queryParams.push(scope);
  // } else {
  //   return Promise.reject('Either consentId or scope must be provided.');
  // }

  return new Promise((resolve, reject) => {
    this.androidDb.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM ${tableName} where scope = ? ;`,
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
            // console.log(`No entry found for ${consentId ? 'consentId:' + consentId : 'scope:' + scope}`);
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
  
  async fetchDataUsingConsentId(consentId: string): Promise < any > {
  const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;

  return new Promise((resolve, reject) => {
    this.androidDb.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM ${tableName} where consentId = ?ORDER BY date DESC,time DESC ;`,
        [consentId],
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
            // console.log(`No entry found for ${consentId ? 'consentId:' + consentId : 'scope:' + scope}`);
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

  //COMMON
  // Method to delete all data entries from the database
  async deleteAllData(): Promise < void> {
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
  async deleteTable(): Promise < void> {
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

  async displayData(): Promise < any[] > {
  const tableName = `${this.scope}_${this.apiClient}_${this.companyName}`;
  return new Promise((resolve, reject) => {
    this.androidDb.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM ${tableName};`,
        [],
        (_, { rows }) => {
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
