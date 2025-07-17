import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import Avatar from '../components/Avatar';
import ScreenWrapper from '../components/ScreenWrapper';
import TopNav2 from '../components/TopNav2';
import ActivityCard from '../components/ActivityCard';

// Define the route prop type for this screen
 type CreatorDetailRouteProp = RouteProp<RootStackParamList, 'CreatorDetail'>;

const CreatorDetail: React.FC = () => {
  const route = useRoute<CreatorDetailRouteProp>();
  const { creator } = route.params;
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!creator.creatorId) return;
    fetch(`http://192.168.0.108:4000/api/user/activities?channelId=${creator.creatorId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.activities && data.activities.videos) {
          setActivities(data.activities.videos);
        }
      })
      .catch(err => {
        console.error('Failed to fetch creator activities:', err);
      });
  }, [creator.creatorId]);

  return (
    <ScreenWrapper>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
        <TopNav2 title="Creator Detail" />
        <View style={styles.container}>
          <Avatar uri={creator.avatar} size={100} />
          <Text style={styles.name}>{creator.name}</Text>
        </View>
        <Text style={styles.feedTitle}>Latest Videos</Text>
        <View style={styles.feedSection}>
          {activities.length === 0 ? (
            <View style={styles.emptyState}><Text style={styles.emptyText}>No activity yet</Text></View>
          ) : (
            activities.map((video: any) => (
              <ActivityCard
                key={video.id}
                creator={creator}
                videoTitle={video.title}
                videoThumbnail={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                publishedAt={video.publishedAt ? new Date(video.publishedAt).toLocaleString() : ''}
                videoUrl={`https://www.youtube.com/watch?v=${video.id}`}
              />
            ))
          )}
        </View>
    </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
      },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
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
});

export default CreatorDetail; 