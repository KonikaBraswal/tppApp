
import AndroidClient from "./AndroidClient";
import WebClient from "./WebClient";
import DatabaseConfig from '../ConfigFiles/DatabaseConfig.json';
import ApiLogs from "./ApiLogs";
class DatabaseFactory {
    private company:string;
    private apiClient:string;
    //private scope:string;


  constructor() {
    this.company=DatabaseConfig.companyName;
    this.apiClient=DatabaseConfig.apiClient;
   // this.scope=DatabaseConfig.scope;

  }

  createDatabaseClient(platform: string,scope:string) {
    switch (platform) {
      case 'android':
        return new AndroidClient(
            this.company,
            this.apiClient,
            scope,
          
        );
      case 'web':
        return new AndroidClient(
          this.company,
          this.apiClient,
          scope
        
      );
      case 'logs':
        return new AndroidClient(
          this.company,
          this.apiClient,
          scope
        
      );
      default:
        throw new Error(`Invalid client type: ${platform}`);
    }
  }
}

export default DatabaseFactory;
