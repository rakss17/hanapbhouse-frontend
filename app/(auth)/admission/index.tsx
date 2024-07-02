import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { Colors, FontSizes, Viewport, customizeFont } from "@/styles/styles";
import { CircleShape } from "@/components/CircleShape";
import { StatusBar } from "expo-status-bar";
import { ResetPasswordConfirmAPI, UserActivationAPI } from "@/components/Api";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CustomizedModal } from "@/components/CustomizedModat";
import phPlaces from "@/assets/ph_places/data.json";

export default function Admission() {
  const fontLoaded = customizeFont();
  const [errorMessages, setErrorMessages] = useState<any[]>([]);
  const [isRegionFieldFocus, setIsRegionFieldFocus] = useState(false);
  const [isProvinceFieldFocus, setIsProvinceFieldFocus] = useState(false);
  const [isCityFieldFocus, setIsCityFieldFocus] = useState(false);
  const [isBarangayFieldFocus, setIsBarangayFieldFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState({
    street_3: "",
    city: "",
    province: "",
    region: "",
  });
  const toast = useToast();
  const router = useRouter();
  const params = useGlobalSearchParams();
  const uid = params.slug3;
  const token = params.slug4;

  //   const handleResetPassword = () => {
  //     let validationErrors: { [key: string]: string } = {};
  //     if (!passwordRegex.test(data.password)) {
  //       validationErrors.password =
  //         "Please include at least 8 characters long and include at least one uppercase letter and one number.";
  //     } else {
  //       if (data.password !== data.confirm_password) {
  //         validationErrors.passDoesNotMatch = "Password does not match.";
  //       }
  //     }
  //     const errorArray = [validationErrors];
  //     setErrorMessages(errorArray);

  //     if (Object.keys(validationErrors).length === 0) {
  //       ResetPasswordConfirmAPI(
  //         data.uid,
  //         data.token,
  //         data.password,
  //         toast,
  //         router,
  //         setIsLoading,
  //         setIsSuccess,
  //         setData
  //       );
  //     }
  //   };
  const filteredProvinces = phPlaces.flatMap((place) =>
    place.provinces.filter((province) => province.regionName === data.region)
  );
  const filteredCity = filteredProvinces.flatMap((place) =>
    place.municipalities.filter(
      (municipality) => municipality.provinceName === data.province
    )
  );
  const filteredBarangays = filteredCity.flatMap((city) =>
    city.barangays.filter(() => city.name === data.city)
  );
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        width: Viewport.width * 1,
        height: Viewport.height * 1.1,
      }}
      keyboardShouldPersistTaps="handled"
      scrollEnabled={true}
      enableAutomaticScroll={false}
      enableOnAndroid={true}
    >
      <StatusBar style="dark" />
      <View
        style={{
          backgroundColor: Colors.primaryColor2,
          flex: 1,
          position: "relative",
          gap: 20,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: Viewport.width * 0.8,
            marginTop: Viewport.width * 0.3,
          }}
        >
          {fontLoaded[0] && (
            <>
              <Text
                style={{
                  fontFamily: "Inter",
                  color: Colors.secondaryColor3,
                  fontSize: FontSizes.large,
                  fontWeight: "bold",
                }}
              >
                Finishing things up
              </Text>
              <Text
                style={{
                  fontFamily: "Inter",
                  color: Colors.secondaryColor3,
                  fontSize: FontSizes.small,
                }}
              >
                Please select your preferred area to browse a boarding house.
              </Text>
            </>
          )}
          <View style={{ gap: 20 }}>
            <View
              style={{
                height: Viewport.height * 0.05,
                marginTop: Viewport.width * 0.02,
              }}
            >
              <InputField
                value={data.region}
                placeholder="Region"
                autoCapitalize="none"
                style={{
                  width: Viewport.width * 0.8,
                  height: Viewport.height * 0.05,
                  paddingLeft: 10,
                }}
                isFocusPressable={isRegionFieldFocus}
                isPressable={true}
                showSoftInputOnFocus={false}
                onChangeText={() => {}}
                onPressableFocus={() => {
                  setIsRegionFieldFocus(true);
                }}
                floatingPlaceHolder
                colors={
                  errorMessages[0]?.all || errorMessages[0]?.passDoesNotMatch
                    ? ["error"]
                    : ["dark"]
                }
              />
              {!errorMessages[0]?.passDoesNotMatch && (
                <Text
                  style={{
                    color:
                      errorMessages[0]?.password || errorMessages[0]?.all
                        ? Colors.errorColor
                        : Colors.secondaryColor3,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                    fontWeight:
                      errorMessages[0]?.password || errorMessages[0]?.all
                        ? "normal"
                        : "bold",
                  }}
                >
                  Please select region
                </Text>
              )}
            </View>
            <View
              style={{
                height: Viewport.height * 0.05,
                marginTop: Viewport.width * 0.02,
              }}
            >
              <InputField
                value={data.province}
                placeholder="Province"
                autoCapitalize="none"
                style={{
                  width: Viewport.width * 0.8,
                  height: Viewport.height * 0.05,
                  paddingLeft: 10,
                }}
                isFocusPressable={isProvinceFieldFocus}
                isPressable={true}
                showSoftInputOnFocus={false}
                onChangeText={() => {}}
                onPressableFocus={() => {
                  setIsProvinceFieldFocus(true);
                }}
                floatingPlaceHolder
                colors={
                  errorMessages[0]?.all || errorMessages[0]?.passDoesNotMatch
                    ? ["error"]
                    : ["dark"]
                }
              />
              {!errorMessages[0]?.passDoesNotMatch && (
                <Text
                  style={{
                    color:
                      errorMessages[0]?.password || errorMessages[0]?.all
                        ? Colors.errorColor
                        : Colors.secondaryColor3,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                    fontWeight:
                      errorMessages[0]?.password || errorMessages[0]?.all
                        ? "normal"
                        : "bold",
                  }}
                >
                  Please select region first
                </Text>
              )}
            </View>
            <View
              style={{
                height: Viewport.height * 0.05,
                marginTop: Viewport.width * 0.02,
              }}
            >
              <InputField
                value={data.city}
                placeholder="City or municipality"
                autoCapitalize="none"
                style={{
                  width: Viewport.width * 0.8,
                  height: Viewport.height * 0.05,
                  paddingLeft: 10,
                }}
                isFocusPressable={isCityFieldFocus}
                isPressable={true}
                showSoftInputOnFocus={false}
                onChangeText={() => {}}
                onPressableFocus={() => {
                  setIsCityFieldFocus(true);
                }}
                floatingPlaceHolder
                colors={
                  errorMessages[0]?.all || errorMessages[0]?.passDoesNotMatch
                    ? ["error"]
                    : ["dark"]
                }
              />
              {!errorMessages[0]?.passDoesNotMatch && (
                <Text
                  style={{
                    color:
                      errorMessages[0]?.password || errorMessages[0]?.all
                        ? Colors.errorColor
                        : Colors.secondaryColor3,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                    fontWeight:
                      errorMessages[0]?.password || errorMessages[0]?.all
                        ? "normal"
                        : "bold",
                  }}
                >
                  Please select province first
                </Text>
              )}
            </View>
            <View
              style={{
                height: Viewport.height * 0.05,
                marginTop: Viewport.width * 0.02,
              }}
            >
              <InputField
                value={data.street_3}
                placeholder="Barangay"
                autoCapitalize="none"
                style={{
                  width: Viewport.width * 0.8,
                  height: Viewport.height * 0.05,
                  paddingLeft: 10,
                }}
                isFocusPressable={isBarangayFieldFocus}
                isPressable={true}
                showSoftInputOnFocus={false}
                onChangeText={() => {}}
                onPressableFocus={() => {
                  setIsBarangayFieldFocus(true);
                }}
                floatingPlaceHolder
                colors={
                  errorMessages[0]?.all || errorMessages[0]?.passDoesNotMatch
                    ? ["error"]
                    : ["dark"]
                }
              />
              {!errorMessages[0]?.passDoesNotMatch && (
                <Text
                  style={{
                    color:
                      errorMessages[0]?.password || errorMessages[0]?.all
                        ? Colors.errorColor
                        : Colors.secondaryColor3,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                    fontWeight:
                      errorMessages[0]?.password || errorMessages[0]?.all
                        ? "normal"
                        : "bold",
                  }}
                >
                  Please select city or municipality first
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
      <CustomizedModal
        visible={isRegionFieldFocus}
        animationType="fade"
        transparent={true}
        onCloseRequest={() => {
          setIsRegionFieldFocus(false);
        }}
        viewStyle={{
          width: Viewport.width * 0.85,
          height: Viewport.height * 0.42,
          borderRadius: 25,
          backgroundColor: Colors.primaryColor2,
          gap: 10,
        }}
      >
        <ScrollView
          style={{
            right: Viewport.width * 0.08,
            bottom: Viewport.height * 0.015,
            width: Viewport.width * 0.85,
            height: Viewport.height * 0.42,
          }}
        >
          {phPlaces.map((region: any) => (
            <TouchableOpacity
              key={region.id}
              style={{
                borderColor: "black",
                borderBottomWidth: 2,
                height: Viewport.height * 0.07,
                width: Viewport.width * 0.85,
                justifyContent: "center",
              }}
              onPress={() => {
                setData({
                  ...data,
                  region: region.regionName,
                });
                setIsRegionFieldFocus(false);
              }}
            >
              <Text
                style={{
                  paddingLeft: Viewport.width * 0.08,
                  fontSize: FontSizes.normal,
                }}
              >
                {region.regionName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </CustomizedModal>
      <CustomizedModal
        visible={isProvinceFieldFocus}
        animationType="fade"
        transparent={true}
        onCloseRequest={() => {
          setIsProvinceFieldFocus(false);
        }}
        viewStyle={{
          width: Viewport.width * 0.85,
          height: Viewport.height * 0.42,
          borderRadius: 25,
          backgroundColor: Colors.primaryColor2,
          gap: 10,
        }}
      >
        <ScrollView
          style={{
            right: Viewport.width * 0.08,
            bottom: Viewport.height * 0.015,
            width: Viewport.width * 0.85,
            height: Viewport.height * 0.42,
          }}
        >
          {filteredProvinces.length === 0 ? (
            <Text style={{ textAlign: "left", fontSize: FontSizes.normal }}>
              Please select region first to display provinces.
            </Text>
          ) : (
            <>
              {filteredProvinces.map((province: any, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    borderColor: "black",
                    borderBottomWidth: 2,
                    height: Viewport.height * 0.07,
                    width: Viewport.width * 0.85,
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    setData({
                      ...data,
                      province: province.name,
                    });
                    setIsProvinceFieldFocus(false);
                  }}
                >
                  <Text
                    style={{
                      paddingLeft: Viewport.width * 0.08,
                      fontSize: FontSizes.normal,
                    }}
                  >
                    {province.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      </CustomizedModal>
      <CustomizedModal
        visible={isCityFieldFocus}
        animationType="fade"
        transparent={true}
        onCloseRequest={() => {
          setIsCityFieldFocus(false);
        }}
        viewStyle={{
          width: Viewport.width * 0.85,
          height: Viewport.height * 0.42,
          borderRadius: 25,
          backgroundColor: Colors.primaryColor2,
          gap: 10,
        }}
      >
        <ScrollView
          style={{
            right: Viewport.width * 0.08,
            bottom: Viewport.height * 0.015,
            width: Viewport.width * 0.85,
            height: Viewport.height * 0.42,
          }}
        >
          {filteredCity.length === 0 ? (
            <Text style={{ textAlign: "left", fontSize: FontSizes.normal }}>
              Please select province first to display cities and municipalities.
            </Text>
          ) : (
            <>
              {filteredCity.map((city: any, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    borderColor: "black",
                    borderBottomWidth: 2,
                    height: Viewport.height * 0.07,
                    width: Viewport.width * 0.85,
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    setData({
                      ...data,
                      city: city.name,
                    });
                    setIsCityFieldFocus(false);
                  }}
                >
                  <Text
                    style={{
                      paddingLeft: Viewport.width * 0.08,
                      fontSize: FontSizes.normal,
                    }}
                  >
                    {city.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      </CustomizedModal>
      <CustomizedModal
        visible={isBarangayFieldFocus}
        animationType="fade"
        transparent={true}
        onCloseRequest={() => {
          setIsBarangayFieldFocus(false);
        }}
        viewStyle={{
          width: Viewport.width * 0.85,
          height: Viewport.height * 0.42,
          borderRadius: 25,
          backgroundColor: Colors.primaryColor2,
          gap: 10,
        }}
      >
        <ScrollView
          style={{
            right: Viewport.width * 0.08,
            bottom: Viewport.height * 0.015,
            width: Viewport.width * 0.85,
            height: Viewport.height * 0.42,
          }}
        >
          {filteredBarangays.length === 0 ? (
            <Text style={{ textAlign: "left", fontSize: FontSizes.normal }}>
              Please select city or municipality to display barangays.
            </Text>
          ) : (
            <>
              {filteredBarangays.map((barangay: any, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    borderColor: "black",
                    borderBottomWidth: 2,
                    height: Viewport.height * 0.07,
                    width: Viewport.width * 0.85,
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    setData({
                      ...data,
                      street_3: barangay,
                    });
                    setIsBarangayFieldFocus(false);
                  }}
                >
                  <Text
                    style={{
                      paddingLeft: Viewport.width * 0.08,
                      fontSize: FontSizes.normal,
                    }}
                  >
                    {barangay}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      </CustomizedModal>
    </KeyboardAwareScrollView>
  );
}
