import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';

const PLATFORMS = [ // array of all possible platforms
  { key: 'youtube', label: 'YouTube', icon: require('../assets/icons8-youtube-48.png'), color: '#00D2FF' },
  { key: 'twitch', label: 'Twitch', icon: require('../assets/icons8-twitch.gif'), color: '#6441a5' },
  // Add more platforms as you implement them
];

type AddCreatorsRouteParams = {
  platforms?: string[];
};

const AddCreators = ({ navigation }: { navigation: any }) => {
  const route = useRoute<RouteProp<{ params: AddCreatorsRouteParams }, 'params'>>();
  const selectedPlatformKeys = (route.params?.platforms ?? ['youtube']) as string[]; // get the selected platforms from the route params, default is YouTube
  const filteredPlatforms = PLATFORMS.filter(p => selectedPlatformKeys.includes(p.key));

  const [selectedPlatform, setSelectedPlatform] = useState(filteredPlatforms[0]?.key || 'youtube');
  const { subscriptions, twitchFollows, selectedCreators, setSelectedCreators } = useAppContext();
  const { user } = useUser();
  const userId = user?._id; // Use from context

  // Get creators for the selected platform
  let creators: { id: string; name: string; avatar: string; platform: string; creatorId?: string }[] = [];
  if (selectedPlatform === 'youtube') {
    creators = subscriptions.map((item: any) => ({
      id: item.snippet.resourceId?.channelId, // Use the real YouTube channel ID
      creatorId: item.snippet.resourceId?.channelId, // Explicitly store as creatorId for backend polling
      name: item.snippet.title,
      avatar: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      platform: 'youtube',
    }));
  } else if (selectedPlatform === 'twitch') {
    creators = twitchFollows.map((item: any) => ({
      id: item.broadcaster_id,
      creatorId: item.broadcaster_id, // For consistency, also store as creatorId
      name: item.broadcaster_name,
      avatar: item.broadcaster_login
        ? `https://static-cdn.jtvnw.net/jtv_user_pictures/${item.broadcaster_login}-profile_image-300x300.png`
        : '',
      platform: 'twitch',
    }));
  }

  // This function toggles the selection state of a creator in the selectedCreators list.
  // If the creator is already selected (matched by id and platform), it removes them from the list.
  // If the creator is not selected, it adds them to the list.
  const toggleCreator = (creator: { id: string; name: string; avatar: string; platform: string }) => { 
    setSelectedCreators(prev =>
      prev.some(c => c.id === creator.id && c.platform === creator.platform) // check if the creator is already selected
        ? prev.filter(c => !(c.id === creator.id && c.platform === creator.platform)) // if the creator is already selected, remove them from the list
        : [...prev, creator] // if the creator is not selected, add them to the list
    );
  };

  // This function saves the selected creators to the server.
  const saveCreators = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }
    // Log creators for verification
    console.log('Creators to be saved:', selectedCreators);
    // Deduplicate creators by creatorId (or id) + platform
    const uniqueCreators = Array.from(
      new Map(
        selectedCreators.map(c => [
          `${(c as any).creatorId || c.id}-${c.platform}`,
          { ...c, creatorId: (c as any).creatorId || c.id, id: (c as any).creatorId || c.id }
        ])
      ).values()
    );
    try {
      const response = await fetch('http://192.168.0.108:4000/api/user/save-selected-creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, creators: uniqueCreators }),
      });
      const data = await response.json();
      if (data.success) {
        navigation.navigate('Tabs');
      } else {
        Alert.alert('Error', 'Failed to save creators');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save creators');
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.caretIcon}>‹</Text>
            </TouchableOpacity>
            <Typo size={26} fontWeight={'600'}>
              Add Creators
            </Typo>
          </View>

          {/* Platform Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformScroll}>
            {filteredPlatforms.map(platform => (
              <TouchableOpacity
                key={platform.key}
                style={[
                  styles.platformButton,
                  {
                    backgroundColor: selectedPlatform === platform.key ? platform.color : '#181C24',
                    borderColor: selectedPlatform === platform.key ? platform.color : '#222',
                  },
                ]}
                onPress={() => setSelectedPlatform(platform.key)}
                activeOpacity={0.8}
              >
                <Image source={platform.icon} style={styles.platformIcon} />
                <Typo style={{
                  color: '#fff',
                  fontWeight: '600',
                  marginLeft: 8,
                  fontSize: 18,
                }}>
                  {platform.label}
                </Typo>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Creators List */}
          <ScrollView style={{ marginTop: 24 }}>
            {creators.map(creator => (
              <View key={creator.id + creator.platform} style={styles.creatorCard}>
                <Image source={{ uri: creator.avatar }} style={styles.creatorAvatar} />
                <Typo style={styles.creatorName}>{creator.name}</Typo>
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    selectedCreators.some(c => c.id === creator.id && c.platform === creator.platform) && styles.addedButton,
                  ]}
                  onPress={() => toggleCreator(creator)}
                >
                  <Typo style={styles.addButtonText}>
                    {selectedCreators.some(c => c.id === creator.id && c.platform === creator.platform) ? '✓' : '+'}
                  </Typo>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={{ alignItems: 'center', width: '100%', marginBottom: 24 }}>
          <Button
            onPress={saveCreators}
            disabled={selectedCreators.length === 0}
          >
            <Typo>Save Creators</Typo>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddCreators;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  platformScroll: {
    flexGrow: 0,
    marginTop: 20,
  },
  platformButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    marginRight: 16,
    borderWidth: 2,
  },
  platformIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181C24',
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    justifyContent: 'space-between',
  },
  creatorAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 18,
    backgroundColor: '#222',
  },
  creatorName: {
    flex: 1,
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#0074E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addedButton: {
    backgroundColor: '#00D2FF',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
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
});
