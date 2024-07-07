import { useEffect, useState, useMemo } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Image,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { CustomizedModal } from "@/components/CustomizedModat";
import { Colors, FontSizes, Viewport } from "@/styles/styles";
import {
  FetchPublicFeedsAPI,
  TokenRevalidation,
  serverSideMediaUrl,
  serverSideUrl,
} from "@/components/Api";
import { useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { InputField } from "@/components/InputField";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { RadioGroup } from "react-native-radio-buttons-group";
import { ThemedText } from "@/components/ThemedText";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { ThemedContainer } from "@/components/ThemedContainer";
import { ExternalLink } from "@/components/ExternalLink";
import Entypo from "@expo/vector-icons/Entypo";

export default function Index() {
  const [publicFeedData, setPublicFeedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUserSessionValidated, setIsUserSessionValidated] =
    useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isRestoringSessionLoading, setIsRestoringSessionLoading] =
    useState(false);
  const [isFilterationQueryPressed, setIsFilterationQueryPressed] =
    useState(false);
  const [selectedFilteredCategory, setSelectedFilteredCategory] = useState("");
  const [restoringMessage, setRestoringMessage] = useState("");
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );
  const userInfo = useSelector((state: RootState) => state.userInfo.data);
  const preferredArea = userInfo?.preferred_area;
  const loginInfo = useSelector(
    (state: RootState) => state.statusInfo.is_logged_in
  );

  useEffect(() => {
    if (loginInfo) {
      (async () => {
        const response = await TokenRevalidation(
          toast,
          router,
          setIsRestoringSessionLoading,
          setRestoringMessage,
          dispatch
        );
        setIsUserSessionValidated(response);
      })();
    }
  }, [loginInfo]);

  const translateY = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const { translationY } = event.nativeEvent;
        if (translationY > 0) {
          translateY.setValue(0);
        }
      },
    }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY } = event.nativeEvent;
      if (translationY < -50) {
        setIsFilterationQueryPressed(false);
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const radioButtons = useMemo(
    () => [
      {
        id: "1",
        label: "All",
        value: "all",
        color: Colors.primaryColor1,
      },
      {
        id: "2",
        label: "Room for rent",
        value: "room for rent",
        color: Colors.primaryColor1,
      },
      {
        id: "3",
        label: "Bed spacer",
        value: "bed spacer",
        color: Colors.primaryColor1,
      },
    ],
    []
  );

  const loadFeedData = async () => {
    try {
      const preferredAreaSplit = preferredArea?.split(", ");

      const street_3 = preferredAreaSplit ? preferredAreaSplit[0] : undefined;
      const city = preferredAreaSplit ? preferredAreaSplit[1] : undefined;

      setIsLoading(true);
      const data = await FetchPublicFeedsAPI(
        page,
        street_3?.toLowerCase(),
        city?.toLowerCase(),
        selectedFilteredCategory,
        toast,
        setIsLoading
      );

      setPublicFeedData((prevData) => [
        ...prevData,
        ...data.feed_data.filter(
          (item: any) =>
            !prevData.some((existingItem) => existingItem.id === item.id)
        ),
      ]);
      setNextPage(data.next_page);
    } catch (error) {
      console.error("Error loading feed data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedData();
  }, [page, isUserSessionValidated]);

  const handleLoadMore = () => {
    if (nextPage) {
      setPage(nextPage);
    }
  };

  return (
    <>
      <ThemedContainer>
        <View
          style={{
            backgroundColor: isFilterationQueryPressed
              ? isDarkMode
                ? Colors.primaryDarkModeColor1
                : Colors.secondaryColor1
              : "transparent",
            width: Viewport.width * 1,
            height: Viewport.height * 0.11,
            paddingBottom: Viewport.height * 0.01,
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 15,
            zIndex: 1,
          }}
        >
          <InputField
            value={searchQuery}
            placeholder="Search by barangay and city"
            onChangeText={(value) => setSearchQuery(value)}
            style={{
              width: Viewport.width * 0.8,
              height: Viewport.height * 0.05,
              backgroundColor: isDarkMode
                ? Colors.primaryDarkModeColor2
                : isFilterationQueryPressed
                ? Colors.primaryColor2
                : Colors.secondaryColor1,
              paddingLeft: 35,
              marginLeft: isFilterationQueryPressed
                ? Viewport.width * 0.1
                : Viewport.width * 0.05,
              borderRadius: 15,
              elevation: 5,
              shadowColor: "#000", // For iOS shadow
              shadowOffset: { width: 0, height: 2 }, // For iOS shadow
              shadowOpacity: 0.25, // For iOS shadow
              shadowRadius: 3.84, // For iOS shadow
            }}
            searchIconLeft={
              isFilterationQueryPressed
                ? Viewport.width * 0.13
                : Viewport.width * 0.07
            }
            hasSearchIcon={true}
            colors={isDarkMode ? ["light"] : ["dark"]}
          />
          {!isFilterationQueryPressed && (
            <TouchableOpacity
              onPress={() => {
                setIsFilterationQueryPressed((previousState) => {
                  const newState = !previousState;
                  if (newState) {
                    Animated.spring(translateY, {
                      toValue: 100,
                      useNativeDriver: true,
                    }).start();
                  } else {
                    Animated.spring(translateY, {
                      toValue: 100,
                      useNativeDriver: true,
                    }).start();
                  }
                  return newState;
                });
              }}
            >
              <FontAwesome
                name="filter"
                size={35}
                color={Colors.primaryColor1}
              />
            </TouchableOpacity>
          )}
        </View>
        {isFilterationQueryPressed && (
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={{
                transform: [{ translateY }],
                marginTop: Viewport.height * 0.0,
                width: Viewport.width * 1,
                height: Viewport.height * 0.15,
                alignItems: "center",
                backgroundColor: isDarkMode
                  ? Colors.primaryDarkModeColor1
                  : Colors.secondaryColor1,
                elevation: 5,
                shadowColor: "#000", // For iOS shadow
                shadowOffset: { width: 0, height: 2 }, // For iOS shadow
                shadowOpacity: 0.25, // For iOS shadow
                shadowRadius: 3.84, // For iOS shadow
              }}
            >
              <View
                style={{
                  marginLeft: Viewport.width * 0.05,
                  gap: 10,
                }}
              >
                <ThemedText
                  style={{ fontWeight: "bold", fontSize: FontSizes.small }}
                  value="Category"
                />

                <RadioGroup
                  containerStyle={{}}
                  labelStyle={{
                    fontSize: FontSizes.small,
                    color: isDarkMode
                      ? Colors.secondaryColor1
                      : Colors.secondaryColor3,
                  }}
                  radioButtons={radioButtons}
                  onPress={(selectedId) => {
                    setSelectedFilteredCategory(selectedId);
                  }}
                  selectedId={selectedFilteredCategory}
                  layout="row"
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  setIsFilterationQueryPressed(
                    (previousState) => !previousState
                  );
                }}
                style={{
                  width: Viewport.width * 0.15,
                  height: Viewport.height * 0.01,
                  marginTop: Viewport.height * 0.04,
                  borderRadius: 10,
                  backgroundColor: isDarkMode
                    ? Colors.primaryDarkModeColor2
                    : Colors.primaryColor2,
                }}
              />
            </Animated.View>
          </PanGestureHandler>
        )}
        {publicFeedData.length === 0 ? (
          <View
            style={{
              marginTop: Viewport.height * 0.1,
              width: Viewport.width * 1,
              height: Viewport.height * 0.8,
              alignItems: "center",
            }}
          >
            <ThemedText
              value="Sorry, there is no available boarding house near you. "
              style={{ fontSize: FontSizes.small, width: Viewport.width * 0.7 }}
            />
            <Image
              source={require("@/assets/images/no-data-available.png")}
              resizeMode="contain"
              style={{
                width: Viewport.width * 0.7,
                height: Viewport.height * 0.3,
              }}
            />
            <ExternalLink href="https://www.freepik.com/free-vector/hand-drawn-no-data-concept_55024598.htm#query=no%20data&position=12&from_view=keyword&track=ais_user&uuid=e58b5971-2570-440b-ab33-b584015b2210">
              <ThemedText
                style={{
                  fontSize: FontSizes.tiny,
                  color: "#0a7ea4",
                  textDecorationLine: "underline",
                  textAlign: "right",
                  width: Viewport.width * 1,
                }}
                value="Image by pikisuperstar on Freepik"
              />
            </ExternalLink>
          </View>
        ) : (
          <>
            {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
            <FlatList
              data={publicFeedData}
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={{
                marginTop: Viewport.height * 0.02,
                width: Viewport.width * 1,
                height: Viewport.height * 1,
                alignItems: "center",
              }}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  style={{
                    width: Viewport.width * 0.9,
                    height: Viewport.height * 0.2,
                    flexDirection: "row",
                    backgroundColor: isDarkMode
                      ? Colors.primaryDarkModeColor2
                      : Colors.secondaryColor1,
                    borderRadius: 20,
                    elevation: 5,
                    shadowColor: "#000", // For iOS shadow
                    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
                    shadowOpacity: 0.25, // For iOS shadow
                    shadowRadius: 3.84, // For iOS shadow
                  }}
                >
                  <Image
                    source={{ uri: `${serverSideMediaUrl}${item.image}` }}
                    resizeMode="stretch"
                    style={{
                      width: Viewport.width * 0.45,
                      height: Viewport.height * 0.2,
                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                  />
                  <View
                    style={{
                      paddingLeft: 10,
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 20,
                    }}
                  >
                    <ThemedText
                      style={{ fontWeight: "bold", fontSize: FontSizes.small }}
                      value={item.content.type}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        width: Viewport.width * 0.4,
                      }}
                    >
                      <Entypo name="location-pin" size={24} color="red" />
                      <ThemedText
                        style={{
                          width: Viewport.width * 0.37,
                        }}
                        value={`${item.content.address.street_3}, ${item.content.address.city}`}
                      />
                    </View>

                    <View>
                      <ThemedText
                        style={{}}
                        value={`PHP ${item.content.rent} / Month`}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              // listFooterComponent={isLoading && <ActivityIndicator size="large" color="#0000ff" />}
            />
          </>
        )}
      </ThemedContainer>
      <CustomizedModal
        visible={isRestoringSessionLoading}
        animationType="fade"
        transparent={true}
        hasHeader={true}
        headerContent={
          restoringMessage ? restoringMessage : "Restoring previous session."
        }
        headerStyle={{ fontSize: FontSizes.normal, fontWeight: "bold" }}
        viewStyle={{
          width: Viewport.width * 0.78,
          height: Viewport.height * 0.25,
          borderRadius: 25,
          backgroundColor: Colors.primaryColor2,
          gap: 20,
        }}
        onCloseRequest={() => {}}
      >
        <View style={{ width: Viewport.width * 0.6, alignItems: "center" }}>
          <ActivityIndicator color={Colors.secondaryColor3} size={80} />
          <Text style={{ fontSize: FontSizes.small }}>Please wait...</Text>
        </View>
      </CustomizedModal>
    </>
  );
}
