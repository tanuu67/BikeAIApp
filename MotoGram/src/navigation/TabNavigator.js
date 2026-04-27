import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UploadScreen from '../screens/UploadScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Alag se function banao taaki React ise component ki tarah pehchane
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }}>
      <Stack.Screen 
        name="MotoFeed" 
        component={HomeScreen} 
        options={{ title: 'MotoGram' }} 
      />
      <Stack.Screen 
        name="Upload" 
        component={UploadScreen} 
        options={{ title: 'New Post' }} 
      />
    </Stack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e53935',
        tabBarStyle: { backgroundColor: '#000' }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;