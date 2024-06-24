import { ViewStyle, StyleProp, KeyboardTypeOptions } from "react-native";

export interface InputFieldProps {
  value: string;
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  style?: StyleProp<ViewStyle>;

  floatingPlaceHolder?: boolean;

  keyboardType?: KeyboardTypeOptions;
  colors?: "dark" | "light" | "error";
}
