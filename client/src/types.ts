import React, { ReactNode } from "react";
import {
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle
} from "react-native";

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
};

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
};

export type BackButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
};

export type CustomButtonProps = {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  children: ReactNode;
};

export type InputProps = {
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  icon?: ReactNode;
  inputRef?: any;
} & TextInputProps;

