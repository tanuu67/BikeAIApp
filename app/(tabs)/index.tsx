import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const [message, setMessage] = useState('');
  const flatRef = useRef();

  // 🔑 APNI API KEY YAHAN DAALEIN
  const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
    setTimeout(() => setShowSplash(false), 2000);
  }, []);

  const [chat, setChat] = useState([
    {
      id: '1',
      text: "Welcome to the Elite Garage. I am your Bike Expert AI. 🏍️",
      sender: 'ai'
    }
  ]);

  const bikeData = [
    { q: "ktm rc 350", a: "KTM RC 350 expected April 2026, ₹2.9–3 lakh 🏁" },
    { q: "bullet 650", a: "RE Bullet 650 expected June 2026 🆕" },
    { q: "norton v4", a: "Norton V4 superbike ₹25–30 lakh 💎" }
  ];

  const getAIAnswer = async (msg) => {
    const text = msg.toLowerCase();
    
    // Check Local Data First
    for (let item of bikeData) {
      if (text.includes(item.q)) return item.a;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are a professional motorcycle expert. Provide a very concise, luxury-toned answer in Hinglish to: ${msg}` }] }]
          })
        }
      );
      
      const data = await response.json();

      // 🔥 FIXED: Check if candidates exist before accessing
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        console.log("API Error Log:", data.error.message);
        return "System update in progress. Please try again later. 🛠️";
      }
      
      return "I'm processing your request. Please rephrase. 🏍️";

    } catch (error) {
      console.log("Network Error:", error);
      return "Check your connection, Rider. The garage is offline. 🌐";
    }
  };

  const send = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message;
    setMessage('');
    setLoading(true);

    setChat(prev => [...prev, { id: Date.now().toString(), text: userMsg, sender: 'user' }]);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);

    const reply = await getAIAnswer(userMsg);
    
    setChat(prev => [...prev, { id: Date.now().toString(), text: reply, sender: 'ai' }]);
    setLoading(false);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 200);
  };

  if (showSplash) {
    return (
      <View style={styles.splash}>
        <StatusBar barStyle="light-content" />
        <Animated.Text style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}>
          M O T O <Text style={{color: '#D4AF37'}}>AI</Text>
        </Animated.Text>
        <Text style={styles.tagline}>THE ELITE EXPERIENCE</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerText}>BIKE EXPERT <Text style={{color: '#D4AF37'}}>AI</Text></Text>
        <View style={styles.onlineStatus} />
      </View>

      <FlatList
        ref={flatRef}
        data={chat}
        renderItem={({ item }) => (
          <View style={[
            styles.bubble,
            item.sender === 'user' ? styles.user : styles.ai
          ]}>
            <Text style={{ 
                color: item.sender === 'user' ? '#000' : '#E0E0E0',
                fontSize: 15,
                lineHeight: 22
            }}>
              {item.text}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      />

      <View style={styles.inputArea}>
        <View style={styles.innerInputRow}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Search your next adrenaline rush..."
            placeholderTextColor="#555"
            editable={!loading}
          />
          <TouchableOpacity 
            style={[styles.btn, { opacity: loading ? 0.6 : 1 }]} 
            onPress={send}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#000" size="small" /> : <Text style={styles.btnText}>SEND</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  logo: { color: '#fff', fontSize: 36, fontWeight: '200', letterSpacing: 8 },
  tagline: { color: '#444', fontSize: 10, letterSpacing: 4, marginTop: 12 },
  header: { paddingTop: 60, paddingBottom: 20, alignItems: 'center', backgroundColor: '#000', borderBottomWidth: 0.5, borderBottomColor: '#222' },
  headerText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 2 },
  onlineStatus: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D4AF37', marginTop: 8 },
  bubble: { padding: 18, borderRadius: 20, marginBottom: 15, maxWidth: '85%' },
  user: { backgroundColor: '#D4AF37', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  ai: { backgroundColor: '#161618', alignSelf: 'flex-start', borderBottomLeftRadius: 2, borderWidth: 0.5, borderColor: '#333' },
  inputArea: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 25, backgroundColor: '#000' },
  innerInputRow: { flexDirection: 'row', backgroundColor: '#0F0F0F', borderRadius: 35, padding: 6, borderWidth: 1, borderColor: '#222', alignItems: 'center' },
  input: { flex: 1, color: '#fff', paddingHorizontal: 20, height: 48 },
  btn: { backgroundColor: '#D4AF37', height: 44, paddingHorizontal: 22, borderRadius: 22, justifyContent: 'center' },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 11 }
});