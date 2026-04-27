import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { auth } from './src/firebase/config';

// Screens
import DirectMessage from './src/screens/DirectMessage';
import EditProfileScreen from './src/screens/EditProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import PostDetail from './src/screens/PostDetail';
import ProfileScreen from './src/screens/ProfileScreen';
import UploadScreen from './src/screens/UploadScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- 🏍️ Moto-Tab Navigator (Bottom Bar) ---
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Main') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Chat') {
            // 💬 Chat icon niche add kar diya
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Garage') {
            iconName = focused ? 'bicycle' : 'bicycle-outline';
          }
          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#e53935',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: { 
          backgroundColor: '#000', 
          borderTopColor: '#1a1a1a', 
          height: 60, 
          paddingBottom: 5 
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Main" component={HomeScreen} />
      <Tab.Screen name="Search" component={HomeScreen} />
      <Tab.Screen name="Chat" component={DirectMessage} />
      <Tab.Screen name="Garage" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- 🏎️ Main App Stack ---
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (rider) => {
      setUser(rider);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#000' } }}>
        {user ? (
          <>
            {/* Main Tabs (Home, Search, Chat, Garage) */}
            <Stack.Screen name="HomeTabs" component={TabNavigator} />
            
            {/* Full Screen Features */}
            <Stack.Screen name="Upload" component={UploadScreen} />
            
            {/* 🖼️ Post Detail Screen (Photo View) */}
            <Stack.Screen 
              name="PostDetail" 
              component={PostDetail} 
              options={{ headerShown: false }} 
            />
            
            {/* 🛠️ Edit Garage Details Screen */}
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen} 
              options={{ 
                headerShown: true, 
                title: 'Edit Garage', 
                headerStyle: { backgroundColor: '#000' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' }
              }} 
            />

            {/* Notification Screen (Heart icon ke liye placeholder) */}
            <Stack.Screen 
              name="Notifications" 
              component={HomeScreen} // Abhi ke liye Home dikhega, baad mein list bana dena
              options={{ 
                headerShown: true, 
                title: 'Activity', 
                headerStyle: { backgroundColor: '#000' },
                headerTintColor: '#fff' 
              }} 
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}