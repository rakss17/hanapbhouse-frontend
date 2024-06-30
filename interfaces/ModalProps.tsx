import { ViewStyle, StyleProp, TextStyle } from "react-native";
import { ReactNode } from "react";

export interface ModalProps {
  visible: boolean;
  animationType: "none" | "slide" | "fade";
  transparent: boolean;
  viewStyle?: StyleProp<ViewStyle>;
  hasHeader?: boolean;
  headerStyle?: StyleProp<TextStyle>;
  headerContent?: string;
  children?: ReactNode;
}
