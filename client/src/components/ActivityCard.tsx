import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import Avatar from './Avatar';

interface ActivityCardProps {
  creator: {
    name: string;
    avatar: string;
  };
  videoTitle: string;
  videoThumbnail: string;
  publishedAt: string;
  videoUrl: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ creator, videoTitle, videoThumbnail, publishedAt, videoUrl }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar uri={creator.avatar} size={40} />
        <View style={styles.headerText}>
          <Text style={styles.creatorName}>{creator.name}</Text>
          <Text style={styles.publishedAt}>{publishedAt}</Text>
        </View>
      </View>
      <Image source={{ uri: videoThumbnail }} style={styles.thumbnail} />
      <Text style={styles.videoTitle} numberOfLines={2}>{videoTitle}</Text>
      <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(videoUrl)}>
        <Text style={styles.buttonText}>Watch</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#181818',
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    marginLeft: 10,
  },
  creatorName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  publishedAt: {
    color: '#aaa',
    fontSize: 12,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#222',
  },
  videoTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#FF0000',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ActivityCard; 