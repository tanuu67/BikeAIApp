import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator, Alert,
  Animated,
  Dimensions,
  FlatList, Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebase/config';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const progress = useRef(new Animated.Value(0)).current;

  // --- 🛠 Header Menu ---
  const handleTopMenu = () => {
    const options = ['Cancel', 'Fill Fuel ⛽ (Story)', 'Post Rideo 📸'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 0 },
        (buttonIndex) => {
          if (buttonIndex === 1) handleStatus();
          if (buttonIndex === 2) handlePost();
        }
      );
    } else {
      Alert.alert("Moto Activity", "Choose your action:", [
        { text: "Fill Fuel ⛽", onPress: handleStatus },
        { text: "Post Rideo 📸", onPress: handlePost },
        { text: "Cancel", style: "cancel" }
      ]);
    }
  };

  // --- 🔄 Real-time Data Engine ---
  useEffect(() => {
    const qPosts = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribePosts = onSnapshot(qPosts, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => console.log("Post Fetch Error:", err));

    const qStories = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    const unsubscribeStories = onSnapshot(qStories, (snapshot) => {
      setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.log("Story Fetch Error:", err));

    return () => {
      unsubscribePosts();
      unsubscribeStories();
    };
  }, []);

  // --- ❤️ Post Like (REV) ---
  const handleLike = async (postId, currentLikes) => {
    const postRef = doc(db, 'posts', postId);
    const userId = auth.currentUser.uid;
    const likesArray = currentLikes || [];
    try {
      if (likesArray.includes(userId)) {
        await updateDoc(postRef, { likes: arrayRemove(userId) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(userId) });
      }
    } catch (error) { console.log("Rev Error:", error); }
  };

  // --- ❤️ Story Like ---
  const handleStoryLike = async () => {
    if (!selectedStory) return;
    const storyRef = doc(db, 'stories', selectedStory.id);
    const userId = auth.currentUser.uid;
    const isLiked = selectedStory.likes?.includes(userId);
    try {
      await updateDoc(storyRef, {
        likes: isLiked ? arrayRemove(userId) : arrayUnion(userId)
      });
      setSelectedStory(prev => ({
        ...prev,
        likes: isLiked ? prev.likes.filter(id => id !== userId) : [...(prev.likes || []), userId]
      }));
    } catch (err) { console.log("Fuel Like Error:", err); }
  };

  // --- 📸 Camera & Upload Engine ---
  const handlePost = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Access Denied", "Camera permission needed.");
    
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setTimeout(() => {
        navigation.navigate('Upload', { capturedImage: result.assets[0].uri });
      }, 300);
    }
  };

  const handleStatus = () => {
    Alert.alert("Moto Fuel", "Capture a 24-hour update?", [
      { text: "Capture 📸", onPress: handleStoryUpload },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  const handleStoryUpload = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return Alert.alert("Access Denied", "Camera permission needed.");

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        Alert.alert("Refueling...", "Your update is syncing to the grid.");
        await addDoc(collection(db, 'stories'), {
          userId: auth.currentUser.uid,
          username: auth.currentUser.displayName || 'Rider',
          storyImage: result.assets[0].uri,
          createdAt: serverTimestamp(),
          likes: [],
          replies: []
        });
        Alert.alert("Success", "Your fuel is now live!");
      }
    } catch (error) {
      console.log("Upload Error:", error);
      Alert.alert("Engine Stalled", "Could not upload.");
    }
  };

  // --- 🎨 UI Components ---
  const renderCustomHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleTopMenu}>
        <Ionicons name="add-circle-outline" size={30} color="white" />
      </TouchableOpacity>
      <Text style={styles.logoText}>MotoGram</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
        {/* Messenger hatakar Heart (Notification) icon laga diya header mein */}
        <Ionicons name="heart-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderStoryBar = () => (
    <View style={styles.storySection}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.storyWrapper}>
          <TouchableOpacity style={styles.addStoryCircle} onPress={handleStatus}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.storyUser}>Add Fuel</Text>
        </View>
        {stories.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyWrapper} onPress={() => { setSelectedStory(story); setIsModalVisible(true); }}>
            <View style={styles.storyCircle}>
              <Image source={{ uri: story.storyImage }} style={styles.storyImage} />
            </View>
            <Text style={styles.storyUser} numberOfLines={1}>{story.username}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPost = ({ item }) => {
    const isLiked = item.likes?.includes(auth.currentUser.uid);
    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.row}>
            <View style={styles.avatarMini}><Ionicons name="person" size={14} color="white" /></View>
            <Text style={styles.usernameText}>{item.username}</Text>
          </View>
          <Ionicons name="ellipsis-horizontal" size={20} color="#555" />
        </View>
        <Image source={{ uri: item.postImage }} style={styles.postImage} />
        <View style={styles.socialBar}>
          <TouchableOpacity onPress={() => handleLike(item.id, item.likes)}>
            <Ionicons name={isLiked ? "disc" : "disc-outline"} size={28} color={isLiked ? "#e53935" : "white"} style={{marginRight: 20}} />
          </TouchableOpacity>
          <Ionicons name="chatbox-ellipses-outline" size={26} color="white" style={{marginRight: 20}} />
          <Ionicons name="speedometer-outline" size={26} color="white" />
        </View>
        <View style={{ paddingHorizontal: 15, paddingBottom: 15 }}>
          {/* Revs term use ho raha hai but bio stats mein Followers/Posts ho gaya hai */}
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.likes?.length || 0} Revs 🔥</Text>
          <Text style={{ color: '#ccc', marginTop: 3 }}>
            <Text style={{ fontWeight: 'bold', color: 'white' }}>{item.username} </Text>{item.caption}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator color="#e53935" size="large" /></View>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      {renderCustomHeader()}
      <FlatList 
        data={posts} 
        ListHeaderComponent={renderStoryBar} 
        keyExtractor={(item) => item.id} 
        renderItem={renderPost} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Modal visible={isModalVisible} animationType="fade" transparent={false}>
         <View style={styles.modalBg}>
            <SafeAreaView style={{flex:1}}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setIsModalVisible(false)}>
                   <Ionicons name="close" size={35} color="white" />
                </TouchableOpacity>
                <Image source={{ uri: selectedStory?.storyImage }} style={styles.modalImg} resizeMode="contain" />
                <View style={styles.storyFooter}>
                   <TextInput 
                    placeholder="Message Rider..." 
                    placeholderTextColor="#777" 
                    style={styles.replyInput} 
                    value={replyText}
                    onChangeText={setReplyText}
                  />
                  <TouchableOpacity onPress={handleStoryLike}>
                    <Ionicons 
                      name={selectedStory?.likes?.includes(auth.currentUser.uid) ? "disc" : "disc-outline"} 
                      size={32} 
                      color={selectedStory?.likes?.includes(auth.currentUser.uid) ? "#e53935" : "white"} 
                    />
                  </TouchableOpacity>
                </View>
            </SafeAreaView>
         </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, height: 50, backgroundColor: '#000', borderBottomWidth: 0.3, borderBottomColor: '#1a1a1a' },
  logoText: { color: 'white', fontSize: 22, fontWeight: 'bold', fontStyle: 'italic' },
  storySection: { paddingVertical: 12, borderBottomWidth: 0.3, borderBottomColor: '#1a1a1a' },
  storyWrapper: { alignItems: 'center', marginHorizontal: 8, width: 70 },
  storyCircle: { width: 66, height: 66, borderRadius: 33, borderWidth: 2, borderColor: '#e53935', padding: 2 },
  addStoryCircle: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333', borderStyle: 'dashed' },
  storyImage: { width: '100%', height: '100%', borderRadius: 33 },
  storyUser: { color: '#888', fontSize: 10, marginTop: 5 },
  postCard: { marginBottom: 10, backgroundColor: '#000' },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  avatarMini: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  usernameText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  postImage: { width: width, height: width },
  socialBar: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  modalBg: { flex: 1, backgroundColor: '#000' },
  closeBtn: { alignSelf: 'flex-end', padding: 20 },
  modalImg: { width: width, height: height * 0.65 },
  storyFooter: { flexDirection: 'row', alignItems: 'center', padding: 20, position: 'absolute', bottom: 40, width: '100%' },
  replyInput: { flex: 1, height: 45, borderRadius: 25, borderWidth: 1, borderColor: '#333', paddingHorizontal: 20, color: 'white', marginRight: 15 }
});

export default HomeScreen;