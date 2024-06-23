import { ViewStyle, StyleProp } from "react-native";

export interface InputFieldProps {
  value: string;
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  autoCapitalize?: any;
  style?: StyleProp<ViewStyle>;
  floatingPlaceHolder?: boolean;
  floatingLightColor?: boolean;
  floatingDarkColor?: boolean;
}
