import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Axios from 'axios';

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [teleponId, setTeleponId] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [showEditDelete, setShowEditDelete] = useState(false);

  useEffect(() => {
    const loadPhoneNumber = async () => {
      try {
        const response = await Axios.get('http://192.168.111.76:3000/Telepon');
        if (response.data && response.data.length > 0) {
          setPhoneNumber(response.data[0].phoneNumber);
          setTeleponId(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to load phone number.', error);
      }
    };

    loadPhoneNumber();
  }, []);

  const savePhoneNumber = async () => {
    try {
      if (teleponId) {
        await Axios.put(`http://192.168.111.76:3000/Telepon/${teleponId}`, { phoneNumber });
        Alert.alert('Success', 'Phone number updated successfully!');
      } else {
        const response = await Axios.post('http://192.168.111.76:3000/Telepon', { phoneNumber });
        setTeleponId(response.data.id); // Update ID setelah berhasil menambah data baru
        Alert.alert('Success', 'Phone number saved successfully!');
      }
      setIsEditing(false);
      setShowEditDelete(false);
    } catch (error) {
      console.error('Failed to save phone number.', error);
      Alert.alert('Error', 'Failed to save phone number.');
    }
  };

  const deletePhoneNumber = async () => {
    if (!teleponId) {
      Alert.alert('Error', 'No phone number to delete!');
      return;
    }
// ----------------------------------------------------------
    try {
      await Axios.delete(`http://192.168.111.76:3000/Telepon/${teleponId}`);
      Alert.alert('Success', 'Phone number deleted successfully!');
      setPhoneNumber('');
      setTeleponId(null);
      setShowEditDelete(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to delete phone number.', error);
      Alert.alert('Error', 'Failed to delete phone number.');
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setShowEditDelete(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Masuk Dengan nomer telepon</Text>

      {isEditing ? (
        <TextInput
          style={styles.input}
          placeholder="Nomor telepon"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      ) : (
        <TouchableOpacity
          style={styles.phoneContainer}
          onPress={() => setShowEditDelete(!showEditDelete)}
        >
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </TouchableOpacity>
      )}

      {showEditDelete && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={startEditing}>
            <Text style={styles.primaryButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={deletePhoneNumber}>
            <Text style={styles.secondaryButtonText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      )}

      {isEditing && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={savePhoneNumber}>
            <Text style={styles.primaryButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.footerText}>
        {phoneNumber}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  closeButtonText: {
    fontSize: 30,
    color: '#000',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  phoneContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  phoneNumber: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 20,
    width: '100%',
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#d0e1ff',
    borderRadius: 5,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#666',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ff3333',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#666',
    fontSize: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  link: {
    color: '#007bff',
  },
});

export default App;
