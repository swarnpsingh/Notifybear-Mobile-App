import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface AvatarProps {
  uri?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ uri, size = 56 }) => {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}> 
      {uri ? (
        <Image source={{ uri }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: '#555',
  },
});

export default Avatar; 