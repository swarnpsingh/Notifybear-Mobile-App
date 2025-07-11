import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';
import Typo from '../components/Typo';
import ScreenWrapper from '../components/ScreenWrapper';
import TopNav2 from '../components/TopNav2';
import { useFocusEffect } from '@react-navigation/native';

const ConnectedPlatforms = ({ navigation }: { navigation: any }) => {
  const { fetchYouTubeSubscriptions, fetchTwitchFollows } = useAppContext();
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(
    new Set(),
  );

  // Check for Twitch token when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const checkTwitchToken = async () => {
        const { getToken } = require('../utils/storage');
        const twitchToken = await getToken('twitch_token');
        if (twitchToken && !selectedPlatforms.has('twitch')) {
          setSelectedPlatforms(prev => new Set([...prev, 'twitch']));
          Alert.alert('Success', 'Twitch connected successfully!');
        }
      };
      checkTwitchToken();
    }, [selectedPlatforms])
  );
  return (
    <ScreenWrapper>
      <TopNav2 title="Connect Platforms" />
      <View style={styles.container}>
        <Text style={styles.heading}>Connected Platforms</Text>

        <PlatformCard
          name="YouTube"
          connected={selectedPlatforms.has('youtube')}
          onConnect={() => {
            setSelectedPlatforms(prev => new Set([...prev, 'youtube']));
            Alert.alert('Success', 'YouTube selected!');
          }}
        />

        <PlatformCard
          name="Instagram"
          connected={selectedPlatforms.has('instagram')}
          onConnect={() => {
            setSelectedPlatforms(prev => new Set([...prev, 'instagram']));
            Alert.alert('Success', 'Instagram selected!');
          }}
        />

        <PlatformCard
          name="X (Twitter)"
          connected={selectedPlatforms.has('twitter')}
          onConnect={() => {
            setSelectedPlatforms(prev => new Set([...prev, 'twitter']));
            Alert.alert('Success', 'X (Twitter) selected!');
          }}
        />

        <PlatformCard
          name="Twitch"
          connected={selectedPlatforms.has('twitch')}
          onConnect={() => {
            navigation.navigate('OAuth', { platform: 'twitch' });
          }}
        />

        <Button onPress={async () => {
          try {
            // Fetch data for selected platforms
            if (selectedPlatforms.has('youtube')) {
              await fetchYouTubeSubscriptions();
            }
            if (selectedPlatforms.has('twitch')) {
              await fetchTwitchFollows();
            }
            navigation.replace('Tabs');
          } catch (error) {
            Alert.alert('Error', 'Failed to fetch data. Please try again.');
          }
        }}>
          <Typo>Proceed</Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

const PlatformCard = ({
  name,
  connected = false,
  onConnect,
}: {
  name: string;
  connected?: boolean;
  onConnect: () => void;
}) => (
  <View style={styles.card}>
    <Text style={styles.name}>{name}</Text>
    {connected ? (
      <Text style={styles.connected}>Connected ✅</Text>
    ) : (
      <Button onPress={onConnect}>
        <Text style={styles.buttonText}>Connect</Text>
      </Button>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  card: {
    marginBottom: 16,
    padding: 20,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  name: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
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
