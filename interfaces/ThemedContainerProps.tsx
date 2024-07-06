import { ViewStyle, StyleProp } from "react-native";
import { ReactNode } from "react";

export interface ThemedContainerProps {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}
