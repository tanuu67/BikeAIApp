import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import {
  ActivityIndicator, Alert,
  Image,
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native'; // 🚨 Yahan ScrollView add ho gaya hai
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebase/config';

const UploadScreen = ({ route, navigation }) => {
  const { capturedImage } = route.params || {};
  
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadRideo = async () => {
    if (!capturedImage) {
      Alert.alert("Missing Fuel", "No image found to upload.");
      return;
    }

    setIsUploading(true);

    try {
      await addDoc(collection(db, 'posts'), {
        userId: auth.currentUser?.uid,
        username: auth.currentUser?.displayName || 'Rider',
        postImage: capturedImage, 
        caption: caption,
        likes: [],
        createdAt: serverTimestamp(),
      });

      setIsUploading(false);
      Alert.alert("Rideo Live! 🔥", "Your post is now on the grid.");
      navigation.goBack(); 

    } catch (error) {
      setIsUploading(false);
      console.log("Upload Error:", error);
      Alert.alert("Engine Stalled", "Could not upload Rideo. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Rideo</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          
          {capturedImage ? (
             <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
          ) : (
             <View style={[styles.imagePreview, { justifyContent: 'center', alignItems: 'center' }]}>
               <Ionicons name="image-outline" size={50} color="#555" />
             </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="chatbox-ellipses-outline" size={24} color="#888" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption for your ride..."
              placeholderTextColor="#777"
              multiline
              maxLength={200}
              value={caption}
              onChangeText={setCaption}
            />
          </View>

          <TouchableOpacity 
            style={[styles.uploadButton, isUploading && { backgroundColor: '#555' }]} 
            onPress={handleUploadRideo}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.uploadButtonText}>Drop Gear & Post 🚀</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    height: 60,
    borderBottomWidth: 0.3,
    borderBottomColor: '#1a1a1a'
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, padding: 15 },
  imagePreview: { 
    width: '100%', 
    height: 350, 
    borderRadius: 15, 
    backgroundColor: '#111',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 30
  },
  captionInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    minHeight: 50,
  },
  uploadButton: {
    backgroundColor: '#e53935', 
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default UploadScreen;