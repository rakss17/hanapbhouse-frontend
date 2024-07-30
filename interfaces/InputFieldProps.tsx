import {
  ViewStyle,
  TextStyle,
  StyleProp,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from "react-native";

export interface InputFieldProps {
  value: string;
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  style?: StyleProp<ViewStyle | TextStyle>;
  floatingPlaceHolder?: boolean;
  keyboardType?: KeyboardTypeOptions;
  colors?: ("dark" | "light" | "error" | "light-error" | "dark-error")[];
  showSoftInputOnFocus?: boolean;
  isPressable?: boolean;
  isFocusPressable?: boolean;
  onPressableFocus?: () => void;
  hasSearchIcon?: boolean;
  searchIconLeft?: any;
  onContentSizeChange?: (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => void;
  multiline?: boolean;
}
