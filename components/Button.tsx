import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { ButtonProps } from "@/interfaces/ButtonProps";

export const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  ({ text, text2, onPress, buttonStyle, textStyle }, ref) => {
    return (
      <TouchableOpacity ref={ref} onPress={onPress} style={buttonStyle}>
        <Text style={textStyle}>{text}</Text>
        {text2 && <Text style={textStyle}>{text2}</Text>}
      </TouchableOpacity>
    );
  }
);
