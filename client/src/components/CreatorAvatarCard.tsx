import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Avatar from './Avatar';

interface CreatorAvatarCardProps {
  creator: {
    name: string;
    avatar: string;
    [key: string]: any;
  };
  onPress: () => void;
}

const CreatorAvatarCard: React.FC<CreatorAvatarCardProps> = ({ creator, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Avatar uri={creator.avatar} size={56} />
      <Text style={styles.name} numberOfLines={1}>{creator.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 64,
  },
  name: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    width: 56,
  },
});

export default CreatorAvatarCard; 