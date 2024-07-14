import { LocationProps, MapRendererProps } from "@/interfaces/MapRendererProps";
import { CustomizedModal } from "./CustomizedModal";
import { useEffect, useState } from "react";
import { Colors, Viewport } from "@/styles/styles";
import MapView, { UrlTile, Marker } from "react-native-maps";
import { Image, View, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { AntDesign } from "@expo/vector-icons";

export const MapRenderer: React.FC<MapRendererProps> = ({
  isShowLocationPressed,
  setIsShowLocationPressed,
  propertyLocation,
  isMapRendering,
  setIsMapRendering,
}) => {
  const [userLocation, setUserLocation] = useState<LocationProps>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const getCurrentLocation = async () => {
      const currentLocation: any = await Location.getCurrentPositionAsync({});
      setUserLocation({
        ...userLocation,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    };
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (isMapRendering) {
      setIsMapRendering(false);
    }
  }, [isMapRendering]);

  // METER DISTANCE BETWEEN USER AND PROPERTY LOCATION USING HARVERSINE FORMULA
  const getDistanceInMeters = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const toRadians = (degrees: any) => degrees * (Math.PI / 180);

    const R = 6371000;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };
  const distance = getDistanceInMeters(
    userLocation.latitude,
    userLocation.longitude,
    propertyLocation.latitude,
    propertyLocation.longitude
  );

  // MIDPOINT REGION COORDINATES BETWEEN USER AND PROPERTY LOCATION
  const getMidpoint = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const midpointLatitude = (lat1 + lat2) / 2;
    const midpointLongitude = (lon1 + lon2) / 2;
    return {
      latitude: midpointLatitude,
      longitude: midpointLongitude,
    };
  };
  const midpoint = getMidpoint(
    userLocation.latitude,
    userLocation.longitude,
    propertyLocation.latitude,
    propertyLocation.longitude
  );

  // REGION DELTA TO HAVE A BETTER ZOOMING VIEW BETWEEN USER AND PROPERTY LOCATION
  const getDelta = (lat: any, distance: any) => {
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
    const longitudeDelta =
      distance /
      (oneDegreeOfLatitudeInMeters * Math.cos(lat * (Math.PI / 180)));

    return {
      latitudeDelta,
      longitudeDelta,
    };
  };
  const deltas = getDelta(midpoint.latitude, distance);

  return (
    <>
      <CustomizedModal
        visible={isShowLocationPressed}
        animationType="fade"
        transparent={true}
        onCloseRequest={() => {
          setIsShowLocationPressed(false);
        }}
        viewStyle={{
          width: Viewport.width * 1,
          height: Viewport.height * 1,
          backgroundColor: Colors.primaryColor2,
          paddingTop: 0,
          paddingLeft: 0,
          position: "relative",
        }}
      >
        <View
          style={{
            width: Viewport.width * 1,
            height: Viewport.height * 0.075,
            position: "absolute",
            zIndex: 1,
            alignItems: "flex-end",
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingLeft: Viewport.width * 0.055,
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
              setIsShowLocationPressed(false);
            }}
          >
            <AntDesign name="arrowleft" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <MapView
          style={{
            height: Viewport.height * 1,
            width: Viewport.width * 1,
          }}
          customMapStyle={[
            {
              featureType: "poi",
              stylers: [
                {
                  visibility: "on",
                },
              ],
            },
          ]}
          mapType="none"
          scrollEnabled={true}
          zoomEnabled={true}
          toolbarEnabled={false}
          rotateEnabled={false}
          region={{
            latitude: midpoint.latitude,
            longitude: midpoint.longitude,
            latitudeDelta: deltas.latitudeDelta,
            longitudeDelta: deltas.longitudeDelta,
          }}
        >
          <UrlTile
            urlTemplate="https://openstreetmap.keannu1.duckdns.org/tile/{z}/{x}/{y}.png?"
            shouldReplaceMapContent={true}
            maximumZ={19}
            flipY={false}
            zIndex={1}
          />
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="You are here"
          >
            {/* <Text style={{ textAlign: "center" }}>You are here</Text> */}
            <Image
              source={require("@/assets/images/user_location_marker.png")}
              style={{ width: 58, height: 58 }}
              resizeMode="contain"
            />
          </Marker>
          <Marker
            coordinate={{
              latitude: propertyLocation.latitude,
              longitude: propertyLocation.longitude,
            }}
            title="You are here"
          >
            {/* <Text style={{ textAlign: "center" }}>You are here</Text> */}
            <Image
              source={require("@/assets/images/property_location_marker.png")}
              style={{ width: 58, height: 58 }}
              resizeMode="contain"
            />
          </Marker>
        </MapView>
      </CustomizedModal>
    </>
  );
};
