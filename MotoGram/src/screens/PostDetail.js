import { Ionicons } from '@expo/vector-icons';
import { arrayRemove, arrayUnion, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebase/config';

const { width } = Dimensions.get('window');

const PostDetail = ({ route, navigation }) => {
  const { post: initialPost } = route.params;
  const [post, setPost] = useState(initialPost);
  const [isLiked, setIsLiked] = useState(initialPost.likes?.includes(auth.currentUser.uid));
  const [lastTap, setLastTap] = useState(0);
  
  // Animation for Double Tap
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'posts', initialPost.id), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setPost({ id: doc.id, ...data });
        setIsLiked(data.likes?.includes(auth.currentUser.uid));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLike = async () => {
    const postRef = doc(db, 'posts', post.id);
    try {
      if (isLiked) {
        await updateDoc(postRef, { likes: arrayRemove(auth.currentUser.uid) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(auth.currentUser.uid) });
        animateHeart();
      }
    } catch (error) { console.log(error); }
  };

  // Double Tap Logic
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      if (!isLiked) handleLike();
      else animateHeart();
    } else {
      setLastTap(now);
    }
  };

  const animateHeart = () => {
    Animated.sequence([
      Animated.spring(animatedValue, { toValue: 1, useNativeDriver: true }),
      Animated.spring(animatedValue, { toValue: 0, useNativeDriver: true }),
    ]).start();
  };

  const handleDelete = () => {
    Alert.alert("Delete Rideo?", "Kyun bhai, ye ride yaadgaar nahi rahi?", [
      { text: "Keep it", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          await deleteDoc(doc(db, 'posts', post.id));
          navigation.goBack();
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RIDEO</Text>
        {post.userId === auth.currentUser.uid ? (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color="#e53935" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.userInfo}>
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatar} />
          <Text style={styles.username}>{post.username}</Text>
        </View>

        <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap}>
          <View>
            <Image source={{ uri: post.postImage }} style={styles.postImage} />
            {/* Pop-up Heart Animation */}
            <Animated.View style={[styles.heartOverlay, { opacity: animatedValue, transform: [{ scale: animatedValue }] }]}>
              <Ionicons name="disc" size={100} color="white" />
            </Animated.View>
          </View>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <View style={styles.leftActions}>
            <TouchableOpacity onPress={handleLike} style={styles.iconBtn}>
              <Ionicons name={isLiked ? "disc" : "disc-outline"} size={30} color={isLiked ? "#e53935" : "white"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="chatbox-ellipses-outline" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="speedometer-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <Text style={styles.revCount}>{post.likes?.length || 0} Revs 🔥</Text>
          <Text style={styles.captionText}>
            <Text style={styles.bold}>{post.username}</Text> {post.caption}
          </Text>
          <Text style={styles.dateText}>
            {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Just now"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 0.2, borderBottomColor: '#222' },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 2 },
  userInfo: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  avatar: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#333', marginRight: 10 },
  username: { color: 'white', fontWeight: 'bold' },
  postImage: { width: width, height: width },
  heartOverlay: { position: 'absolute', top: width / 2 - 50, left: width / 2 - 50, justifyContent: 'center', alignItems: 'center' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
  leftActions: { flexDirection: 'row' },
  iconBtn: { marginRight: 20 },
  details: { paddingHorizontal: 15 },
  revCount: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  captionText: { color: '#eee', marginTop: 5, lineHeight: 20 },
  bold: { fontWeight: 'bold', color: 'white' },
  dateText: { color: '#555', fontSize: 11, marginTop: 10, textTransform: 'uppercase' }
});

export default PostDetail;