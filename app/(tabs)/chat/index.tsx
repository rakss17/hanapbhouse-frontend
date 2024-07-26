import { FetchAllConversationAPI, serverSideUrl } from "@/components/Api";
import { ThemedContainer } from "@/components/ThemedContainer";
import { ThemedText } from "@/components/ThemedText";
import { MessageProps } from "@/interfaces/MessageProps";
import { Colors, FontSizes, Viewport } from "@/styles/styles";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function Chats() {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatsData, setChatsData] = useState<MessageProps[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );
  const userInfo = useSelector((state: RootState) => state.userInfo.data);
  const toast = useToast();

  const loadChatMessages = async () => {
    setChatsData([]);
    try {
      setIsLoading(true);
      const messages = await FetchAllConversationAPI(page, toast);
      console.log(messages);

      if (messages.message_data && messages.message_data.length > 0) {
        setChatsData(messages.message_data);

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
    }, [page])
  );

  const handleLoadMore = () => {
    if (nextPage) {
      setPage(nextPage);
    }
  };
  console.log("chat data", chatsData);
  return (
    <ThemedContainer>
      <View
        style={{
          width: Viewport.width * 1,
          height: Viewport.height * 0.12,
          borderBottomColor: Colors.primaryColor1,
          borderBottomWidth: 3,
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: Viewport.height * 0.01,
        }}
      >
        <ThemedText value="Messages" style={{ fontSize: FontSizes.normal }} />
      </View>
      {chatsData.length === 0 ? (
        <View
          style={{
            marginTop: Viewport.height * 0.1,
            width: Viewport.width * 1,
            height: Viewport.height * 0.8,
            alignItems: "center",
          }}
        >
          {isLoading ? (
            <ActivityIndicator
              size={50}
              color={
                isDarkMode ? Colors.secondaryColor1 : Colors.secondaryColor3
              }
            />
          ) : (
            <>
              <ThemedText
                value="There is no messages found."
                style={{
                  fontSize: FontSizes.small,
                  width: Viewport.width * 0.7,
                }}
              />
            </>
          )}
        </View>
      ) : (
        <>
          <FlatList
            data={chatsData}
            //   refreshControl={
            //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            //   }
            keyExtractor={(item: any) => item.id}
            contentContainerStyle={{
              marginTop: Viewport.height * 0.02,
              width: Viewport.width * 1,
              alignItems: "center",
            }}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                style={{
                  width: Viewport.width * 1,
                  height: Viewport.height * 0.1,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  paddingLeft: Viewport.width * 0.04,
                  gap: Viewport.width * 0.03,
                }}
                onPress={() => {
                  // router.push({
                  //   pathname: `/property_details`,
                  //   params: {
                  //     item: encodeURIComponent(JSON.stringify(item)),
                  //   },
                  // });
                }}
              >
                {userInfo?.id === item.sender ? (
                  <>
                    <Image
                      source={
                        item.receiver_image
                          ? { uri: `${serverSideUrl}${item.receiver_image}` }
                          : require("@/assets/images/no_user_image_found.jpg")
                      }
                      resizeMode="stretch"
                      style={{
                        width: Viewport.width * 0.15,
                        height: Viewport.height * 0.08,
                        borderRadius: 50,
                      }}
                    />
                    <View
                      style={{
                        width: Viewport.width * 0.67,
                      }}
                    >
                      <ThemedText
                        value={item.receiver_fullname}
                        style={{ fontSize: FontSizes.small }}
                      />
                      <Text
                        style={{
                          color: Colors.secondaryColor2,
                        }}
                      >
                        You: {item.content} • {item.send_timestamp}
                      </Text>
                    </View>
                    {item.is_read_by_receiver ? (
                      <Image
                        source={
                          item.receiver_image
                            ? { uri: `${serverSideUrl}${item.receiver_image}` }
                            : require("@/assets/images/no_user_image_found.jpg")
                        }
                        resizeMode="stretch"
                        style={{
                          width: Viewport.width * 0.04,
                          height: Viewport.height * 0.02,
                          borderRadius: 50,
                        }}
                      />
                    ) : (
                      <View></View>
                    )}
                  </>
                ) : (
                  <>
                    <Image
                      source={
                        item.sender_image
                          ? { uri: `${serverSideUrl}${item.sender_image}` }
                          : require("@/assets/images/no_user_image_found.jpg")
                      }
                      resizeMode="stretch"
                      style={{
                        width: Viewport.width * 0.15,
                        height: Viewport.height * 0.08,
                        borderRadius: 50,
                      }}
                    />
                    <View
                      style={{
                        width: Viewport.width * 0.65,
                      }}
                    >
                      <ThemedText
                        value={item.sender_fullname}
                        style={{
                          fontWeight: !item.is_read_by_receiver
                            ? "bold"
                            : "normal",
                          fontSize: FontSizes.small,
                        }}
                      />
                      <Text
                        style={{
                          color: !item.is_read_by_receiver
                            ? isDarkMode
                              ? Colors.secondaryColor1
                              : Colors.secondaryColor3
                            : Colors.secondaryColor2,
                          fontWeight: !item.is_read_by_receiver
                            ? "bold"
                            : "normal",
                        }}
                      >
                        {item.content} • {item.send_timestamp}
                      </Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              <>
                {isLoading && (
                  <ActivityIndicator
                    size={35}
                    color={
                      isDarkMode
                        ? Colors.secondaryColor1
                        : Colors.secondaryColor3
                    }
                  />
                )}
              </>
            }
          />
        </>
      )}
    </ThemedContainer>
  );
}
