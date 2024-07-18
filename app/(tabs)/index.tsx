import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { CustomizedModal } from "@/components/CustomizedModal";
import { Colors, FontSizes, Viewport } from "@/styles/styles";
import {
  FetchPublicFeedsAPI,
  TokenRevalidation,
  serverSideUrl,
} from "@/components/Api";
import { useFocusEffect, useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { InputField } from "@/components/InputField";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { RadioGroup } from "react-native-radio-buttons-group";
import { ThemedText } from "@/components/ThemedText";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { ThemedContainer } from "@/components/ThemedContainer";
import { ExternalLink } from "@/components/ExternalLink";
import { Fontisto, Entypo, Feather } from "@expo/vector-icons";
import { PublicFeedData } from "@/interfaces/PropertyDetailsProps";

export default function Index() {
  const [publicFeedData, setPublicFeedData] = useState<PublicFeedData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isUserSessionValidated, setIsUserSessionValidated] =
    useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [searchBarangayQuery, setSearchBarangayQuery] = useState("");
  const [searchCityQuery, setSearchCityQuery] = useState("");
  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isRestoringSessionLoading, setIsRestoringSessionLoading] =
    useState(false);
  const [isFilterationQueryPressed, setIsFilterationQueryPressed] =
    useState(false);
  const [selectedFilteredCategory, setSelectedFilteredCategory] =
    useState("All");
  const [selectedCategoryId, setSelectedCategoryId] = useState("1");
  const [restoringMessage, setRestoringMessage] = useState("");
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );
  const userInfo = useSelector((state: RootState) => state.userInfo.data);
  const preferredArea = userInfo?.preferred_area;
  const preferredAreaSplit = preferredArea?.split(", ");

  const street_3 = preferredAreaSplit ? preferredAreaSplit[0] : undefined;
  const city = preferredAreaSplit ? preferredAreaSplit[1] : undefined;
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
  const onRefresh = useCallback(async () => {
    setPublicFeedData([]);
    setPage(1);
    setRefreshing(true);
    setIsLoading(true);
    setSearchBarangayQuery("");
    setSearchCityQuery("");
    setSelectedCategoryId("1");
    setSelectedFilteredCategory("All");
    try {
      const data = await FetchPublicFeedsAPI(
        page,
        searchBarangayQuery ? searchBarangayQuery : street_3?.toLowerCase(),
        searchCityQuery ? searchCityQuery : city?.toLowerCase(),
        selectedFilteredCategory,
        toast
      );

      if (data.feed_data && data.feed_data.length > 0) {
        setRefreshing(false);
        setIsLoading(false);
        setPublicFeedData((prevData) => [
          ...prevData,
          ...data.feed_data.filter(
            (item: any) =>
              !prevData.some((existingItem) => existingItem.id === item.id)
          ),
        ]);

        setNextPage(data.next_page);
      }
    } catch (error) {
      setRefreshing(false);
      setIsLoading(true);
      console.error("Error loading feed data:", error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  const loadFeedData = async () => {
    try {
      setIsLoading(true);
      const data = await FetchPublicFeedsAPI(
        page,
        searchBarangayQuery ? searchBarangayQuery : street_3?.toLowerCase(),
        searchCityQuery ? searchCityQuery : city?.toLowerCase(),
        selectedFilteredCategory,
        toast
      );

      if (data.feed_data && data.feed_data.length > 0) {
        setPublicFeedData((prevData) => {
          const newDataMap = new Map<any, any>(
            data.feed_data.map((item: any) => [
              item.id,
              { is_saved: item.is_saved, saved_feed_id: item.saved_feed_id },
            ])
          );

          const updatedPrevData = prevData.map((item) => {
            if (newDataMap.has(item.id)) {
              const newItemData = newDataMap.get(item.id);
              return {
                ...item,
                is_saved: newItemData.is_saved,
                saved_feed_id: newItemData.saved_feed_id,
              };
            }
            return item;
          });

          const newItems = data.feed_data.filter(
            (item: any) =>
              !prevData.some((existingItem) => existingItem.id === item.id)
          );

          return [...updatedPrevData, ...newItems];
        });

        setNextPage(data.next_page);
      }
    } catch (error) {
      console.error("Error loading feed data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (isUserSessionValidated) {
        loadFeedData();
      }
    }, [
      page,
      isUserSessionValidated,
      selectedFilteredCategory,
      searchBarangayQuery,
      searchCityQuery,
    ])
  );

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
          <View style={{ flexDirection: "row" }}>
            <InputField
              value={searchBarangayQuery}
              placeholder="Barangay"
              onChangeText={(value) => {
                setSearchBarangayQuery(value);
                setPage(1);
                setPublicFeedData([]);
              }}
              style={{
                width: Viewport.width * 0.4,
                height: Viewport.height * 0.05,
                backgroundColor: isDarkMode
                  ? Colors.primaryDarkModeColor2
                  : isFilterationQueryPressed
                  ? Colors.primaryColor2
                  : Colors.secondaryColor1,
                paddingLeft: 35,
                marginLeft: Viewport.width * 0.05,
                borderRadius: 15,
                elevation: 5,
                shadowColor: "#000", // For iOS shadow
                shadowOffset: { width: 0, height: 2 }, // For iOS shadow
                shadowOpacity: 0.25, // For iOS shadow
                shadowRadius: 3.84, // For iOS shadow
              }}
              searchIconLeft={Viewport.width * 0.07}
              hasSearchIcon={true}
              colors={isDarkMode ? ["light"] : ["dark"]}
            />

            <InputField
              value={searchCityQuery}
              placeholder="City"
              onChangeText={(value) => {
                setSearchCityQuery(value);
                setPage(1);
                setPublicFeedData([]);
              }}
              style={{
                width: Viewport.width * 0.4,
                height: Viewport.height * 0.05,
                backgroundColor: isDarkMode
                  ? Colors.primaryDarkModeColor2
                  : isFilterationQueryPressed
                  ? Colors.primaryColor2
                  : Colors.secondaryColor1,
                paddingLeft: 15,
                marginLeft: Viewport.width * 0.01,
                borderRadius: 15,
                elevation: 5,
                shadowColor: "#000", // For iOS shadow
                shadowOffset: { width: 0, height: 2 }, // For iOS shadow
                shadowOpacity: 0.25, // For iOS shadow
                shadowRadius: 3.84, // For iOS shadow
              }}
              colors={isDarkMode ? ["light"] : ["dark"]}
            />
          </View>

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
            {isFilterationQueryPressed ? (
              <FontAwesome
                name="filter"
                size={30}
                color={Colors.primaryColor1}
              />
            ) : (
              <Feather name="filter" size={30} color={Colors.primaryColor1} />
            )}
          </TouchableOpacity>
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
                    setSelectedCategoryId(selectedId);
                    const selectedRadioButton = radioButtons.find(
                      (radioButton) => radioButton.id === selectedId
                    );
                    if (selectedRadioButton) {
                      setPage(1);
                      setPublicFeedData([]);
                      setSelectedFilteredCategory(selectedRadioButton.label);
                    } else {
                      console.error("Selected radio button not found");
                    }
                  }}
                  selectedId={selectedCategoryId}
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
                  value="Sorry, there is no available boarding house near you. "
                  style={{
                    fontSize: FontSizes.small,
                    width: Viewport.width * 0.7,
                  }}
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
              </>
            )}
          </View>
        ) : (
          <>
            <FlatList
              data={publicFeedData}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={{
                marginTop: Viewport.height * 0.02,
                width: Viewport.width * 1,
                alignItems: "center",
                gap: 20,
                paddingBottom: Viewport.height * 0.05,
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
                  onPress={() => {
                    router.push({
                      pathname: `/property_details`,
                      params: {
                        item: encodeURIComponent(JSON.stringify(item)),
                      },
                    });
                  }}
                >
                  <Image
                    source={
                      item.image
                        ? { uri: `${serverSideUrl}${item.image}` }
                        : require("@/assets/images/no_image_found.jpg")
                    }
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
                      <Entypo name="location-pin" size={15} color="red" />
                      <ThemedText
                        style={{
                          width: Viewport.width * 0.35,
                          fontSize: FontSizes.tiny,
                        }}
                        value={`${item.content.address.street_3}, ${item.content.address.city}`}
                      />
                    </View>

                    <View style={{ flexDirection: "row", gap: 20 }}>
                      <ThemedText
                        style={{ fontSize: FontSizes.tiny }}
                        value={`PHP ${item.content.rent} / Month`}
                      />
                      {item.is_saved ? (
                        <Fontisto
                          name="favorite"
                          size={24}
                          color={Colors.primaryColor1}
                        />
                      ) : (
                        <Fontisto
                          name="favorite"
                          size={24}
                          color={Colors.secondaryColor2}
                        />
                      )}
                    </View>
                  </View>
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
          gap: 20,
          paddingTop: Viewport.height * 0.03,
          paddingLeft: Viewport.width * 0.08,
        }}
        onCloseRequest={() => {}}
      >
        <View style={{ width: Viewport.width * 0.6, alignItems: "center" }}>
          <ActivityIndicator
            color={isDarkMode ? Colors.secondaryColor1 : Colors.secondaryColor3}
            size={80}
          />
          <ThemedText
            style={{ fontSize: FontSizes.small }}
            value="Please wait..."
          />
        </View>
      </CustomizedModal>
    </>
  );
}
