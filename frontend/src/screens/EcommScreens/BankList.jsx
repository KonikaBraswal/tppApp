import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconDialog from '../../components/IconDialog';
import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';

const mode = 'sandbox';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

const BankList = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [allPayments, setAllPayments] = useState('');
    const [error, setError] = useState(null);
    const [isErrorDialogVisible, setErrorDialogVisible] = useState(false);
    const showErrorDialog = () => setErrorDialogVisible(true);
    const hideErrorDialog = () => setErrorDialogVisible(false);
    const [isInputDialogVisible, setInputDialogVisible] = useState(false);
    const showInputDialog = () => setInputDialogVisible(true);
    const hideInputDialog = () => setInputDialogVisible(false);

    const [inputValue, setInputValue] = useState('');
    const [consentData, setConsentData] = useState([]);

    const allbanks = [
        { id: 101, name: 'Allied Irish Bank(NI)', icon: require('../../assets/images/ecomm-images/allied irish bank.jpeg') },
        { id: 102, name: 'Lloyds', icon: require('../assets/images/lloyds.png') },
        { id: 103, name: 'Bank Of Scotland', icon: require('../../assets/images/ecomm-images/bank-of-scotland.png') },
        { id: 104, name: 'Natwest', icon: require('../assets/images/natwest.png') },
        { id: 105, name: 'Coutts', icon: require('../../assets/images/ecomm-images/coutts.png') },
        { id: 106, name: 'First Direct', icon: require('../../assets/images/ecomm-images/first direct bank.png') },
        { id: 107, name: 'Danske Bank', icon: require('../../assets/images/ecomm-images/danske bank.png') },
        { id: 108, name: 'Barclays', icon: require('../assets/images/barclays.png') }
    ];
    const jsondata =
    {
        "Data": {
            "ReadRefundAccount": "No",
            "ControlParameters": {
                "InitialPayment": {
                    "Amount": CartItem.amount,
                    "Currency": "GBP"
                },
                "VRPType": [
                    "UK.OBIE.VRPType.Other"
                ],

                "VRPSubType": [
                    "UK.NWG.VRPSubType.Ongoing"
                ],
                "PSUAuthenticationMethods": [
                    "UK.OBIE.SCANotRequired"
                ],
            },

            "Initiation": {
                "CreditorAccount": {
                    "SchemeName": "SortCodeAccountNumber",
                    "Identification": "50499910000996",
                    "Name": "Natwest Cart",
                    "SecondaryIdentification": "secondary-identif"
                },
                "RemittanceInformation": {
                    "Unstructured": "Tools",
                    "Reference": "Tools"
                }
            }
        },
        "Risk": {}
    };
    const handleConfirmButtonClick = async () => {
        if (mode == 'sandbox') {
            try {
                const permissions = jsondata;
                setLoading(true);
                setError(null);
                const accessTokenParams = {
                    scope: 'payments',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: permissions,
                    consentUrl: sandboxConfig.paymentRequestEndPoint
                };
                const consentdata = await sandboxApiClient.retrieveAccessToken(
                    { accessTokenParams },
                ); //here is data
                setConsentData(consentdata);

            } catch (error) {
                console.error('Error:', error);
                setError('Failed to retrieve access token.');
            } finally {
                setLoading(false);
            }
        } else {
            navigation.navigate('Consent');
        }
    };
    const handleSubmit = async () => {
        try {

            const response = await sandboxApiClient.exchangeAccessToken(inputValue, consentData);
            const customerDetails = await getDetailsCA();
            navigation.navigate('Customer Details', {
                customerDetails
            });
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to retrieve access token.');
        } finally {
            setLoading(false);
        }
        setInputValue('');
        hideInputDialog();
    };
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid
            enableAutomaticScroll
            extraScrollHeight={Platform.OS === 'ios' ? 30 : 0}>
            <View
                style={{
                    backgroundColor: '#fff',
                    padding: 10,
                }}>
                <Searchbar
                    placeholder="Search any banks"
                    // onChangeText={onChangeSearch}
                    value={searchQuery}
                    icon={() => <Icon source="magnify" color="black" size={20} />}
                    style={{
                        borderRadius: 5,
                        backgroundColor: '#f4ebfe',
                    }}
                />
            </View>
            <Stack fill left style={{ backgroundColor: 'white', padding: 10 }}>
                <Surface elevation={10} category="medium">
                    <Text
                        style={{
                            fontSize: RFValue(18),
                            padding: 15,
                            color: 'black',
                            fontWeight: 'bold',
                            padding: 20,
                        }}>
                        All Banks
                    </Text>
                    {allbanks.map(bank => (
                        <TouchableOpacity key={bank.id} onPress={handleConfirmButtonClick}>
                            <ListItem
                                key={`row_${bank.id}`}
                                title={bank.name}
                                leading={
                                    <Image
                                        source={bank.icon}
                                        style={{ height: 30, width: 30, resizeMode: 'contain' }}
                                    />
                                }
                                trailing={<Icon source="chevron-right" size={24} />}
                            />
                        </TouchableOpacity>
                    ))}
                </Surface>
            </Stack>
            <View>
                <Portal>
                    <Dialog visible={isInputDialogVisible} onDismiss={hideInputDialog}>
                        <Dialog.Title>Redirect Input</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label="Paste URL from the browser"
                                value={inputValue}
                                onChangeText={text => setInputValue(text)}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideInputDialog}>Cancel</Button>
                            <Button onPress={handleSubmit}>Submit</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>

        </KeyboardAwareScrollView>
    );


};
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingTop: 10,
        // paddingBottom: 20,
        borderRadius: 8, // Border radius to make it rounded
        borderWidth: 1, // Border width
        borderColor: '#ccc',
        flexGrow: 1,
        marginBottom: 10,
        // justifyContent: 'space-between',
        // flexWrap:'wrap',
        // width:'90%'
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 60,
        overflow: 'hidden',
        // height:200
    },
    item: {
        // flexDirection: 'row',
        // justifyContent: 'space-around',
        // width: '63%',
        // margin:3,
        flex: 1,
        margin: 8,
        // alignItems: 'center',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#ddd',
        padding: 8,
        backgroundColor: '#fff',
    },
    modalContainer: {
        position: 'absolute',
        right: 20,
        left: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 20,
        elevation: 4,
    },
    image: {
        width: '100%',
        height: 200,
        // aspectRatio:1,
        // marginTop: -hp('60%'),
        resizeMode: 'cover',
        borderRadius: 8,
        marginBottom: 8,
        // marginLeft: hp('7%'),
        // marginRight: -hp('6%')
    },
    name: {
        // alignItems: 'center',
        // width: '100%',
        fontSize: 16,
        fontWeight: 'bold',
        // marginBottom: -wp('60%'),
        marginBottom: wp('5%'),
        // padding: 8,
        // marginTop: -wp('20%'),
        // marginLeft: hp('1%'),
        // marginRight: wp('5%'),
        // overflow: 'hidden',
    },
    description: {
        fontSize: 14,
        marginBottom: 4,
    },
    price: {
        // overflow: 'hidden',
        // alignItems: 'center',
        // padding: hp('3%'),
        fontSize: 16,
        fontWeight: 'bold',
        // width: '100%',
        color: 'green',
        // marginTop: hp('55%'),
        // marginBottom: -wp('50%'),
        // marginRight: wp('10%')
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    searchbar: {
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0%'),
        borderWidth: hp('1%'),
        borderRadius: wp('5%'),
        backgroundColor: 'white',
    },
    input: {
        fontSize: wp('5%'),
        backgroundColor: 'white',
        height: 40, // Set the height of the search bar
        fontSize: 16, // Font size of the text input
        paddingHorizontal: 8,
    },
    toggle: {
        padding: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-around'
    },
});
const SelectBankStyle = StyleSheet.create({
    row: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    text: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        padding: 10,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    surface: {
        backgroundColor: 'white',
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: 'white',
        margin: 10,
    },

    image: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        // flexWrap:"wrap"
    },
});

export default BankList;