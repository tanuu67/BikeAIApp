import { FlatList, View } from 'react-native';
import Post from './Post';

const POST_DATA = [
  {
    id: '1',
    username: 'trippy_riders',
    location: 'Zirakpur to Kutch Route',
    profilePic: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&q=80',
    postImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80', // Motorcycle image
    likes: '1,245',
    caption: 'Testing the Himalayan 450 on the open roads. The machine feels solid! 🏍️💨 #ridehard',
  },
  {
    id: '2',
    username: 'lost_with_tarun',
    location: 'Unexplored Trails, Gujarat',
    profilePic: 'https://images.unsplash.com/photo-1516934524823-3b6833b38461?w=100&q=80',
    postImage: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80', // Camping/Nature image
    likes: '892',
    caption: 'Setting up camp for the night. No better feeling than sleeping under the stars. ⛺✨',
  }
];

const Feed = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <FlatList
        data={POST_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Post post={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Feed;