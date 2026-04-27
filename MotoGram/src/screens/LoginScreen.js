import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase/config';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .catch(error => Alert.alert("Hold up!", "Invalid Rider details. Check your fuel/passkey."));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Ionicons name="bicycle" size={70} color="#e53935" />
        <Text style={styles.logo}>MotoGram</Text>
        <Text style={styles.subtitle}>Ride with your community</Text>

        <TextInput placeholder="Email" placeholderTextColor="#555" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput placeholder="Passkey" placeholderTextColor="#555" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>REV ENGINE 🏁</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  inner: { padding: 30, alignItems: 'center' },
  logo: { color: 'white', fontSize: 38, fontWeight: 'bold', fontStyle: 'italic', marginTop: 10 },
  subtitle: { color: '#666', marginBottom: 40 },
  input: { width: '100%', backgroundColor: '#111', height: 55, borderRadius: 10, paddingHorizontal: 15, color: 'white', marginBottom: 15, borderWidth: 1, borderColor: '#222' },
  btn: { backgroundColor: '#e53935', width: '100%', height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default LoginScreen;