import React from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, Text, View, SafeAreaView, ActivityIndicator, FlatList, ScrollView, Alert } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from '../constants/key';
import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useAppContext } from '../contexts/AppContext';
import { storeToken } from '../utils/storage';
import ScreenWrapper from '../components/ScreenWrapper';
import TopNav2 from '../components/TopNav2';
import ConnectedPlatforms from './ConnectPlatforms';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  scopes: ['https://www.googleapis.com/auth/youtube.readonly'], // YouTube API scope
  forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  iosClientId: IOS_CLIENT_ID,
});

function Login({ navigation }: LoginProps) {
  const { fetchYouTubeSubscriptions, subscriptions } = useAppContext();
  const [loading, setLoading] = useState(false);

  const saveUserToServer = async (userInfo: any) => {
    try {
      console.log('Full userInfo object:', JSON.stringify(userInfo, null, 2));
      
      // Try different possible property paths
      const userData = {
        googleId: userInfo.user?.id || userInfo.id || userInfo.userId,
        email: userInfo.user?.email || userInfo.email,
        name: userInfo.user?.name || userInfo.name || userInfo.displayName,
        photo: userInfo.user?.photo || userInfo.photo || userInfo.user?.photoURL || userInfo.photoURL,
      };
      
      console.log('Extracted user data:', userData);
      
      // Check if we have valid data
      if (!userData.googleId || !userData.email) {
        console.error('Missing required user data:', userData);
        return;
      }
      
      const response = await fetch('http://192.168.0.104:4000/api/user/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to save user to server: ${response.status} - ${responseText}`);
      }
      
      const result = JSON.parse(responseText);
      console.log('User saved to server:', result);
    } catch (error) {
      console.error('Error saving user to server:', error);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      
      if (tokens) {
        await storeToken(tokens.accessToken);
        
        // Get current user info separately
        const currentUser = await GoogleSignin.getCurrentUser();
        console.log('Current user from GoogleSignin:', currentUser);
        
        // Try to save user to server, but don't fail if it doesn't work
        try {
          await saveUserToServer(currentUser || userInfo);
        } catch (error) {
          console.log('Server save failed, but continuing with login');
        }
        
        // const newSubs = await fetchYouTubeSubscriptions();
        // if (newSubs && newSubs.length > 0) {
        //   navigation.replace("ConnectPlatforms");
        // } else {
        //   Alert.alert("Login", "No subscriptions found or failed to fetch.");
        // }
        navigation.replace("ConnectPlatforms");
      } else {
        Alert.alert("Login", "Token not received");
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

    return (
    <ScreenWrapper>
      <TopNav2 title="Login" />
      <View style={styles.container}>
        {!loading && (
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleSignIn}
          />
        )}
        {loading && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    marginVertical: 4,
  },
});

export default Login;
