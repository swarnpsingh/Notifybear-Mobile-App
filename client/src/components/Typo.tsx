import { colors } from '../constants/theme'
import { TypoProps } from '../types'
import { verticalScale } from '../utils/styling'
import React from 'react'
import { StyleSheet, Text, TextStyle } from 'react-native'

const Typo = ({
  size,
  color = colors.text,
  fontWeight = "400",
  children,
  style,
  textProps
}: TypoProps) => { // Define a functional component that takes size, color, fontWeight, children, style, and textProps as props

  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size): verticalScale(18), // Set font size based on the size prop or default to 18
    color, // Set text color based on the color prop
    fontWeight, // Set font weight based on the fontWeight prop
  }

  return <Text style = {[textStyle, style]} {...textProps}>{children}</Text> // Render a Text component with the combined styles and children

}

export default Typo

const styles = StyleSheet.create({})