import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { ButtonProps } from "@/interfaces/ButtonProps";

export const Button: React.FC<ButtonProps> = ({
  text,
  text2,
  onPress,
  buttonStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>{text}</Text>
      {text2 && <Text style={textStyle}>{text2}</Text>}
    </TouchableOpacity>
  );
};
