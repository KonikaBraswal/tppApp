import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Divider, IconButton, Text } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

const SecondCvrpCall = ({ route }) => {
    const { totalAmount, data } = route.params;
    const navigation = useNavigation();
    const debitorDetails = JSON.parse(data.account_details);
    const payload = JSON.parse(data.consentpayload);
    const handleSubmit=()=>{
        
    }
    return (
        <>
        <ScrollView>
            <Card style={styles.card}>
                <View style={styles.cardTitleContainer}>
                    <Card.Title>
                        <Text style={styles.title}>Current Account</Text>
                    </Card.Title>
                    <Card.Actions>
                        <IconButton
                            icon="chevron-right"
                            mode="outlined"
                            iconColor={'black'}
                            size={wp('7%')}
                            style={{ marginTop: hp('1.5%'), marginLeft: wp('3.5%') }}
                            onPress={() => navigation.navigate('Order Placed')}
                        />
                    </Card.Actions>
                </View>
                <Card.Content>
                    <Text>Identification</Text>
                    <Text>{debitorDetails.DebtorAccount.Identification}</Text>
                </Card.Content>
            </Card>
            <Card>
                <Card.Title>
                    <Text style={styles.title}>Account</Text>
                </Card.Title>
                <Divider style={styles.divider} />
                <Text>To</Text>
                <Text>{payload.Initiation.CreditorAccount.Name}</Text>
                <Divider style={styles.divider} />
                <Text>From</Text>
                <Text>{data.customer_details.data.name.full_name}</Text>


            </Card>
            <Card>
                <Card.Title>
                    <Text style={styles.title}>Payment</Text>
                </Card.Title>
                <Divider style={styles.divider} />
                <Card.Content>
                    <Text>Amount</Text>
                    <Text>£{totalAmount}</Text>
                </Card.Content>
            </Card>


        </ScrollView>
        <TouchableOpacity
        onPress={(nhu)}
        style={styles.footer}
        activeOpacity={1}>
        <Text style={styles.footerText}>Cancel</Text>
      </TouchableOpacity>
        <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.footer}
        activeOpacity={1}>
        <Text style={styles.footerText}>Confirm</Text>
      </TouchableOpacity>
        </>

    );

};

const styles = StyleSheet.create({
    card: {
        alignContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chevron: {
        marginRight: 10,
    },
    divider: {
        marginVertical: 10,
    },
    footer: {
        backgroundColor: 'rgba(176, 130, 255, 0.5)',
        padding: wp('4%'),
        alignItems: 'center',
        width: '100%',
      },
      footerText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: wp('5%'),
      },
});

export default SecondCvrpCall;