import LinearGradient from 'react-native-linear-gradient'
import { colors } from '../constants/theme'
import { ScreenWrapperProps } from '../types'
import React from 'react'
import { Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native'
// import LinearGradient from 'react-native-linear-gradient'

const { height } = Dimensions.get('window')

const ScreenWrapper = ({style, children}: ScreenWrapperProps) => {
    let paddingTop = Platform.OS === 'ios' ? height * 0.06 : 50;
    
    return (
        <LinearGradient
            colors={['#0A1128', '#000000']}
            start={{ x: 0, y: 0 }} // Top center
            end={{ x: 0, y: 1 }}   // Bottom center
            style={[{
                paddingTop,
                flex: 1,
            }, style]}
        >
            <StatusBar barStyle="light-content" />
            {children}
        </LinearGradient>
    )
}

export default ScreenWrapper

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral900,
    }
})