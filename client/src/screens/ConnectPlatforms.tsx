import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';
import Typo from '../components/Typo';
import ScreenWrapper from '../components/ScreenWrapper';
import TopNav2 from '../components/TopNav2';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { colors } from '../constants/theme';
import { useUser } from '../contexts/UserContext';

const ConnectedPlatforms = ({ navigation }: { navigation: any }) => {
  const route = useRoute();
  const { fetchYouTubeSubscriptions, fetchTwitchFollows } = useAppContext();
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(
    new Set(),
  );
  const { user } = useUser();
  // const userId = (route.params && (route.params as any).userId) || undefined; // REMOVE THIS

  // Check for tokens when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const checkTokens = async () => {
        const { getToken } = require('../utils/storage');
        
        // Check Twitch token
        const twitchToken = await getToken('twitch_token');
        if (twitchToken && !selectedPlatforms.has('twitch')) {
          setSelectedPlatforms(prev => new Set([...prev, 'twitch']));
        }
      };
      checkTokens();
    }, [selectedPlatforms]),
  );
  
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.caretIcon}>‹</Text>
            </TouchableOpacity>
            <Typo size={26} fontWeight={'600'}>
              Add Social Platforms
            </Typo>
          </View>

          <TextInput
            placeholder="🔍 Search Apps"
            style={styles.searchInput}
            placeholderTextColor={'CCCCCC'}
          />
          <View style={styles.platformGrid}>
            {[
              {
                key: 'youtube',
                label: 'YouTube',
                icon: require('../assets/icons8-youtube-48.png'),
              },
              {
                key: 'instagram',
                label: 'Instagram',
                icon: require('../assets/icons8-instagram-logo-48.png'),
              },
              {
                key: 'twitter',
                label: 'X (Twitter)',
                icon: require('../assets/icons8-x-logo-50.png'),
              },
              {
                key: 'twitch',
                label: 'Twitch',
                icon: require('../assets/icons8-twitch.gif'),
              },
            ].map(platform => (
        <PlatformCard
                key={platform.key}
                name={platform.label}
                icon={platform.icon}
                selected={selectedPlatforms.has(platform.key)} // check if the platform is selected
                onPress={() => {
                  setSelectedPlatforms(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(platform.key)) {
                      newSet.delete(platform.key);
                    } else {
                      newSet.add(platform.key);
                    }
                    return newSet;
                  });
                  if (platform.key === 'twitter')
            navigation.navigate('OAuthTwitter');
                  if (platform.key === 'twitch')
            navigation.navigate('OAuth', { platform: 'twitch' });
          }}
        />
            ))}
          </View>
        </View>
        <View style={{ alignItems: 'center', width: '100%', marginBottom: 24 }}>
          <Button
            onPress={async () => {
          try {
            // Fetch data for selected platforms
            if (selectedPlatforms.has('youtube')) {
              await fetchYouTubeSubscriptions();
            }
            if (selectedPlatforms.has('twitch')) {
              await fetchTwitchFollows();
            }
            // Only pass platforms, not userId
            navigation.navigate('AddCreators', { platforms: Array.from(selectedPlatforms) });
          } catch (error) {
            Alert.alert('Error', 'Failed to fetch data. Please try again.');
          }
            }}
          >
            <Typo>Proceed ➕</Typo>
        </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const PlatformCard = ({
  name,
  icon,
  selected = false,
  onPress,
}: {
  name: string;
  icon: any;
  selected?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: selected ? '#00D2FF' : 'white' }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={icon}
        style={{ width: 48, height: 48, marginBottom: 8 }}
        resizeMode="contain"
      />
      <Typo
        style={{
          ...styles.name,
          color: selected ? 'black' : 'black',
          textAlign: 'center',
          fontSize: 16,
          marginTop: 0,
        }}
      >
        {name}
      </Typo>
  </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 5,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  caretIcon: {
    fontSize: 28,
    color: 'white',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.neutral700,
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    marginTop: 20,
    height: 50,
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '30%', // 3 cards per row
    aspectRatio: 1, // makes the card square
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: 'white',
  },
  name: {
    fontSize: 18,
    color: 'black',
    // fontWeight: 'bold',
  },
  connected: {
    color: 'green',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConnectedPlatforms;
