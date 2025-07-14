import { colors, radius } from "../constants/theme";
import { CustomButtonProps } from "../types";
import { verticalScale } from "../utils/styling";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Loading from "../components/Loading";

const Button = ({
  style,
  onPress,
  loading = false,
  children,
  disabled = false,
}: CustomButtonProps & { disabled?: boolean }) => {
    if(loading){
        return(
            <View style={[styles.button, style, {backgroundColor: 'transparent'}]}>
                <Loading />
            </View>
        )
    }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style, disabled && { backgroundColor: '#888' }]}
      disabled={disabled}
    >
        {children}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#0056B3',
        borderRadius: radius._17,
        borderCurve: "continuous",
        height: verticalScale(60),
        justifyContent: "center",
        alignItems: "center",
        width: '80%',
    }
});
