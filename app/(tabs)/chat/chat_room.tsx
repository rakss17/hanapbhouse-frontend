import { useCallback, useEffect, useState } from "react";
import { ThemedContainer } from "@/components/ThemedContainer";
import { ThemedText } from "@/components/ThemedText";
import { Colors, FontSizes, Viewport } from "@/styles/styles";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { FetchConversationMessagesAPI, serverSideUrl } from "@/components/Api";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { RootState } from "@/lib/store";
import { AntDesign } from "@expo/vector-icons";
import { MessageProps } from "@/interfaces/MessageProps";

export default function ChatRoom() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [messageHeaderData, setMessageHeaderData] = useState<any>();
  const [messagesData, setMessagesData] = useState<MessageProps[]>([]);
  const [page, setPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const params = useLocalSearchParams<any>();
  const data = JSON.parse(decodeURIComponent(params.item));
  useEffect(() => {
    setMessageHeaderData(data);
  }, []);
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );
  const userInfo = useSelector((state: RootState) => state.userInfo.data);
  const toast = useToast();

  const loadChatMessages = async () => {
    try {
      setIsLoading(true);
      const messages = await FetchConversationMessagesAPI(
        page,
        toast,
        messageHeaderData?.room_name
      );

      if (messages.message_data && messages.message_data.length > 0) {
        setMessagesData((old) => {
          const newData = messages.message_data.filter(
            (newItem: any) => !old.some((oldItem) => oldItem.id === newItem.id)
          );
          return [...old, ...newData];
        });
        setNextPage(messages.next_page);
      }
    } catch (error) {
      console.error("Error loading chats data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadChatMessages();
    }, [page, messageHeaderData?.room_name])
  );

  const handleLoadMore = () => {
    if (nextPage) {
      setPage(nextPage);
    }
  };

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
        <FlatList
          data={messagesData}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{
            marginTop: Viewport.height * 0.02,
            width: Viewport.width * 1,
            alignItems: "center",
            gap: 20,
            paddingBottom: Viewport.height * 0.05,
          }}
          inverted
          renderItem={({ item }: any) => (
            <Pressable
              style={{
                alignItems:
                  userInfo?.id === item.sender ? "flex-end" : "flex-start",
                width: Viewport.width * 1,
                paddingHorizontal: 15,
              }}
            >
              <Text
                style={{
                  backgroundColor:
                    userInfo?.id === item.sender
                      ? Colors.primaryColor1
                      : isDarkMode
                      ? Colors.secondaryColor4
                      : Colors.secondaryColor2,
                  padding: 15,
                  borderRadius: 20,
                  color:
                    userInfo?.id === item.sender
                      ? Colors.secondaryColor1
                      : isDarkMode
                      ? Colors.secondaryColor1
                      : Colors.secondaryColor3,
                  maxWidth: Viewport.width * 0.5,
                }}
              >
                {item.content}
              </Text>
              <ThemedText
                value={item.send_timestamp}
                style={{ paddingHorizontal: 15 }}
              />
            </Pressable>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            <>
              {isLoading && (
                <ActivityIndicator
                  size={35}
                  color={
                    isDarkMode ? Colors.secondaryColor1 : Colors.secondaryColor3
                  }
                />
              )}
            </>
          }
        />
      </ThemedContainer>
    </>
  );
}
