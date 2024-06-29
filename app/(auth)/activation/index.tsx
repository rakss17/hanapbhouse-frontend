import { View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import {
  Colors,
  FontSizes,
  Styles,
  Viewport,
  customizeFont,
} from "@/styles/styles";
import { CircleShape } from "@/components/CircleShape";
import { StatusBar } from "expo-status-bar";
import { UserActivation } from "@/components/Api";

export default function Activation() {
  const fontLoaded = customizeFont();
  const [isLoading, setIsLoading] = useState(true);
  const [activation, setActivation] = useState({
    uid: "",
    token: "",
  });
  const toast = useToast();
  const router = useRouter();
  const params = useGlobalSearchParams();
  const uid = params.slug3;
  const token = params.slug4;

  useEffect(() => {
    if (uid && token) {
      setActivation({
        ...activation,
        uid: String(uid),
        token: String(token),
      });
    }
  }, [uid, token]);

  useEffect(() => {
    if (activation && toast) {
      UserActivation(activation, toast, router, setIsLoading);
    }
  }, [activation]);

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
            <ActivityIndicator
              animating={isLoading}
              size={100}
              color={Colors.secondaryColor4}
            />
            <Text
              style={{
                fontFamily: "InriaSans",
                fontSize: FontSizes.normal,
                width: Viewport.width * 0.7,
                textAlign: "center",
              }}
            >
              Activating with UID: {uid} Token: {token}
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
