import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Dialog, Portal, Text, IconButton} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';

const IconDialog = ({visible, hideDialog, title, text}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Icon icon="bank" size={40} color={'#36013f'} />
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        <IconButton
          icon="close-thick"
          size={18}
          iconColor="#800000"
          onPress={hideDialog}
          style={styles.closeIcon}
        />
        <Dialog.Content>
          <Text variant="bodyMedium" style={styles.text}>
            {text}
          </Text>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: RFValue(20),
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontSize: RFValue(18),
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default IconDialog;
