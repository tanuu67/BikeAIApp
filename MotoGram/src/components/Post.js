import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const Post = ({ post }) => {
  return (
    <View style={styles.container}>
      {/* Post Header (Profile Pic & Username) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: post.profilePic }} style={styles.profilePic} />
          <View>
            <Text style={styles.username}>{post.username}</Text>
            {post.location && <Text style={styles.location}>{post.location}</Text>}
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <Image source={{ uri: post.postImage }} style={styles.postImage} />

      {/* Post Footer (Icons) */}
      <View style={styles.footer}>
        <View style={styles.footerIcons}>
          <TouchableOpacity style={styles.icon}>
            <Ionicons name="heart-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Ionicons name="chatbubble-outline" size={26} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Ionicons name="paper-plane-outline" size={26} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Likes and Caption */}
      <Text style={styles.likes}>{post.likes} likes</Text>
      <View style={styles.captionContainer}>
        <Text style={styles.captionUsername}>{post.username} <Text style={styles.captionText}>{post.caption}</Text></Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  profilePic: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  username: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  location: { color: '#ccc', fontSize: 11 },
  postImage: { width: width, height: width }, // Square image like standard Instagram
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 10 },
  footerIcons: { flexDirection: 'row' },
  icon: { marginRight: 15 },
  likes: { color: 'white', fontWeight: 'bold', paddingHorizontal: 10, marginTop: 5 },
  captionContainer: { paddingHorizontal: 10, marginTop: 5 },
  captionUsername: { color: 'white', fontWeight: 'bold' },
  captionText: { color: 'white', fontWeight: 'normal' },
});

export default Post;