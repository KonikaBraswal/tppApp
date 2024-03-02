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
            <View style={{ marginTop: 10 }}>
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
            <View style={{ marginTop: 8 }}>
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
            <View style={{ marginTop: 8 }}>
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
            <View style={{ marginTop: 8 }}>
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
            <View style={{ marginTop: 8 }}>
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
            <View style={{ marginTop: 8 }}>
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
            <View style={{ marginTop: 8 }}>
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
                {/* {allPayments && (
                    <View>
                        <Text>Data: {JSON.stringify(allPayments)}</Text>
                    </View>
                )} */}
            </View>
        )}
    />
</List.Accordion>
</List.Section>