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
import AddCreators from './screens/AddCreators';
import OAuth from './constants/OAuth';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
import { UserProvider } from './contexts/UserContext';

global.Buffer = Buffer;
global.process = global.process || require('process');

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Tabs: undefined;
  ConnectPlatforms: { userId: string } | undefined;
  AddCreators: { platforms?: string[]; userId?: string } | undefined;
  OAuth: { platform: string };
  CreatorDetail: { creator: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Deep linking configuration
const linking = {
  prefixes: ['myapp://', 'https://notifybear.com'],
  config: {
    screens: {
      ConnectPlatforms: 'connect-platforms',
      Login: 'login',
      Tabs: 'tabs',
      Home: 'home',
      OAuth: 'oauth/:platform',
      AddCreators: 'add-creators',
    },
  },
};

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
    <UserProvider>
    <AppProvider>
    <NavigationContainer linking={linking}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="ConnectPlatforms" component={ConnectedPlatforms} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="AddCreators" component={AddCreators} />
          <Stack.Screen name="OAuth" component={OAuth} />
          <Stack.Screen name="Tabs" component={BottomTabs} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="CreatorDetail" component={require('./screens/CreatorDetail').default} />
        </Stack.Navigator>
      </NavigationContainer>
      </AppProvider>
      </UserProvider>
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
