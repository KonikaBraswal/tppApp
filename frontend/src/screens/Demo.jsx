
import { Button } from 'react-native-paper';
import AndroidClient from './../../DatabaseFactory/AndroidClientDb';

const Demo=()=>{
    // let androidClient=new AndroidClient("NWG", "Sandbox", "accounts");
    // let androidClient=new AndroidClient("NWG", "Sandbox", "vrp_transactions");
    // let androidClient=new AndroidClient("NWG", "Sandbox", "customer_checkout");
    // let androidClient=new AndroidClient("NWG", "Sandbox", "vrp");
    // let androidClient=new AndroidClient("NWG", "Sandbox", "payments");
    let androidClient=new AndroidClient("RBS", "Sandbox", "accounts");
    // let androidClient=new AndroidClient("UBN", "Sandbox", "accounts");
    // let androidClient=new AndroidClient("HSBC", "Sandbox", "accounts");
    let caToStore={
        userId: '9999999',
        consentId:'',
        scope:'vrp_transactions',
        // customerDetails:'',
        // accountDetails:'',
      };
    const handle=async ()=>{
        const details = {
            refreshToken: 'RefreshToken',
          };
          const columnsToUpdate=['refreshToken'];
          
          const id='90';
        //   await androidClientVrp.updateDataByConsentId(id, details,columnsToUpdate);
          
        caToStore.consentId='90';
        await androidClient.deleteTable();
        
    };
return(
    <>  
    <Button onPress={handle}>Press</Button>
    </>
);    
};

export default Demo;