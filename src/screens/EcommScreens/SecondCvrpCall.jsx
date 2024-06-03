import { StyleSheet, View } from "react-native";
import { Card, Divider, IconButton, Text } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

const SecondCvrpCall = () => {
    const navigation = useNavigation();
    return (
        <>
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
                            size={wp('7%')}z
                            style={{ marginTop: hp('1.5%'), marginLeft: wp('3.5%') }}
                            onPress={() => navigation.navigate('Order Placed')}
                        />
                    </Card.Actions>
                </View>
                <Card.Content>
                    <Text>Identification</Text>
                </Card.Content>
            </Card>
            <Card>
            <Card.Title>
                    <Text style={styles.title}>Account</Text>
                </Card.Title>
                <Divider style={styles.divider} />
            </Card>
            <Card>
                <Card.Title>
                    <Text style={styles.title}>Payment</Text>
                </Card.Title>
                <Divider style={styles.divider} />
                <Card.Content>
                    <Text>Amount</Text>
                    <Text>£</Text>
                </Card.Content>
            </Card>
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
});

export default SecondCvrpCall;