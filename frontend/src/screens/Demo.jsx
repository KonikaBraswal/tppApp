
import { Button } from 'react-native-paper';
import AndroidClient from './../../DatabaseFactory/AndroidClientDb';

const Demo=()=>{
    let androidClientVrpTra=new AndroidClient("NWG", "Sandbox", "vrp_transactions");
    let androidClientVrp=new AndroidClient("NWG", "Sandbox", "vrp");
    let androidClientCa=new AndroidClient("NWG", "Sandbox", "customer_checkout");
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
        // caToStore.customerDetails='90';
        // caToStore.accountDetails='90';
        // console.log(caToStore);
        await androidClientCa.deleteTable();
        await androidClientVrpTra.deleteTable();
        await androidClientVrp.deleteTable();
    };
return(
    <>  
    <Button onPress={handle}>Press</Button>
    </>
);    
};

export default Demo;