import AndroidClient from './AndroidClientDb';
import WebClient from './WebClient';
import ApiLogsDb from './ApiLogsDb';
//import AndroidClient from './AndroidClient';
//import WebClient from './WebClient';
import DatabaseConfig from '../ApiFactory/ConfigFiles/DatabaseConfig.json';

class DatabaseFactory {
  private company: string;
  private apiClient: string;

  constructor() {
    this.company = DatabaseConfig.companyName;
    this.apiClient = DatabaseConfig.apiClient;
  }

  createDatabaseClient(platform: string, scope: string) {
    let databaseClient;

    switch (platform) {
      case 'android':
        databaseClient = this.createAndroidClient(scope);
        break;
      case 'web':
        databaseClient = this.createWebClient();
        break;
      case 'logs':
        databaseClient = this.createLogClients(scope);
        break;
      default:
        throw new Error(`Invalid client type: ${platform}`);
    }

    return databaseClient;
  }

  private createAndroidClient(scope: string) {
    return new AndroidClient(this.company, this.apiClient, scope);
  }

  private createWebClient() {
    //return new WebClient();
  }

  private createLogClients(scope: string) {
    return new ApiLogsDb(this.company, this.apiClient, scope);
  }
}

export default DatabaseFactory;

// import AndroidClient from "./AndroidClient";
// import WebClient from "./WebClient";
// import DatabaseConfig from '../ConfigFiles/DatabaseConfig.json';
// import ApiLogsDb from "./ApiLogsDb";

// class DatabaseFactory {
//     private company: string;
//     private apiClient: string;

//     constructor() {
//         this.company = DatabaseConfig.companyName;
//         this.apiClient = DatabaseConfig.apiClient;
//     }

//     createDatabaseClient(platform: string, scope: string) {
//         let databaseClient;

//         switch (platform) {
//             case 'android':
//                 // Pass props to AndroidClient constructor if needed
//                 databaseClient = new AndroidClient(
//                     this.company,
//                     this.apiClient,
//                     scope
//                 );
//                 break;
//             case 'web':
//                 databaseClient = new WebClient();
//                 break;
//             case 'logs':
//                 // Pass props to ApiLogsDb constructor if needed
//                 databaseClient = new ApiLogsDb(
//                     this.company,
//                     this.apiClient,
//                     scope
//                 );
//                 break;
//             default:
//                 throw new Error(`Invalid client type: ${platform}`);
//         }

//         return databaseClient;
//     }
// }

// export default DatabaseFactory;

// // import AndroidClient from "./AndroidClient";
// // import WebClient from "./WebClient";
// // import DatabaseConfig from '../ConfigFiles/DatabaseConfig.json';
// // import ApiLogsDb from "./ApiLogsDb";
// // class DatabaseFactory {
// //     private company:string;
// //     private apiClient:string;
// //     //private scope:string;

// //   constructor() {
// //     this.company=DatabaseConfig.companyName;
// //     this.apiClient=DatabaseConfig.apiClient;
// //    // this.scope=DatabaseConfig.scope;

// //   }

// //   createDatabaseClient(platform: string,scope:string) {
// //     switch (platform) {
// //       case 'android':
// //         return new AndroidClient(
// //             this.company,
// //             this.apiClient,
// //             scope,

// //         );
// //       case 'web':
// //         return new AndroidClient(//WEB CLIENT
// //           this.company,
// //           this.apiClient,
// //           scope

// //       );
// //       case 'logs':
// //         return new AndroidClient(
// //           this.company,
// //           this.apiClient,
// //           scope

// //       );
// //       default:
// //         throw new Error(`Invalid client type: ${platform}`);
// //     }
// //   }
// // }

// // export default DatabaseFactory;
