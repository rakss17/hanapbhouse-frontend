import { useState, useEffect } from "react";
import { SaveFeedAPI, serverSideUrl, UnsaveFeedAPI } from "@/components/Api";
import { ThemedContainer } from "@/components/ThemedContainer";
import { ThemedText } from "@/components/ThemedText";
import { Colors, FontSizes, Viewport } from "@/styles/styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import {
  AntDesign,
  Entypo,
  Fontisto,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import * as Location from "expo-location";
import { MapRenderer } from "@/components/MapRenderer";
import { LocationProps } from "@/interfaces/MapRendererProps";
import { Button } from "@/components/Button";
import { PropertyDetail } from "@/interfaces/PropertyDetailsProps";

export default function Details() {
  const [propertyDetail, setPropertyDetail] = useState<PropertyDetail>();
  const router = useRouter();
  const toast = useToast();
  const [propertyLocation, setPropertyLocation] = useState<LocationProps>({
    latitude: 0,
    longitude: 0,
  });
  const [isShowLocationPressed, setIsShowLocationPressed] =
    useState<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [isUnsaveLoading, setIsUnsaveLoading] = useState<boolean>(false);
  const [isMapRendering, setIsMapRendering] = useState<boolean>(false);
  const params = useLocalSearchParams<any>();
  const data = JSON.parse(decodeURIComponent(params.item));
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );
  const replacedStringInclusion = propertyDetail?.content.inclusion.replaceAll(
    ", ",
    " | "
  );

  useEffect(() => {
    setPropertyDetail(data);
  }, []);

  const handleShowLocation = async () => {
    setIsMapRendering(true);
    let currentPermission = await Location.getForegroundPermissionsAsync();
    if (currentPermission.status === "granted") {
      setPropertyLocation({
        ...propertyLocation,
        latitude: parseFloat(propertyDetail?.content.coordinates.latitude),
        longitude: parseFloat(propertyDetail?.content.coordinates.longitude),
      });
      setIsShowLocationPressed(true);
    } else {
      let requestPermission =
        await Location.requestForegroundPermissionsAsync();
      if (requestPermission.status === "granted") {
        setPropertyLocation({
          ...propertyLocation,
          latitude: parseFloat(propertyDetail?.content.coordinates.latitude),
          longitude: parseFloat(propertyDetail?.content.coordinates.longitude),
        });
        setIsShowLocationPressed(true);
      } else {
        if (
          !currentPermission.canAskAgain &&
          currentPermission.status === "denied"
        ) {
          toast.show(
            "Permission to access location was denied. Please enable it in your device settings. Your device settings will be open shortly.",
            {
              type: "danger",
              placement: "top",
              duration: 5000,
              animationType: "slide-in",
            }
          );
          setTimeout(() => {
            Linking.openSettings();
          }, 5000);
        } else {
          toast.show("Permission to access location was denied.", {
            type: "danger",
            placement: "top",
            duration: 5000,
            animationType: "slide-in",
          });
        }
      }
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <ThemedContainer style={{ alignItems: "center" }}>
        <View
          style={{
            width: Viewport.width * 1,
            height: Viewport.height * 0.35,
            position: "relative",
          }}
        >
          <View
            style={{
              width: Viewport.width * 1,
              height: Viewport.height * 0.11,
              position: "absolute",
              zIndex: 1,
              alignItems: "flex-end",
              flexDirection: "row",
              justifyContent: "center",
              gap: Viewport.width * 0.65,
            }}
          >
            <TouchableOpacity
              style={{
                height: Viewport.height * 0.06,
                width: Viewport.width * 0.12,
                backgroundColor: Colors.secondaryColor4,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                elevation: 5,
                shadowColor: "#000", // For iOS shadow
                shadowOffset: { width: 0, height: 2 }, // For iOS shadow
                shadowOpacity: 0.25, // For iOS shadow
                shadowRadius: 3.84, // For iOS shadow
              }}
              onPress={() => {
                router.back();
              }}
            >
              <AntDesign name="arrowleft" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: Viewport.height * 0.06,
                width: Viewport.width * 0.12,
                backgroundColor: Colors.secondaryColor4,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                elevation: 5,
                shadowColor: "#000", // For iOS shadow
                shadowOffset: { width: 0, height: 2 }, // For iOS shadow
                shadowOpacity: 0.25, // For iOS shadow
                shadowRadius: 3.84, // For iOS shadow
              }}
              onPress={() => {
                router.back();
              }}
            >
              <Entypo name="share" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <Image
            source={
              propertyDetail?.image
                ? { uri: `${serverSideUrl}${propertyDetail?.image}` }
                : require("@/assets/images/no_image_found.jpg")
            }
            resizeMode="stretch"
            style={{
              width: Viewport.width * 1,
              height: Viewport.height * 0.35,
            }}
          />
        </View>
        <View
          style={{
            width: Viewport.width * 0.9,
            height: Viewport.height * 1,
            gap: 20,
          }}
        >
          <View
            style={{
              width: Viewport.width * 0.9,
              marginTop: Viewport.height * 0.01,
              alignItems: "flex-end",
            }}
          >
            {propertyDetail?.is_saved ? (
              <TouchableOpacity
                onPress={() => {
                  UnsaveFeedAPI(
                    propertyDetail?.saved_feed_id,
                    toast,
                    setIsUnsaveLoading,
                    setPropertyDetail
                  );
                }}
              >
                {isUnsaveLoading ? (
                  <ActivityIndicator
                    color={
                      isDarkMode
                        ? Colors.secondaryColor1
                        : Colors.secondaryColor3
                    }
                    size={30}
                  />
                ) : (
                  <Fontisto
                    name="favorite"
                    size={35}
                    color={Colors.primaryColor1}
                  />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  SaveFeedAPI(
                    propertyDetail?.id,
                    toast,
                    setIsSaveLoading,
                    setPropertyDetail
                  );
                }}
              >
                {isSaveLoading ? (
                  <ActivityIndicator
                    color={
                      isDarkMode
                        ? Colors.secondaryColor1
                        : Colors.secondaryColor3
                    }
                    size={30}
                  />
                ) : (
                  <Fontisto
                    name="favorite"
                    size={35}
                    color={Colors.secondaryColor2}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ThemedText
              style={{
                fontWeight: "bold",
                fontSize: FontSizes.normal,
                fontFamily: "Inter",
              }}
              value={propertyDetail?.content.type}
            />
            <ThemedText
              style={{ fontSize: FontSizes.small, fontFamily: "Inter" }}
              value={`Php ${propertyDetail?.content.rent} / Month`}
            />
          </View>
          <View>
            <ThemedText
              style={{
                fontWeight: "bold",
                fontSize: FontSizes.small,
                fontFamily: "Inter",
              }}
              value="Location"
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <ThemedText
                style={{
                  fontSize: FontSizes.small,
                  width: Viewport.width * 0.65,
                  fontFamily: "Inter",
                }}
                value={`${propertyDetail?.content.address.street_1}${
                  propertyDetail?.content.address.street_2
                    ? " " + propertyDetail?.content.address.street_2
                    : ""
                }, ${propertyDetail?.content.address.street_3}, ${
                  propertyDetail?.content.address.city
                }`}
              />
              <Button
                buttonStyle={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  height: Viewport.height * 0.05,
                  width: Viewport.width * 0.18,
                  borderRadius: 20,
                  backgroundColor: isMapRendering
                    ? Colors.secondaryColor4
                    : Colors.primaryColor1,
                }}
                isLoading={isMapRendering}
                disabled={isMapRendering ? true : false}
                loadingText=""
                loadingColor="white"
                loadingSize={25}
                textStyle={{
                  color: Colors.secondaryColor1,
                  fontSize: FontSizes.small,
                }}
                onPress={handleShowLocation}
              >
                <Text
                  style={{
                    fontSize: FontSizes.tiny,
                    color: Colors.secondaryColor1,
                    textAlign: "center",
                    fontFamily: "Inter",
                  }}
                >
                  Show
                </Text>
                <Entypo name="location-pin" size={20} color="red" />
              </Button>
            </View>
          </View>
          <View>
            <ThemedText
              style={{
                fontWeight: "bold",
                fontSize: FontSizes.small,
                fontFamily: "Inter",
              }}
              value="Description"
            />
            <ThemedText
              style={{ fontSize: FontSizes.small, fontFamily: "Inter" }}
              value={propertyDetail?.content.description}
            />
          </View>
          <View>
            <ThemedText
              style={{
                fontWeight: "bold",
                fontSize: FontSizes.small,
                fontFamily: "Inter",
              }}
              value="Inclusion"
            />
            <ThemedText
              style={{ fontSize: FontSizes.small, fontFamily: "Inter" }}
              value={replacedStringInclusion}
            />
          </View>

          <TouchableOpacity
            style={{
              width: Viewport.width * 0.9,
              height: Viewport.height * 0.08,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => {
              let phoneNumber = propertyDetail?.content.landlord_contactnumber;
              if (Platform.OS !== "android") {
                phoneNumber = `telprompt:${propertyDetail?.content.landlord_contactnumber}`;
              } else {
                phoneNumber = `tel:${propertyDetail?.content.landlord_contactnumber}`;
              }
              Linking.canOpenURL(phoneNumber)
                .then((supported) => {
                  if (supported) {
                    return Linking.openURL(phoneNumber);
                  } else {
                    toast.show("Phone number is not available", {
                      type: "danger",
                      placement: "top",
                      duration: 3000,
                      animationType: "slide-in",
                    });
                  }
                })
                .catch((err) => console.log(err));
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: Viewport.width * 0.52,
                justifyContent: "space-between",
              }}
            >
              <Image
                source={
                  propertyDetail?.owner_image
                    ? { uri: `${serverSideUrl}${propertyDetail?.owner_image}` }
                    : require("@/assets/images/no_user_image_found.jpg")
                }
                resizeMode="stretch"
                style={{
                  width: Viewport.width * 0.15,
                  height: Viewport.height * 0.08,
                  borderRadius: 50,
                }}
              />
              <View style={{ flexDirection: "column" }}>
                <ThemedText
                  style={{
                    fontWeight: "bold",
                    fontSize: FontSizes.small,
                    fontFamily: "Inter",
                  }}
                  value={propertyDetail?.content.landlord_fullname}
                />
                <ThemedText
                  style={{ fontSize: FontSizes.small, fontFamily: "Inter" }}
                  value={propertyDetail?.content.landlord_contactnumber}
                />
              </View>
            </View>

            <FontAwesome
              name="phone"
              size={35}
              color={Colors.secondaryColor2}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: Viewport.width * 0.7,
            }}
          >
            <ThemedText
              style={{
                fontWeight: "bold",
                fontSize: FontSizes.small,
                fontFamily: "Inter",
              }}
              value="Slots available:"
            />
            <ThemedText
              style={{ fontSize: FontSizes.small, fontFamily: "Inter" }}
              value={`${propertyDetail?.content.number_of_vacant_male} male`}
            />

            <ThemedText
              style={{ fontSize: FontSizes.small, fontFamily: "Inter" }}
              value={`${propertyDetail?.content.number_of_vacant_female} female`}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: Viewport.width * 0.9,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: isDarkMode
                  ? Colors.primaryDarkModeColor2
                  : Colors.secondaryColor1,
                height: Viewport.height * 0.06,
                width: Viewport.width * 0.55,
                paddingLeft: Viewport.width * 0.05,
                justifyContent: "center",
                borderRadius: 15,
                elevation: 5,
                shadowColor: "#000", // For iOS shadow
                shadowOffset: { width: 0, height: 2 }, // For iOS shadow
                shadowOpacity: 0.25, // For iOS shadow
                shadowRadius: 3.84, // For iOS shadow
              }}
            >
              <ThemedText
                style={{
                  fontSize: FontSizes.small,
                  fontFamily: "Inter",
                }}
                value="I'm interested."
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primaryColor1,
                height: Viewport.height * 0.06,
                width: Viewport.width * 0.3,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                borderRadius: 15,
                elevation: 5,
                shadowColor: "#000", // For iOS shadow
                shadowOffset: { width: 0, height: 2 }, // For iOS shadow
                shadowOpacity: 0.25, // For iOS shadow
                shadowRadius: 3.84, // For iOS shadow
              }}
            >
              <Text
                style={{
                  fontSize: FontSizes.small,
                  fontFamily: "Inter",
                  color: "white",
                }}
              >
                Send
              </Text>
              <MaterialCommunityIcons
                name="message"
                size={24}
                color="#E78E4E"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ThemedContainer>
      <MapRenderer
        isShowLocationPressed={isShowLocationPressed}
        setIsShowLocationPressed={setIsShowLocationPressed}
        propertyLocation={propertyLocation}
        isMapRendering={isMapRendering}
        setIsMapRendering={setIsMapRendering}
      />
    </>
  );
}
