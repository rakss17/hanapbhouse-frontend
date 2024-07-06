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
import Feather from "@expo/vector-icons/Feather";
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
  showSoftInputOnFocus,
  isPressable,
  isFocusPressable,
  onPressableFocus,
  hasSearchIcon,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const animatedIsFocused = useRef(
    new Animated.Value(hasValue || isFocused ? 1 : 0)
  ).current;
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const inputRef = useRef<TextInput>(null);

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
  } else if (colors?.includes("light")) {
    placeholderTextColor = Colors.secondaryColor2;
  } else if (colors?.includes("dark")) {
    placeholderTextColor = Colors.secondaryColor4;
  } else {
    placeholderTextColor = undefined;
  }

  const onPressableFocusWrapper = () => {
    if (onPressableFocus) {
      onPressableFocus();
      handleFocus();
    }
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (inputRef.current?.isFocused()) {
        inputRef.current.blur();
        return true;
      }
      return false;
    };

    if (!isFocusPressable) {
      handleBackPress();
    }
  }, [!isFocusPressable]);

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
            colors?.includes("light") && {
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
            colors?.includes("dark") && {
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
            colors?.includes("error") && {
              position: "absolute",
              left: hasValue || isFocused ? 0 : 10,
              color:
                hasValue || isFocused ? Colors.errorColor : Colors.errorColor,
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
      {hasSearchIcon && (
        <>
          {colors?.includes("light") && (
            <Feather
              name="search"
              size={20}
              color={
                hasValue || isFocused
                  ? Colors.secondaryColor1
                  : Colors.secondaryColor2
              }
              style={{
                position: "absolute",
                left: Viewport.width * 0.07,
                zIndex: 5,
              }}
            />
          )}
          {colors?.includes("dark") && (
            <Feather
              name="search"
              size={20}
              color={
                hasValue || isFocused
                  ? Colors.secondaryColor3
                  : Colors.secondaryColor4
              }
              style={{
                position: "absolute",
                left: Viewport.width * 0.07,
                zIndex: 5,
              }}
            />
          )}
          {colors?.includes("error") && (
            <Feather
              name="search"
              size={20}
              color={
                hasValue || isFocused ? Colors.errorColor : Colors.errorColor
              }
              style={{
                position: "absolute",
                left: Viewport.width * 0.07,
                zIndex: 5,
              }}
            />
          )}
        </>
      )}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          setHasValue(!!text);
        }}
        showSoftInputOnFocus={showSoftInputOnFocus}
        placeholder={floatingPlaceHolder ? "" : placeholder}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={[
          style,
          colors?.includes("light") && {
            color: Colors.secondaryColor1,
            fontSize: FontSizes.small,
          },
          colors?.includes("light-error") && {
            color: Colors.secondaryColor1,
            fontSize: FontSizes.small,
          },
          colors?.includes("dark") && {
            color: Colors.secondaryColor3,
            fontSize: FontSizes.small,
          },
          colors?.includes("dark-error") && {
            color: Colors.secondaryColor3,
            fontSize: FontSizes.small,
          },
          floatingPlaceHolder &&
            colors?.includes("light") && {
              borderBottomWidth: 2,
              borderColor:
                hasValue || isFocused
                  ? Colors.secondaryColor1
                  : Colors.secondaryColor2,
            },
          floatingPlaceHolder &&
            colors?.includes("dark") && {
              borderBottomWidth: 2,
              borderColor:
                hasValue || isFocused
                  ? Colors.secondaryColor3
                  : Colors.secondaryColor4,
            },
          floatingPlaceHolder &&
            colors?.includes("error") && {
              borderBottomWidth: 2,
              borderColor:
                hasValue || isFocused ? Colors.errorColor : Colors.errorColor,
            },
        ]}
        onFocus={isPressable ? onPressableFocusWrapper : handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry && !showPassword}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={{ position: "absolute", left: Viewport.width * 0.7 }}
          onPress={togglePasswordVisibility}
        >
          {colors?.includes("light") && (
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
          {colors?.includes("dark") && (
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
          {colors?.includes("error") && (
            <Entypo
              name={showPassword ? "eye-with-line" : "eye"}
              size={24}
              color={
                hasValue || isFocused ? Colors.errorColor : Colors.errorColor
              }
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
