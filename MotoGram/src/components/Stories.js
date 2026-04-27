import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const USERS = [
  { id: 1, name: 'Your Story', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&q=80' },
  { id: 2, name: 'himalayan_rider', image: 'https://images.unsplash.com/photo-1516934524823-3b6833b38461?w=100&q=80' },
  { id: 3, name: 'trail_blazer', image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=100&q=80' },
  { id: 4, name: 'caferacer_girl', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=100&q=80' },
];

const Stories = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {USERS.map((user) => (
          <TouchableOpacity key={user.id} style={styles.storyItem}>
            <LinearGradient
              colors={['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
              style={styles.gradientCircle}
            >
              <View style={styles.whiteBorder}>
                <Image source={{ uri: user.image }} style={styles.profileImg} />
              </View>
            </LinearGradient>
            <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 10, borderBottomWidth: 0.2, borderBottomColor: '#333', backgroundColor: '#000' },
  storyItem: { alignItems: 'center', marginLeft: 15 },
  gradientCircle: { width: 78, height: 78, borderRadius: 39, justifyContent: 'center', alignItems: 'center' },
  whiteBorder: { width: 74, height: 74, borderRadius: 37, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  profileImg: { width: 68, height: 68, borderRadius: 34 },
  userName: { color: '#fff', fontSize: 11, marginTop: 5, width: 70, textAlign: 'center' },
});

export default Stories;