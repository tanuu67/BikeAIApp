import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DirectMessage = ({ route, navigation }) => {
  const { recipient } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat with {recipient?.username || 'Rider'}</Text>
      </View>
      
      <View style={styles.centered}>
        <Ionicons name="chatbubbles-outline" size={80} color="#333" />
        <Text style={styles.text}>Messaging Engine Warming Up...</Text>
        <Text style={styles.subText}>Chat feature coming in the next gear!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 0.3, borderBottomColor: '#333' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: 'white', fontSize: 18, marginTop: 20, fontWeight: 'bold' },
  subText: { color: '#888', marginTop: 10 }
});

export default DirectMessage;