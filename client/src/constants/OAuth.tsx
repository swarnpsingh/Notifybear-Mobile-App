import React from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { storeToken } from '../utils/storage';

export default function OAuth() {
  const route = useRoute();
  const navigation = useNavigation() as any;
  const { platform } = route.params as { platform: string };
  
  const clientId = 'yvkrd09j6mx04gtmm66e9zebhh4gcu';
  const redirectUri = 'https://notifybear.com/auth/twitch/callback';
  const scopes = 'user:read:follows';

  const twitchOAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${encodeURIComponent(scopes)}`;

  const onNavChange = async ({ url }: any) => {
    if (url.startsWith(redirectUri) && url.includes('#access_token=')) { // if url starts with redirect uri and includes access token
      const accessToken = url.split('#access_token=')[1].split('&')[0]; // get access token

      console.log('Twitch Access Token:', accessToken);
      await storeToken(accessToken, 'twitch_token'); // save to async storage with key

      navigation.goBack(); // Go back to ConnectPlatforms
    }
  };

  return <WebView source={{ uri: twitchOAuthUrl }} onNavigationStateChange={onNavChange} />;
}
