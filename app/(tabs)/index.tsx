import { useEffect, useState, useMemo } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { CustomizedModal } from "@/components/CustomizedModat";
import { Colors, FontSizes, Viewport } from "@/styles/styles";
import { TokenRevalidation, getAccessToken } from "@/components/Api";
import { useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { InputField } from "@/components/InputField";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { RadioGroup } from "react-native-radio-buttons-group";
import { ThemedText } from "@/components/ThemedText";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { ThemedContainer } from "@/components/ThemedContainer";

export default function Index() {
  const [accessToken, setAccessToken] = useState("");
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
  const firstName = userInfo?.first_name;

  useEffect(() => {
    async function fetchToken() {
      const token = await getAccessToken();
      if (token) {
        setAccessToken(token);
      }
    }
    fetchToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      TokenRevalidation(
        toast,
        router,
        setIsRestoringSessionLoading,
        setRestoringMessage,
        dispatch
      );
    }
  }, [accessToken]);

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
