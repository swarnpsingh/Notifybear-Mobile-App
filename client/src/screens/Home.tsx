import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import Typo from '../components/Typo';
import TopNav2 from '../components/TopNav2';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import { useUser } from '../contexts/UserContext';
import CreatorCard from '../components/CreatorCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import CreatorAvatarCard from '../components/CreatorAvatarCard';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { setSubscriptions } = useAppContext();
  const { user } = useUser();
  const [activityFeed, setActivityFeed] = useState([]);

  useEffect(() => {
    fetch('http://192.168.0.108:4000/api/user/youtube/activity-feed')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.feed)) {
          setActivityFeed(data.feed);
        }
      })
      .catch(err => {
        console.error('Failed to fetch activity feed:', err);
      });
  }, []);

  // Map activityFeed by creatorId for quick lookup
  const latestVideoByCreator: Record<string, any> = {};
  activityFeed.forEach((item: any) => {
    if (item.creator && item.creator.creatorId) {
      latestVideoByCreator[item.creator.creatorId] = item;
    }
  });

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
      setSubscriptions([]); // Clear subscriptions on logout
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreatorPress = (creator: any) => {
    navigation.navigate('CreatorDetail', { creator });
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
        <TopNav2 title="Home" />
        {/* Creators Stories Section */}
        <View style={styles.storiesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
            {user && Array.isArray(user.selectedCreators) && user.selectedCreators.length > 0 ? (
              user.selectedCreators.map((creator: any, idx: number) => (
                <CreatorAvatarCard
                  key={creator.id || idx}
                  creator={creator}
                  onPress={() => handleCreatorPress(creator)}
                />
              ))
            ) : (
              <View style={styles.emptyState}><Text style={styles.emptyText}>No creators selected</Text></View>
            )}
          </ScrollView>
        </View>
        {/* Activity Feed Section */}
        <Text style={styles.feedTitle}>Latest Videos</Text>
        <View style={styles.feedSection}>
          {activityFeed.length === 0 ? (
            <View style={styles.emptyState}><Text style={styles.emptyText}>No activity yet</Text></View>
          ) : (
            activityFeed.map((activity: any) => (
              <CreatorCard
                key={activity.videoId}
                creator={activity.creator}
                videoThumbnail={activity.videoThumbnail}
                videoTitle={activity.videoTitle}
                clicks={activity.clicks || '3.4K'}
                timeAgo={activity.publishedAt ? new Date(activity.publishedAt).toLocaleString() : '15 mins ago'}
                platform={activity.creator.platform || 'youtube'}
                onPress={() => handleCreatorPress(activity.creator)}
              />
            ))
          )}
        </View>
        <View style={styles.logoutSection}>
          <Button onPress={handleLogout}>
            <Typo>Logout</Typo>
          </Button>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  storiesSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  storiesScroll: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  feedTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  feedSection: {
    marginBottom: 24,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logoutSection: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
});

export default Home;
