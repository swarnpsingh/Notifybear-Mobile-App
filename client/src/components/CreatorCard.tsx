import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image, ImageBackground } from 'react-native';
import Avatar from './Avatar';

interface CreatorCardProps {
  creator: {
    name: string;
    avatar: string;
    [key: string]: any;
  };
  videoThumbnail: string;
  videoTitle: string;
  clicks: string;
  timeAgo: string;
  platform: 'youtube' | 'twitch';
  onPress: () => void;
}

const platformIcons: Record<string, any> = {
  youtube: require('../assets/icons8-youtube-48.png'),
  twitch: require('../assets/icons8-twitch.gif'),
  // Add more as needed
};

const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  videoThumbnail,
  videoTitle,
  clicks,
  timeAgo,
  platform,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <ImageBackground source={{ uri: videoThumbnail }} style={styles.thumbnail} imageStyle={styles.thumbnailImage}>
        <View style={styles.platformIconWrapper}>
          <Image source={platformIcons[platform]} style={styles.platformIcon} />
        </View>
        <View style={styles.bottomBar}>
          <Avatar uri={creator.avatar} size={36} />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>{videoTitle}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>{creator.name}</Text>
              <Text style={styles.meta}> • {clicks} Clicks</Text>
              <Text style={styles.meta}> • {timeAgo}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    margin: 12,
    backgroundColor: '#181818',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  thumbnail: {
    width: 340,
    height: 250,
    justifyContent: 'flex-end',
  },
  thumbnailImage: {
    borderRadius: 18,
  },
  platformIconWrapper: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    zIndex: 2,
  },
  platformIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20,20,20,0.95)',
    padding: 6,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  info: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  meta: {
    color: '#ccc',
    fontSize: 13,
    marginRight: 6,
  },
});

export default CreatorCard; 