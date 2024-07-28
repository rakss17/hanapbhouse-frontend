import { useEffect, useState } from "react";
import { ThemedContainer } from "@/components/ThemedContainer";
import { ThemedText } from "@/components/ThemedText";
import { Colors, FontSizes, Viewport } from "@/styles/styles";
import { StatusBar } from "expo-status-bar";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { serverSideUrl } from "@/components/Api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { AntDesign } from "@expo/vector-icons";

export default function ChatRoom() {
  const [messageHeaderData, setMessageHeaderData] = useState<any>();
  const params = useLocalSearchParams<any>();
  const data = JSON.parse(decodeURIComponent(params.item));
  useEffect(() => {
    setMessageHeaderData(data);
  }, []);
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );
  const userInfo = useSelector((state: RootState) => state.userInfo.data);

  return (
    <>
      <StatusBar style="light" />
      <ThemedContainer>
        <View
          style={{
            width: Viewport.width * 1,
            height: Viewport.height * 0.12,
            borderBottomColor: Colors.primaryColor1,
            borderBottomWidth: 3,
            justifyContent: "flex-end",
            paddingBottom: Viewport.height * 0.01,
            backgroundColor: Colors.primaryColor1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: Viewport.width * 0.05,
              gap: 25,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <AntDesign name="arrowleft" size={30} color="white" />
            </TouchableOpacity>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
            >
              {userInfo?.id === messageHeaderData?.sender ? (
                <>
                  <Image
                    source={
                      messageHeaderData?.receiver_image
                        ? {
                            uri: `${serverSideUrl}${messageHeaderData?.receiver_image}`,
                          }
                        : require("@/assets/images/no_user_image_found.jpg")
                    }
                    resizeMode="stretch"
                    style={{
                      width: Viewport.width * 0.13,
                      height: Viewport.height * 0.06,
                      borderRadius: 50,
                    }}
                  />
                  <Text
                    style={{
                      color: Colors.secondaryColor1,
                      fontSize: FontSizes.small,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    {messageHeaderData?.receiver_fullname}
                  </Text>
                </>
              ) : (
                <>
                  <Image
                    source={
                      messageHeaderData?.sender_image
                        ? {
                            uri: `${serverSideUrl}${messageHeaderData?.sender_image}`,
                          }
                        : require("@/assets/images/no_user_image_found.jpg")
                    }
                    resizeMode="stretch"
                    style={{
                      width: Viewport.width * 0.11,
                      height: Viewport.height * 0.05,
                      borderRadius: 50,
                    }}
                  />
                  <Text
                    style={{
                      color: Colors.secondaryColor1,
                      fontSize: FontSizes.small,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    {messageHeaderData?.sender_fullname}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
      </ThemedContainer>
    </>
  );
}
