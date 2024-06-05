import MockApiFactory from './MockApiFactory';
import NWBSandboxApiFactory from './SandboxApiFactory';
import HSBCSandboxApiFactory from './HSBCSandboxApiFactory';
import OtherBanks from './OtherBanks';
class ApiFactory {
  createApiClient(type: string, scope: any, bankName: any) {
    console.log("Creating API Client for", bankName, "with", scope, "scope");
    
    switch (type) {
      case 'sandbox':
        switch (bankName) {
          case 'Natwest':
            console.log("Using NWB Sandbox API Factory");
            return new NWBSandboxApiFactory(scope);
          case 'HSBC':
            console.log("Using HSBC Sandbox API Factory");
            return new HSBCSandboxApiFactory(scope);
          default:
            console.log("Other Bank for sandbox type:", bankName);
            return new OtherBanks(scope);
            //throw new Error(`Unknown bank for sandbox type: ${bankName}`);
        }
        
      case 'local':
        console.log("Using Mock API Factory for local");
        return new MockApiFactory(scope);
        
      case 'sit':
        console.log("Using Mock API Factory for SIT");
        return new MockApiFactory(scope);
        
      default:
        console.log("Invalid Type:", type);
        throw new Error(`Invalid API client type: ${type}`);
    }
  }
}

export default ApiFactory;


// // ApiFactory.ts
// import MockApiFactory from './MockApiFactory';
// import SanboxApiFactory from './SandboxApiFactory';
// class ApiFactory {
//   createApiClient(type: string, scope:any) {
//     switch (type) {
//       case 'sandbox':
//         console.log(type);
//         return new SanboxApiFactory(scope);
//       // Add other cases if needed
//       case 'local':
//         console.log(type,"API Factory");
//         return new MockApiFactory(scope
//         );
//       case 'sit':
//         return new MockApiFactory('accounts'
//         );
//       default:
//         console.log("Invalid Type ",type);
//         throw new Error(`Invalid API client type: ${type}`);
//     }
//   }
// }

// export default ApiFactory;
