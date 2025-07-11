import { colors } from '../constants/theme'
import React, { useEffect } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import BottomTabs from '../components/BottomTabs';

type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const Splash = ({ navigation }: SplashProps) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login')
    }, 4000);
  }, [navigation])
  return (
    <View style={styles.container}>
      <Image 
        style= {styles.logo}
        resizeMode='contain'
        source={require('../assets/icon-mascot.png')}
      />
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
    container: {
      // marginTop: 50,
      // marginHorizontal: 20,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.neutral900,
        },
        logo: {
      height: '20%',
      aspectRatio: 1,
        }
    })

