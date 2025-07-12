import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Splash from './screens/Splash';
import Login from './screens/Login';
import BottomTabs from './components/BottomTabs';
import { AppProvider } from './contexts/AppContext';
import { getToken } from './utils/storage'; // Import your getToken utility
import ConnectedPlatforms from './screens/ConnectPlatforms';
import OAuth from './constants/OAuth';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';

global.Buffer = Buffer;
global.process = require('process');

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Tabs: undefined;
  ConnectPlatforms: undefined;
  OAuth: { platform: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Tabs'>('Login');

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setInitialRoute(token ? 'Tabs' : 'Login');
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading)
    return (
      <Splash navigation={{ navigate: () => {} } as any} route={{} as any} />
    ); // Show splash until auth check is done

  return (
    <AppProvider>
    <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="ConnectPlatforms" component={ConnectedPlatforms} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="OAuth" component={OAuth} />
          <Stack.Screen name="Tabs" component={BottomTabs} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
      </AppProvider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
});

export default App;
