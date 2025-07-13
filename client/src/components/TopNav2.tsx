import React, { ReactNode } from 'react'
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { verticalScale } from '../utils/styling'
import Typo from './Typo'

type TopNav2Props = {
  title: ReactNode;
};

const TopNav2 = ({ title }: TopNav2Props) => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../assets/icon-mascot.png')} style={styles.logo} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Typo style={styles.title}>{title}</Typo>
      </View>
    </View>
  )
}

export default TopNav2

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent', // Fully transparent
    position: 'relative',
  },
  backButton: {
    zIndex: 2,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
  },
  logo: {
    width: 45,
    height: 45,
  },
})