import { useState, useEffect, useRef } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { InputFieldProps } from "@/interfaces/InputFieldProps";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors, FontSizes, Viewport } from "@/styles/styles";

export const InputField: React.FC<InputFieldProps> = ({
  value,
  placeholder,
  secureTextEntry = false,
  onChangeText,
  autoCapitalize,
  style,
  floatingPlaceHolder,
  keyboardType,
  colors,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const animatedIsFocused = useRef(
    new Animated.Value(hasValue || isFocused ? 1 : 0)
  ).current;
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: hasValue || isFocused ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(1, 1, 0.25, 1),
      useNativeDriver: false,
    }).start();
  }, [hasValue, isFocused]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  let placeholderTextColor;

  if (floatingPlaceHolder) {
    placeholderTextColor = "transparent";
  } else if (colors === "light") {
    placeholderTextColor = Colors.secondaryColor2;
  } else if (colors === "dark") {
    placeholderTextColor = Colors.secondaryColor4;
  } else {
    placeholderTextColor = undefined;
  }
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
      }}
    >
      {floatingPlaceHolder && (
        <Animated.Text
          style={[
            colors === "light" && {
              position: "absolute",
              left: hasValue || isFocused ? 0 : 10,
              color:
                hasValue || isFocused
                  ? Colors.secondaryColor1
                  : Colors.secondaryColor2,
              fontSize:
                hasValue || isFocused ? FontSizes.tiny : FontSizes.small,
              bottom: 30,
            },
            colors === "dark" && {
              position: "absolute",
              left: hasValue || isFocused ? 0 : 10,
              color:
                hasValue || isFocused
                  ? Colors.secondaryColor3
                  : Colors.secondaryColor4,
              fontSize:
                hasValue || isFocused ? FontSizes.tiny : FontSizes.small,
              bottom: 30,
            },
            {
              transform: [
                {
                  translateY: animatedIsFocused.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
              left: animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ]}
        >
          {placeholder}
        </Animated.Text>
      )}

      <TextInput
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          setHasValue(!!text);
        }}
        placeholder={floatingPlaceHolder ? "" : placeholder}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={[
          style,
          colors === "light" && {
            color: Colors.secondaryColor1,
            fontSize: FontSizes.small,
          },
          colors === "dark" && {
            color: Colors.secondaryColor3,
            fontSize: FontSizes.small,
          },
          floatingPlaceHolder &&
            colors === "light" && {
              borderBottomWidth: 2,
              borderColor:
                hasValue || isFocused
                  ? Colors.secondaryColor1
                  : Colors.secondaryColor2,
            },
          floatingPlaceHolder &&
            colors === "dark" && {
              borderBottomWidth: 2,
              borderColor:
                hasValue || isFocused
                  ? Colors.secondaryColor3
                  : Colors.secondaryColor4,
            },
        ]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry && !showPassword}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={{ position: "absolute", left: Viewport.width * 0.7 }}
          onPress={togglePasswordVisibility}
        >
          {colors === "light" && (
            <Entypo
              name={showPassword ? "eye-with-line" : "eye"}
              size={24}
              color={
                hasValue || isFocused
                  ? Colors.secondaryColor1
                  : Colors.secondaryColor2
              }
            />
          )}
          {colors === "dark" && (
            <Entypo
              name={showPassword ? "eye-with-line" : "eye"}
              size={24}
              color={
                hasValue || isFocused
                  ? Colors.secondaryColor3
                  : Colors.secondaryColor4
              }
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
