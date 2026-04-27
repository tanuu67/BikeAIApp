import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebase/config';

const EditProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [youtube, setYoutube] = useState('');
  const [website, setWebsite] = useState('');

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        fullName,
        bikeModel,
        youtube,
        website,
      }, { merge: true });
      Alert.alert("Garage Updated!", "Your biker profile is now live.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rider Name</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="e.g. Tarun Kumar" placeholderTextColor="#555" />
      
      <Text style={styles.label}>Machine (Bike Model)</Text>
      <TextInput style={styles.input} value={bikeModel} onChangeText={setBikeModel} placeholder="e.g. Himalayan 450" placeholderTextColor="#555" />
      
      <Text style={styles.label}>YouTube Link</Text>
      <TextInput style={styles.input} value={youtube} onChangeText={setYoutube} placeholder="https://youtube.com/..." placeholderTextColor="#555" />
      
      <Text style={styles.label}>Website</Text>
      <TextInput style={styles.input} value={website} onChangeText={setWebsite} placeholder="https://..." placeholderTextColor="#555" />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Garage Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  label: { color: '#e53935', fontWeight: 'bold', marginTop: 20, marginBottom: 5 },
  input: { backgroundColor: '#111', color: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#333' },
  saveBtn: { backgroundColor: '#e53935', marginTop: 40, padding: 15, borderRadius: 10, alignItems: 'center' },
  saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default EditProfileScreen;