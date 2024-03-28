import AsyncStorage from '@react-native-async-storage/async-storage';

interface AispData {
  name: string;
  data: any[];
}
interface PispData {
  name: string;
  data: any[];
}
interface VrpData {
  name: string;
  data: any[];
}
class WebClient {
  private companyName: string;
  private apiClient: string;
  private scope: string;
  private aispData: AispData;
  private pispData: PispData;
  private vrpData: VrpData;

  constructor(companyName: string, apiClient: string, scope: string) {
    this.companyName = companyName;
    this.apiClient = apiClient;
    this.scope = scope;
    this.aispData = {name: '', data: []};
    this.pispData = {name: '', data: []};
    this.vrpData = {name: '', data: []};
  }

  //PISP
  // Method to initialize the data storage for Web PISP
  async initDatabaseWebPisp() {
    const dataName = `${this.scope}_${this.apiClient}_${this.companyName}`;
    this.pispData.name = dataName;
    AsyncStorage.getItem(dataName)
      .then(existingValue => {
        if (existingValue === null) {
          AsyncStorage.setItem(
            this.pispData.name,
            JSON.stringify(this.pispData.data),
          )
            .then(() => {
              console.log('pispData object created successfully');
            })
            .catch(error => {
              console.log('Error creating pispData object:');
            });
        }
      })
      .catch(error => {
        console.log('pispData already exists');
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
}
export default WebClient;
