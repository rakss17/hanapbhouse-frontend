import { View, Text } from "react-native";
import {
  Colors,
  FontSizes,
  Styles,
  Viewport,
  customizeFont,
} from "@/styles/styles";
import { CircleShape } from "@/components/CircleShape";
import { StatusBar } from "expo-status-bar";

export default function Success() {
  const fontLoaded = customizeFont();

  return (
    <>
      <StatusBar style="dark" />
      <View
        style={{
          alignItems: "center",
          backgroundColor: Colors.primaryColor2,
          flex: 1,
          position: "relative",
          gap: 15,
        }}
      >
        <CircleShape
          style={{
            backgroundColor: Colors.primaryColor3,
            bottom: Viewport.height * 0.9,
            left: Viewport.width * 0.65,
          }}
        />
        {fontLoaded[0] && (
          <>
            <Text
              style={{
                marginTop: Viewport.width * 0.3,
                fontFamily: "Inter",
                fontSize: FontSizes.large,
                width: Viewport.width * 0.85,
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              👋 Success!{" "}
            </Text>
            <Text
              style={{
                fontFamily: "Inter",
                fontSize: FontSizes.normal,
                width: Viewport.width * 0.85,
                textAlign: "left",
              }}
            >
              Please check your email to activate your account and start using
              HanapBHouse App. Thank you!
            </Text>
          </>
        )}

        <CircleShape
          style={{
            backgroundColor: Colors.primaryColor4,
            top: Viewport.height * 0.9,
            right: Viewport.width * 0.65,
          }}
        />
      </View>
    </>
  );
}
