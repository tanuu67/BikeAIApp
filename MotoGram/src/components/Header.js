import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>MotoGram</Text>
      
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50, 
    paddingBottom: 10,
    backgroundColor: '#000',
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'italic', 
  },
  iconContainer: { flexDirection: 'row' },
  iconButton: { marginLeft: 20 }
});

export default Header;