import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebase/config';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bike, setBike] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !username) return Alert.alert("Missing Details", "Please fill all fields.");
    if (password.length < 6) return Alert.alert("Weak Password", "At least 6 characters.");

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(doc(db, 'users', userCredentials.user.uid), {
        uid: userCredentials.user.uid,
        username: username.trim(),
        email: email.toLowerCase().trim(),
        bike: bike || 'Royal Enfield', 
        profilePic: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        followers: 0,
        following: 0,
        createdAt: serverTimestamp(), 
      });
      Alert.alert("Account Created", "Welcome to MotoGram!");
      navigation.replace('Main'); 
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Create Account</Text>
      <View style={styles.inputContainer}>
        <TextInput placeholder="Username" placeholderTextColor="#888" style={styles.input} value={username} onChangeText={setUsername} />
        <TextInput placeholder="Email Address" placeholderTextColor="#888" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput placeholder="Your Motorcycle" placeholderTextColor="#888" style={styles.input} value={bike} onChangeText={setBike} />
        <TextInput placeholder="Password (min 6 chars)" placeholderTextColor="#888" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up & Ride</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  headerText: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 30, fontStyle: 'italic' },
  inputContainer: { width: '80%' },
  input: { backgroundColor: '#1a1a1a', color: 'white', padding: 15, borderRadius: 10, marginTop: 15, borderWidth: 1, borderColor: '#333' },
  registerButton: { backgroundColor: '#e53935', width: '80%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});

export default RegisterScreen;