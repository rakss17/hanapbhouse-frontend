import { useFonts } from "expo-font";
import { Dimensions, StyleSheet } from "react-native";

export const Viewport = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};
export const Colors = {
  primaryColor1: "#BC723C",
  primaryColor2: "#F1F0F0",
  primaryColor3: "#FFA800",
  primaryColor4: "#540EEB",
  secondaryColor1: "#FFFFFF",
  secondaryColor2: "#A7A7A7",
  secondaryColor3: "black",
  secondaryColor4: "#646464",
  errorColor: "#E80101",
};
export const FontSizes = {
  tiny: Viewport.width * 0.03,
  small: Viewport.width * 0.04,
  normal: Viewport.width * 0.05,
  medium: Viewport.width * 0.06,
  large: Viewport.width * 0.08,
  extraLarge: Viewport.width * 0.1,
};

export const Styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: Viewport.width * 1.0,
    height: Viewport.height * 1.0,
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textError: {
    color: "red",
    fontSize: FontSizes.tiny,
  },
});

export const customizeFont = () => {
  return useFonts({
    InriaSans: require("../assets/fonts/InriaSans/InriaSans-Regular.otf"),
    Inter: require("../assets/fonts/Inter/Inter-Regular.otf"),
  });
};
