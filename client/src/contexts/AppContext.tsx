import React, { createContext, useContext, useState, useCallback } from 'react';
import { getToken, removeToken } from '../utils/storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type Creator = { id: string; name: string; avatar: string; platform: string };

type AppContextType = {
  subscriptions: any[];
  twitchFollows: any[];
  fetchYouTubeSubscriptions: () => Promise<any[]>;
  fetchTwitchFollows: () => Promise<any[]>;
  setSubscriptions: React.Dispatch<React.SetStateAction<any[]>>;
  setTwitchFollows: React.Dispatch<React.SetStateAction<any[]>>;
  selectedCreators: Creator[];
  setSelectedCreators: React.Dispatch<React.SetStateAction<Creator[]>>;
};

const AppContext = createContext<AppContextType>({
  subscriptions: [],
  twitchFollows: [],
  fetchYouTubeSubscriptions: async () => [],
  fetchTwitchFollows: async () => [],
  setSubscriptions: () => {},
  setTwitchFollows: () => {},
  selectedCreators: [],
  setSelectedCreators: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [twitchFollows, setTwitchFollows] = useState<any[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<Creator[]>([]);

  const fetchYouTubeSubscriptions = useCallback(async () => {
    let allSubscriptions: any[] = []; // all subscriptions
    let nextPageToken: string | undefined = undefined; // next page token

    // Always get a fresh token
    const { accessToken } = await GoogleSignin.getTokens();
    console.log('Access token available:', !!accessToken);
    if (!accessToken) {
      console.error('No access token available');
      return [];
    }

    try {
      do {
        const url = `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
        console.log('Fetching from URL:', url);
        
        const res: Response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        
        const data: any = await res.json();
        console.log('YouTube API response:', data);
        
        if (data?.error) {
          console.error('YouTube API Error:', data.error);
          break;
        }
        
        if (data?.items) {
          allSubscriptions.push(...data.items);
          console.log('Added items, total count:', allSubscriptions.length);
        }
        
        nextPageToken = data.nextPageToken;
        console.log('Next page token:', nextPageToken);
      } while (nextPageToken);

      console.log('Final subscriptions count:', allSubscriptions.length);
      setSubscriptions(allSubscriptions);
      return allSubscriptions;
    } catch (err) {
      console.error('Failed to fetch YouTube subscriptions:', err);
      return [];
    }
  }, []);
  
  const fetchTwitchFollows = useCallback(async () => {
    const twitchToken = await getToken('twitch_token');
    if (!twitchToken) {
      console.log('No Twitch token found - skipping Twitch data fetch');
      return [];
    }
  
    try {
      // First, get the current user's ID
      const userRes = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          'Authorization': `Bearer ${twitchToken}`,
          'Client-Id': 'yvkrd09j6mx04gtmm66e9zebhh4gcu',
        },
      });
      const userData = await userRes.json();
      console.log('Twitch User Data:', userData);
      
      if (!userData.data?.[0]?.id) {
        console.error('No user data found');
        return [];
      }
      
      const userId = userData.data[0].id;
      console.log('User ID:', userId);

      // Use the new follows endpoint
      const followsRes = await fetch(`https://api.twitch.tv/helix/channels/followed?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${twitchToken}`,
          'Client-Id': 'yvkrd09j6mx04gtmm66e9zebhh4gcu',
        },
      });
  
      const data = await followsRes.json();
      console.log('Twitch Follows:', data);
  
      const follows = data.data || [];
      setTwitchFollows(follows);
      return follows;
    } catch (err) {
      console.error('Failed to fetch Twitch follows:', err);
      return [];
    }
  }, []);



  return (
    <AppContext.Provider value={{ 
      subscriptions, 
      twitchFollows, 
      setSubscriptions, 
      setTwitchFollows, 
      fetchYouTubeSubscriptions, 
      fetchTwitchFollows, 
      selectedCreators,
      setSelectedCreators,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
