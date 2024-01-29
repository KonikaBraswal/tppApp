import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Modal, Portal, Checkbox, Button} from 'react-native-paper';

const SortDropdown = () => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);

  const handleCheckboxToggle = itemValue => {
    setSelectedItem(itemValue);
  };

  const data = [
    {label: 'Last 10 Transactions', value: 'transactions'},
    {label: 'Last Month', value: 'Last Month'},
    {label: 'Last 3 Months', value: 'Last 3 Months'},
    {label: 'Last 1 Year', value: 'Last 1 Year'},
    {label: 'All', value: 'All'},
  ];

  return (
    <View>
      <Button
        icon="chevron-down"
        onPress={showMenu}
        mode="outlined"
        labelStyle={styles.buttonText}>
        Filter
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
              status={selectedItem === item.value ? 'checked' : 'unchecked'}
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
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default SortDropdown;
