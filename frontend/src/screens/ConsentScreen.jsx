import React, {useState} from 'react';
import {Title, Text, List, Checkbox, Icon, Button} from 'react-native-paper';
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import IconDialog from '../components/IconDialog';

const screenWidth = Dimensions.get('window').width;

const ConsentScreen = () => {
  const navigation = useNavigation();

  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);

  const handlePress1 = () => setExpanded1(!expanded1);
  const handlePress2 = () => setExpanded2(!expanded2);
  const handlePress3 = () => setExpanded3(!expanded3);

  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  const [checked5, setChecked5] = useState(false);
  const [checked6, setChecked6] = useState(false);
  const [checked7, setChecked7] = useState(false);

  const handleCheckbox1 = () => setChecked1(!checked1);
  const handleCheckbox2 = () => setChecked2(!checked2);
  const handleCheckbox3 = () => setChecked3(!checked3);
  const handleCheckbox4 = () => setChecked4(!checked4);
  const handleCheckbox5 = () => setChecked5(!checked5);
  const handleCheckbox6 = () => setChecked6(!checked6);
  const handleCheckbox7 = () => setChecked7(!checked7);

  const [isDialogVisible1, setDialogVisible1] = useState(false);

  const showDialog1 = () => setDialogVisible1(true);
  const hideDialog1 = () => setDialogVisible1(false);

  const [isDialogVisible2, setDialogVisible2] = useState(false);

  const showDialog2 = () => setDialogVisible2(true);
  const hideDialog2 = () => setDialogVisible2(false);

  const [isDialogVisible3, setDialogVisible3] = useState(false);

  const showDialog3 = () => setDialogVisible3(true);
  const hideDialog3 = () => setDialogVisible3(false);

  const [isDialogVisible4, setDialogVisible4] = useState(false);

  const showDialog4 = () => setDialogVisible4(true);
  const hideDialog4 = () => setDialogVisible4(false);

  const [isDialogVisible5, setDialogVisible5] = useState(false);

  const showDialog5 = () => setDialogVisible5(true);
  const hideDialog5 = () => setDialogVisible5(false);

  const [isDialogVisible6, setDialogVisible6] = useState(false);

  const showDialog6 = () => setDialogVisible6(true);
  const hideDialog6 = () => setDialogVisible6(false);

  const [isDialogVisible7, setDialogVisible7] = useState(false);

  const showDialog7 = () => setDialogVisible7(true);
  const hideDialog7 = () => setDialogVisible7(false);

  const [isErrorDialogVisible, setErrorDialogVisible] = useState(false);
  const showErrorDialog = () => setErrorDialogVisible(true);
  const hideErrorDialog = () => setErrorDialogVisible(false);

  const areAllCheckboxesChecked = () => {
    return (
      checked1 &&
      checked2 &&
      checked3 &&
      checked4 &&
      checked5 &&
      checked6 &&
      checked7
    );
  };
  const handleConfirmButtonClick = () => {
    navigation.navigate('Accounts');
  };
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <Title style={styles.headerText}>We Need Your Consent</Title>
        <Text style={styles.textStyle}>
          NWBank needs your explicit consent to access the following information
          from the accounts held at your bank or building society
        </Text>

        <List.Section>
          <List.Accordion
            title="Your Account Details"
            titleStyle={styles.titleStyle}
            left={props => (
              <List.Icon {...props} icon="account-cash" color="#36013f" />
            )}
            expanded={expanded1}
            onPress={handlePress1}
            style={styles.accordionStyle}>
            <List.Item
              left={props => (
                <Checkbox.Android
                  status={checked1 ? 'checked' : 'unchecked'}
                  onPress={handleCheckbox1}
                />
              )}
              title="Your Account Details"
              style={styles.accordionListStyle}
              right={props => (
                <View style={{marginTop: 10}}>
                  <TouchableOpacity onPress={showDialog1}>
                    <Icon source="information" color={'#448ee4'} size={23} />
                  </TouchableOpacity>
                  {isDialogVisible1 && (
                    <IconDialog
                      visible={isDialogVisible1}
                      hideDialog={hideDialog1}
                      title={'Your Account Details'}
                      text={
                        'We need your consent to access your account information.'
                      }
                    />
                  )}
                </View>
              )}
            />
            <List.Item
              left={props => (
                <Checkbox.Android
                  status={checked2 ? 'checked' : 'unchecked'}
                  onPress={handleCheckbox2}
                />
              )}
              title="Your Balance Details"
              style={styles.accordionListStyle}
              right={props => (
                <View style={{marginTop: 8}}>
                  <TouchableOpacity onPress={showDialog2}>
                    <Icon source="information" color={'#448ee4'} size={23} />
                  </TouchableOpacity>
                  {isDialogVisible2 && (
                    <IconDialog
                      visible={isDialogVisible2}
                      hideDialog={hideDialog2}
                      title={'Your Balance Details'}
                      text={
                        'We need your consent to access your balance information.'
                      }
                    />
                  )}
                </View>
              )}
            />
          </List.Accordion>
          <List.Accordion
            title="Your Transaction Details"
            titleStyle={styles.titleStyle}
            left={props => (
              <List.Icon {...props} icon="bank-transfer" color="#36013f" />
            )}
            expanded={expanded2}
            onPress={handlePress2}
            style={styles.accordionStyle}>
            <List.Item
              left={props => (
                <Checkbox.Android
                  status={checked3 ? 'checked' : 'unchecked'}
                  onPress={handleCheckbox3}
                />
              )}
              title="Your Transaction Debits"
              style={styles.accordionListStyle}
              right={props => (
                <View style={{marginTop: 8}}>
                  <TouchableOpacity onPress={showDialog3}>
                    <Icon source="information" color={'#448ee4'} size={23} />
                  </TouchableOpacity>
                  {isDialogVisible3 && (
                    <IconDialog
                      visible={isDialogVisible3}
                      hideDialog={hideDialog3}
                      title={'Your Transaction Debits'}
                      text={
                        'We need your consent to access your transaction debit information.'
                      }
                    />
                  )}
                </View>
              )}
            />
            <List.Item
              left={props => (
                <Checkbox.Android
                  status={checked4 ? 'checked' : 'unchecked'}
                  onPress={handleCheckbox4}
                />
              )}
              title="Your Transaction Credits"
              style={styles.accordionListStyle}
              right={props => (
                <View style={{marginTop: 8}}>
                  <TouchableOpacity onPress={showDialog4}>
                    <Icon source="information" color={'#448ee4'} size={23} />
                  </TouchableOpacity>
                  {isDialogVisible4 && (
                    <IconDialog
                      visible={isDialogVisible4}
                      hideDialog={hideDialog4}
                      title={'Your Transaction Credits'}
                      text={
                        'We need your consent to access your transaction credit information..'
                      }
                    />
                  )}
                </View>
              )}
            />
            <List.Item
              left={props => (
                <Checkbox.Android
                  status={checked5 ? 'checked' : 'unchecked'}
                  onPress={handleCheckbox5}
                />
              )}
              title="Your Transaction Details"
              style={styles.accordionListStyle}
              right={props => (
                <View style={{marginTop: 8}}>
                  <TouchableOpacity onPress={showDialog5}>
                    <Icon source="information" color={'#448ee4'} size={23} />
                  </TouchableOpacity>
                  {isDialogVisible5 && (
                    <IconDialog
                      visible={isDialogVisible5}
                      hideDialog={hideDialog5}
                      title={'Your Transaction Details'}
                      text={
                        'We need your consent to access your transaction information.'
                      }
                    />
                  )}
                </View>
              )}
            />
          </List.Accordion>
          <List.Accordion
            title="Reason For Access"
            titleStyle={styles.titleStyle}
            left={props => (
              <List.Icon {...props} icon="progress-question" color="#36013f" />
            )}
            expanded={expanded3}
            onPress={handlePress3}
            style={styles.accordionStyle}>
            <List.Item
              left={props => (
                <Checkbox.Android
                  status={checked6 ? 'checked' : 'unchecked'}
                  onPress={handleCheckbox6}
                />
              )}
              title="I Am a Tpp So I Need Access"
              style={styles.accordionListStyle}
              right={props => (
                <View style={{marginTop: 8}}>
                  <TouchableOpacity onPress={showDialog6}>
                    <Icon source="information" color={'#448ee4'} size={23} />
                  </TouchableOpacity>
                  {isDialogVisible6 && (
                    <IconDialog
                      visible={isDialogVisible6}
                      hideDialog={hideDialog6}
                      title={'Reason For Access'}
                      text={'You are the Third Party Provider.'}
                    />
                  )}
                </View>
              )}
            />
            <List.Item
              left={props => (
                <Checkbox.Android
                  status={checked7 ? 'checked' : 'unchecked'}
                  onPress={handleCheckbox7}
                />
              )}
              title="I Am The Owner Of the Account"
              style={styles.accordionListStyle}
              right={props => (
                <View style={{marginTop: 8}}>
                  <TouchableOpacity onPress={showDialog7}>
                    <Icon source="information" color={'#448ee4'} size={23} />
                  </TouchableOpacity>
                  {isDialogVisible7 && (
                    <IconDialog
                      visible={isDialogVisible7}
                      hideDialog={hideDialog7}
                      title={'Reason For Access'}
                      text={'You are the owner of the account.'}
                    />
                  )}
                </View>
              )}
            />
          </List.Accordion>
        </List.Section>
        <View style={{flexDirection: 'row', marginVertical: 10}}>
          <Button
            icon="close"
            mode="contained"
            style={{marginRight: 10}}
            onPress={() => navigation.goBack()}>
            Deny
          </Button>

          <Button
            icon="check-bold"
            mode="contained"
            onPress={() => {
              if (areAllCheckboxesChecked()) {
                handleConfirmButtonClick();
              } else {
                showErrorDialog();
              }
            }}
            style={{marginLeft: 10}}>
            Confirm
          </Button>
          {isErrorDialogVisible && (
            <IconDialog
              visible={isErrorDialogVisible}
              hideDialog={hideErrorDialog}
              title={'Please check all checkboxes before confirming.'}
              text={''}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#36013f',
    margin: 20,
  },
  textStyle: {
    textAlign: 'center',
    padding: 10,
    fontSize: 17,
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  accordionStyle: {
    width: screenWidth - 40,
    margin: 20,
    borderRadius: 10,
    backgroundColor: '#D6B4FC',
    elevation: 3,
  },
  accordionListStyle: {
    width: screenWidth - 40,
    marginLeft: 20,
  },
});

export default ConsentScreen;
