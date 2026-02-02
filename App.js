import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LiveDetectorScreen from './src/screens/LiveDetectorScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detector" component={LiveDetectorScreen} />
        {/* Placeholders for other screens */}
        <Stack.Screen name="Simulator" component={PlaceholderScreen} />
        <Stack.Screen name="Traffic" component={PlaceholderScreen} />
        <Stack.Screen name="Contrast" component={PlaceholderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Simple placeholder for unimplemented screens
import { View, Text, TouchableOpacity } from 'react-native';
const PlaceholderScreen = ({ route, navigation }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{route.name} Interface</Text>
    <Text style={{ color: 'gray', marginBottom: 20 }}>Coming soon...</Text>
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, backgroundColor: 'black', borderRadius: 8 }}>
      <Text style={{ color: 'white' }}>Go Back</Text>
    </TouchableOpacity>
  </View>
);
