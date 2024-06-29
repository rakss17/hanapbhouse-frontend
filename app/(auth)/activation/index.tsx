import { View, Text, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { Link, useRouter, useGlobalSearchParams } from "expo-router";
import {
  Colors,
  FontSizes,
  Styles,
  Viewport,
  customizeFont,
} from "@/styles/styles";
import { CircleShape } from "@/components/CircleShape";
import { StatusBar } from "expo-status-bar";

export default function Activation() {
  const fontLoaded = customizeFont();
  const router = useRouter();
  const params = useGlobalSearchParams();
  const slug3 = params.slug3;
  const slug4 = params.slug4;

  useEffect(() => {
    console.log("params", params);
    console.log("slug3", slug3);
    console.log("slug4", slug4);
  }, [params, slug3, slug4]);
  return (
    <>
      <StatusBar style="dark" />
      <View
        style={[
          Styles.container,
          {
            backgroundColor: Colors.primaryColor2,
            flex: 1,
            position: "relative",
            gap: 20,
          },
        ]}
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
                fontFamily: "InriaSans",
                fontSize: FontSizes.medium,
                width: Viewport.width * 0.7,
                textAlign: "center",
              }}
            >
              Activating your account. Please wait.
            </Text>
            <ActivityIndicator size={100} color={Colors.secondaryColor4} />
            <Text
              style={{
                fontFamily: "InriaSans",
                fontSize: FontSizes.normal,
                width: Viewport.width * 0.7,
                textAlign: "center",
              }}
            >
              Activating with UID: {slug3} Token: {slug4}
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
