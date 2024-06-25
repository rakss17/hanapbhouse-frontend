import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { ButtonProps } from "@/interfaces/ButtonProps";

export const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      text,
      text2,
      onPress,
      buttonStyle,
      textStyle,
      isLoading,
      loadingColor,
      loadingSize,
      loadingText,
      disabled,
    },
    ref
  ) => {
    return (
      <TouchableOpacity
        ref={ref}
        disabled={disabled}
        onPress={onPress}
        style={buttonStyle}
      >
        {isLoading ? (
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text style={textStyle}>{loadingText}</Text>
            <ActivityIndicator color={loadingColor} size={loadingSize} />
          </View>
        ) : (
          <Text style={textStyle}>{text}</Text>
        )}

        {text2 && <Text style={textStyle}>{text2}</Text>}
      </TouchableOpacity>
    );
  }
);
