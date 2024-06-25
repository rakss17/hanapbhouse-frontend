import { ViewStyle, StyleProp, TextStyle } from "react-native";

export interface ButtonProps {
  text: string;
  text2?: string;
  onPress?: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  loadingColor?: string;
  loadingSize?: number;
  loadingText?: string;
  disabled?: boolean;
}
