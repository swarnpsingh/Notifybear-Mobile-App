import React from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, Text, View, SafeAreaView, ActivityIndicator, FlatList, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
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
import Typo from '../components/Typo';
import GradientText from '../components/GradientText';
import { colors, spacingX, spacingY } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      
      const response = await fetch('http://192.168.0.108:4000/api/user/google-login', {
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
        const currentUser: any = await GoogleSignin.getCurrentUser();
        console.log('Current user from GoogleSignin:', currentUser);
        
        // Try to save user to server, but don't fail if it doesn't work
        let userId = null;
        try {
          const userData = {
            googleId: currentUser?.user?.id || currentUser?.id || currentUser?.userId,
            email: currentUser?.user?.email || currentUser?.email,
            name: currentUser?.user?.name || currentUser?.name || currentUser?.displayName,
            photo: currentUser?.user?.photo || currentUser?.photo || currentUser?.user?.photoURL || currentUser?.photoURL,
          };
          const response = await fetch('http://192.168.0.108:4000/api/user/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
          const result = await response.json();
          userId = result?.user?._id;
        } catch (error) {
          console.log('Server save failed, but continuing with login');
        }
        if (userId) {
          await AsyncStorage.setItem('userId', userId);
        }
        navigation.replace('ConnectPlatforms', { userId});
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
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.welcomeSection}>
            <Image
              source={require('../assets/icon-mascot.png')}
              style={styles.logo}
            />
            <GradientText
              style={{
                fontSize: 30,
                fontWeight: '800',
              }}
              colors={['#007BFF', '#FFB6C1']}
            >
              notifybear
            </GradientText>
            <Typo size={20} fontWeight={'200'} style={{ marginTop: 10 }}>
              Stay on top of your favorite
            </Typo>
            <Typo size={20} fontWeight={'200'}>
              creators' updates
            </Typo>
          </View>
          
          <View style={styles.buttonContainer}>
            {!loading && (
              <TouchableOpacity
                style={styles.customGoogleButton}
                onPress={handleSignIn}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  <Image
                    source={require('../assets/google-icon.png')}
                    style={styles.googleIcon}
                    resizeMode="contain"
                  />
                  <Typo size={16} fontWeight="600" style={styles.buttonText}>
                    Continue with Google
                  </Typo>
                </View>
              </TouchableOpacity>
            )}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Typo size={16} style={{ marginTop: 10 }}>
                  Signing in...
                </Typo>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingY._30,
  },
  welcomeSection: {
    alignItems: 'center',
    // gap: spacingY._20,
  },
  logo: {
    width: 200,
    height: 200,
    // marginBottom: spacingY._20,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    marginTop: spacingY._20,
  },
  customGoogleButton: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  buttonText: {
    color: '#FFFFFF',
  },
  googleButton: {
    width: '100%',
    height: 50,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingY._20,
  },
  itemText: {
    fontSize: 16,
    marginVertical: 4,
  },
});

export default Login;
