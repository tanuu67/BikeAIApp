import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList, Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebase/config';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalRevs, setTotalRevs] = useState(0);

  // --- 🛠 Header Logic (Notification Heart Icon added) ---
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => <Text style={styles.headerUser}>{auth.currentUser?.displayName || 'Rider'}</Text>,
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 15 }} onPress={handleTopMenu}>
          <Ionicons name="add-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.navigate('Notifications')}>
          {/* Messenger ki jagah Heart (Notification) icon */}
          <Ionicons name="heart-outline" size={28} color="white" />
        </TouchableOpacity>
      ),
      headerStyle: { backgroundColor: '#000', borderBottomWidth: 0.3, borderBottomColor: '#1a1a1a' },
    });
  }, [navigation]);

  const handleTopMenu = () => {
    const options = ['Cancel', 'Moto-Fuel ⛽', 'Moto-Rideo 📸'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({ options, cancelButtonIndex: 0 }, (buttonIndex) => {
        if (buttonIndex === 1) Alert.alert("Fuel", "Go to Home to post Fuel!");
        if (buttonIndex === 2) handlePost();
      });
    } else {
      Alert.alert("Moto Activity", "Prepare to Ride:", [
        { text: "Post Rideo 📸", onPress: handlePost },
        { text: "Cancel", style: "cancel" }
      ]);
    }
  };

  const handlePost = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!result.canceled) navigation.navigate('Upload', { capturedImage: result.assets[0].uri });
  };

  // --- 🔄 Data Fetching ---
  useEffect(() => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) setUserData(docSnap.data());
    });

    const q = query(collection(db, 'posts'), where('userId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPosts(posts);
      let count = 0;
      posts.forEach(p => { if(p.likes) count += p.likes.length; });
      setTotalRevs(count);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.profileRow}>
        <View style={styles.imageWrapper}>
          <View style={styles.profileImagePlaceholder}>
            <Ionicons name="person" size={50} color="#444" />
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="add" size={16} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            {/* Rideos ko Post kar diya */}
            <Text style={styles.statNumber}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statBox}>
            {/* Followers label set */}
            <Text style={styles.statNumber}>10k</Text> 
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statBox}>
            {/* Following label set */}
            <Text style={styles.statNumber}>450</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      <View style={styles.bioSection}>
        <Text style={styles.displayName}>{userData?.fullName || 'Rider'}</Text>
        
        <View style={styles.bikeInfo}>
          <Ionicons name="bicycle" size={14} color="#e53935" />
          <Text style={styles.bikeText}>{userData?.bikeModel || 'Add your Machine'}</Text>
        </View>

        <Text style={styles.bioText}>{userData?.bio || 'Biker by blood. Explorer by heart. 🏍️'}</Text>

        <View style={styles.socialLinks}>
          {userData?.youtube && (
            <TouchableOpacity onPress={() => Linking.openURL(userData.youtube)} style={styles.linkChip}>
              <Ionicons name="logo-youtube" size={14} color="red" />
              <Text style={styles.linkText}>YouTube</Text>
            </TouchableOpacity>
          )}
          {userData?.website && (
            <TouchableOpacity onPress={() => Linking.openURL(userData.website)} style={styles.linkChip}>
              <Ionicons name="link" size={14} color="#00abff" />
              <Text style={styles.linkText}>Website</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editButtonText}>Edit Garage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareIconButton}>
          <Ionicons name="share-social-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabDivider}>
        <Ionicons name="grid-outline" size={20} color="white" />
        <View style={styles.activeTabUnderline} />
      </View>
    </View>
  );

  const renderGridItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.gridItem} 
      onPress={() => navigation.navigate('PostDetail', { post: item })}
    >
      <Image source={{ uri: item.postImage }} style={styles.gridImage} />
    </TouchableOpacity>
  );

  if (loading) return <View style={styles.centered}><ActivityIndicator color="#e53935" /></View>;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={userPosts}
        ListHeaderComponent={renderHeader}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerUser: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  headerContainer: { padding: 15 },
  profileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  imageWrapper: { position: 'relative' },
  profileImagePlaceholder: { width: 85, height: 85, borderRadius: 45, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#e53935' },
  addBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#e53935', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000' },
  statsRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginLeft: 15 },
  statBox: { alignItems: 'center' },
  statNumber: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12 },
  bioSection: { marginTop: 15 },
  displayName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  bikeInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  bikeText: { color: '#e53935', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
  bioText: { color: '#ccc', fontSize: 14, marginTop: 5 },
  socialLinks: { flexDirection: 'row', marginTop: 10 },
  linkChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginRight: 10 },
  linkText: { color: '#00abff', fontSize: 12, marginLeft: 5 },
  buttonRow: { flexDirection: 'row', marginTop: 20 },
  editButton: { flex: 1, backgroundColor: '#1a1a1a', height: 35, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  editButtonText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  shareIconButton: { width: 35, height: 35, backgroundColor: '#1a1a1a', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  tabDivider: { marginTop: 25, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1a1a1a', paddingBottom: 10 },
  activeTabUnderline: { position: 'absolute', bottom: 0, width: width/3, height: 2, backgroundColor: 'white' },
  gridItem: { width: width/3 - 1, height: width/3 - 1, margin: 0.5 },
  gridImage: { width: '100%', height: '100%' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }
});

export default ProfileScreen;