import AsyncStorage from '@react-native-async-storage/async-storage';

class WebClient {
  private companyName: string;
  private apiClient: string;
  private scope: string;

  constructor(companyName: string, apiClient: string, scope: string) {
    this.companyName = companyName;
    this.apiClient = apiClient;
    this.scope = scope;
  }

  //PISP
  // Method to initialize the data storage for Web PISP
  async initDatabaseWebPisp(): Promise<void> {
    const dataName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    const data: any[] = [];
    await new Promise<void>((resolve, reject) => {
      AsyncStorage.getItem(dataName)
        .then(existingValue => {
          if (existingValue === null) {
            AsyncStorage.setItem(dataName, JSON.stringify(data))
              .then(() => {
                console.log('pispData object created successfully');
                resolve();
              })
              .catch(error => {
                console.log('Error creating pispData object');
                reject(error);
              });
          } else {
            console.log('pispData already exists');
            resolve();
          }
        })
        .catch(error => {
          console.log('Error retrieving existing pispdata:', error);
          reject(error);
        });
    });
  }

  // Method to insert data into the web PISP
  async insertDataPisp(pispToStore: {
    consentId: any;
    scope: any;
    payload: any;
    refreshtoken: any;
    paymentId: any;
    response: any;
    userId: any;
  }): Promise<void> {
    const dataName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    await new Promise<void>((resolve, reject) => {
      let retrievedData: any[] = [];
      AsyncStorage.getItem(dataName)
        .then(existingValue => {
          if (existingValue !== null) {
            console.log('pispData exists, updating value...');
            retrievedData = JSON.parse(existingValue);
            retrievedData.push(pispToStore);
            AsyncStorage.setItem(dataName, JSON.stringify(retrievedData))
              .then(() => {
                console.log('pispData updated successfully');
                resolve();
              })
              .catch(error => {
                console.error('Error updating pispData value:', error);
                reject(error);
              });
          } else {
            retrievedData.push(pispToStore);
            AsyncStorage.setItem(dataName, JSON.stringify(retrievedData))
              .then(() => {
                console.log('pispData added successfully');
                resolve();
              })
              .catch(error => {
                console.error('Error adding pispData value:', error);
                reject(error);
              });
          }
        })
        .catch(error => {
          console.error('Error checking key:', error);
          reject(error);
        });
    });
  }

  // Method to update data based on consentId PISP
  async updateDataByConsentIdPisp(
    consentId: string,
    newData: {[key: string]: any},
  ): Promise<void> {
    const dataName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    let retrievedData: any[] = [];
    await new Promise<void>((resolve, reject) => {
      AsyncStorage.getItem(dataName)
        .then(existingValue => {
          if (existingValue !== null) {
            retrievedData = JSON.parse(existingValue);
            const index = retrievedData.findIndex(
              object => object.consentId === consentId,
            );
            if (index != -1) {
              retrievedData.splice(index, 1);
              newData.consentId = consentId;
              retrievedData.push(newData);
              AsyncStorage.setItem(dataName, JSON.stringify(retrievedData))
                .then(() => {
                  console.log('pispData updated successfully');
                  resolve();
                })
                .catch(error => {
                  console.error('Error updating pispData value:', error);
                  reject(error);
                });
            }
          } else {
            console.log('No object with given consentId');
          }
        })
        .catch(error => {
          console.error('Error checking key:', error);
          reject(error);
        });
    });
  }

  //AISP
  // Method to initialize the  data storage for Web AISP
  async initDatabaseWebAisp() {
    const dataName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    const data: any[] = [];
    await new Promise<void>((resolve, reject) => {
      AsyncStorage.getItem(dataName)
        .then(existingValue => {
          if (existingValue === null) {
            AsyncStorage.setItem(dataName, JSON.stringify(data))
              .then(() => {
                console.log('aispData object created successfully');
                resolve();
              })
              .catch(error => {
                console.log('Error creating aispData object');
                reject(error);
              });
          } else {
            console.log('aispData already exists');
            resolve();
          }
        })
        .catch(error => {
          console.log('Error retrieving existing aispdata:', error);
          reject(error);
        });
    });
  }

  // Method to insert data into the web AISP
  async insertDataAisp(aispToStore: {
    userId: any;
    scope: string;
    bankName: string;
    consentId: string;
    consentPayload: string;
    refreshToken: string;
    accountsList: string;
  }): Promise<void> {
    const dataName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    await new Promise<void>((resolve, reject) => {
      let retrievedData: any[] = [];
      AsyncStorage.getItem(dataName)
        .then(existingValue => {
          if (existingValue !== null) {
            console.log('aispData exists, updating value...');
            retrievedData = JSON.parse(existingValue);
            retrievedData.push(aispToStore);
            AsyncStorage.setItem(dataName, JSON.stringify(retrievedData))
              .then(() => {
                console.log('aispData updated successfully');
                resolve();
              })
              .catch(error => {
                console.error('Error updating aispData value:', error);
                reject(error);
              });
          } else {
            retrievedData.push(aispToStore);
            AsyncStorage.setItem(dataName, JSON.stringify(retrievedData))
              .then(() => {
                console.log('aispData added successfully');
                resolve();
              })
              .catch(error => {
                console.error('Error adding aispData value:', error);
                reject(error);
              });
          }
        })
        .catch(error => {
          console.error('Error checking key:', error);
          reject(error);
        });
    });
  }

  //VRP
  async initDatabaseWebVrp() {
    const dataName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    const data: any[] = [];
    await new Promise<void>((resolve, reject) => {
      AsyncStorage.getItem(dataName)
        .then(existingValue => {
          if (existingValue === null) {
            AsyncStorage.setItem(dataName, JSON.stringify(data))
              .then(() => {
                console.log('vrpData object created successfully');
                resolve();
              })
              .catch(error => {
                console.log('Error creating vrpData object');
                reject(error);
              });
          } else {
            console.log('vrpData already exists');
            resolve();
          }
        })
        .catch(error => {
          console.log('Error retrieving existing vrpData:', error);
          reject(error);
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
    const dataName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    await new Promise<void>((resolve, reject) => {
      let retrievedData: any[] = [];
      AsyncStorage.getItem(dataName)
        .then(existingValue => {
          if (existingValue !== null) {
            console.log('vrpData exists, updating value...');
            retrievedData = JSON.parse(existingValue);
            retrievedData.push(vrpToStore);
            AsyncStorage.setItem(dataName, JSON.stringify(retrievedData))
              .then(() => {
                console.log('vrpData updated successfully');
                resolve();
              })
              .catch(error => {
                console.error('Error updating vrpData value:', error);
                reject(error);
              });
          } else {
            retrievedData.push(vrpToStore);
            AsyncStorage.setItem(dataName, JSON.stringify(retrievedData))
              .then(() => {
                console.log('vrpData added successfully');
                resolve();
              })
              .catch(error => {
                console.error('Error adding vrpData value:', error);
                reject(error);
              });
          }
        })
        .catch(error => {
          console.error('Error checking key:', error);
          reject(error);
        });
    });
  }

  //COMMON
  // Method to delete all data entries from the data storage
  async deleteAllData(): Promise<void> {
    const dataName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    await new Promise<void>((resolve, reject) => {
      try {
        AsyncStorage.removeItem(dataName)
          .then(() => {
            console.log(`Data with key ${dataName} deleted successfully`);
            resolve();
          })
          .catch(error => {
            console.error(`Error deleting data with key ${dataName}:`, error);
            reject(error);
          });
      } catch (error) {
        console.error(`Error deleting data with key ${dataName}:`, error);
        reject(error);
      }
    });
  }

  // Method to display data from the data storage
  async displayData(): Promise<void> {
    const dataName = `${this.scope}_${this.apiClient}_${this.companyName}`;

    await new Promise<void>((resolve, reject) => {
      try {
        AsyncStorage.getItem(dataName)
          .then(data => {
            if (data !== null) {
              const parsedData = JSON.parse(data);
              parsedData.map((item: any) => console.log(item));
              resolve();
            } else {
              console.log('No data available');
              resolve();
            }
          })
          .catch(error => {
            console.error('Error displaying data:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Error displaying data:', error);
        reject(error);
      }
    });
  }
class WebClient{
    async initinitDatabaseAndroidAisp(){
    
    }
}
export default WebClient;
