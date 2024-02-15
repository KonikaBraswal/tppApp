import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Modal, Portal, Checkbox, Button} from 'react-native-paper';

const DropdownWithCheckboxes = () => {
  const [visible, setVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);

  const handleCheckboxToggle = itemValue => {
    if (selectedItems.includes(itemValue)) {
      setSelectedItems(selectedItems.filter(item => item !== itemValue));
    } else {
      setSelectedItems([...selectedItems, itemValue]);
    }
  };

  const data = [
    {label: 'Beneficiaries', value: 'beneficiaries'},
    {label: 'Direct-Debits', value: 'direct-debits'},
    {label: 'Standing-Orders', value: 'standing-orders'},
    {label: 'Scheduled-Payments', value: 'scheduled-payments'},
    {label: 'Statements', value: 'statements'},
    {label: 'Offers', value: 'offers'},
  ];

  return (
    <View>
      <Button icon="chevron-down" mode="contained" onPress={showMenu}>
        More
      </Button>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideMenu}
          contentContainerStyle={styles.modalContainer}>
          {data.map(item => (
            <Checkbox.Item
              key={item.value}
              label={item.label}
              status={
                selectedItems.includes(item.value) ? 'checked' : 'unchecked'
              }
              onPress={() => handleCheckboxToggle(item.value)}
            />
          ))}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default DropdownWithCheckboxes;