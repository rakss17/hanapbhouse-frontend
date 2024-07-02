import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { Colors, FontSizes, Viewport, customizeFont } from "@/styles/styles";
import { CircleShape } from "@/components/CircleShape";
import { StatusBar } from "expo-status-bar";
import { FinishingAdmissionAPI } from "@/components/Api";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CustomizedModal } from "@/components/CustomizedModat";
import phPlaces from "@/assets/ph_places/data.json";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function Admission() {
  const fontLoaded = customizeFont();
  const admissionStatus = useSelector(
    (state: RootState) => state.statusInfo.on_admission
  );
  const dispatch = useDispatch();
  const [errorMessages, setErrorMessages] = useState<any[]>([]);
  const [isRegionFieldFocus, setIsRegionFieldFocus] = useState(false);
  const [isProvinceFieldFocus, setIsProvinceFieldFocus] = useState(false);
  const [isCityFieldFocus, setIsCityFieldFocus] = useState(false);
  const [isBarangayFieldFocus, setIsBarangayFieldFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const [data, setData] = useState({
    street_3: "",
    city: "",
    province: "",
    region: "",
  });

  useFocusEffect(
    useCallback(() => {
      if (!admissionStatus) {
        router.push("/(tabs)");
      }
    }, [!admissionStatus])
  );

  const handleContinue = () => {
    let validationErrors: { [key: string]: string } = {};

    const allFieldsBlank =
      !data.region && !data.province && !data.city && !data.street_3;

    if (allFieldsBlank) {
      validationErrors.all = "Please fill out all the fields.";
      toast.show("Please fill out all the fields", {
        type: "danger",
        placement: "top",
        duration: 6000,
        animationType: "slide-in",
      });
    } else {
      if (!data.region) {
        validationErrors.regionError = "Please select region.";
      }
      if (!data.province) {
        validationErrors.provinceError = "Please select province.";
      }
      if (!data.city) {
        validationErrors.cityError = "Please select city or municipality.";
      }
      if (!data.street_3) {
        validationErrors.barangayError = "Please select barangay.";
      }
    }

    const errorArray = [validationErrors];
    setErrorMessages(errorArray);

    if (Object.keys(validationErrors).length === 0) {
      const preferredArea = `${data.street_3}, ${data.city}`;
      FinishingAdmissionAPI(
        preferredArea,
        toast,
        router,
        setIsLoading,
        setIsSuccess,
        setData,
        dispatch
      );
    }
  };

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
                  errorMessages[0]?.all || errorMessages[0]?.regionError
                    ? ["error"]
                    : ["dark"]
                }
              />
              {errorMessages[0]?.regionError && (
                <Text
                  style={{
                    color:
                      errorMessages[0]?.regionError || errorMessages[0]?.all
                        ? Colors.errorColor
                        : Colors.secondaryColor3,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                    fontWeight:
                      errorMessages[0]?.regionError || errorMessages[0]?.all
                        ? "normal"
                        : "bold",
                  }}
                >
                  {errorMessages[0]?.regionError}
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
                  errorMessages[0]?.all || errorMessages[0]?.provinceError
                    ? ["error"]
                    : ["dark"]
                }
              />
              {errorMessages[0]?.provinceError && (
                <Text
                  style={{
                    color:
                      errorMessages[0]?.provinceError || errorMessages[0]?.all
                        ? Colors.errorColor
                        : Colors.secondaryColor3,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                    fontWeight:
                      errorMessages[0]?.provinceError || errorMessages[0]?.all
                        ? "normal"
                        : "bold",
                  }}
                >
                  {errorMessages[0]?.provinceError}
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
                  errorMessages[0]?.all || errorMessages[0]?.cityError
                    ? ["error"]
                    : ["dark"]
                }
              />
              {errorMessages[0]?.cityError && (
                <Text
                  style={{
                    color:
                      errorMessages[0]?.cityError || errorMessages[0]?.all
                        ? Colors.errorColor
                        : Colors.secondaryColor3,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                    fontWeight:
                      errorMessages[0]?.cityError || errorMessages[0]?.all
                        ? "normal"
                        : "bold",
                  }}
                >
                  {errorMessages[0]?.cityError}
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
                  errorMessages[0]?.all || errorMessages[0]?.barangayError
                    ? ["error"]
                    : ["dark"]
                }
              />
              {errorMessages[0]?.barangayError && (
                <Text
                  style={{
                    color:
                      errorMessages[0]?.barangayError || errorMessages[0]?.all
                        ? Colors.errorColor
                        : Colors.secondaryColor3,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                    fontWeight:
                      errorMessages[0]?.barangayError || errorMessages[0]?.all
                        ? "normal"
                        : "bold",
                  }}
                >
                  {errorMessages[0]?.barangayError}
                </Text>
              )}
            </View>
            <Button
              text="Continue"
              buttonStyle={{
                width: Viewport.width * 0.8,
                height: Viewport.height * 0.06,
                marginTop: Viewport.height * 0.03,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  isLoading || isSuccess
                    ? Colors.secondaryColor4
                    : Colors.primaryColor1,
              }}
              textStyle={{
                color: Colors.secondaryColor1,
                fontSize: FontSizes.small,
              }}
              onPress={handleContinue}
              isLoading={isLoading}
              disabled={isLoading || isSuccess ? true : false}
              loadingText=""
              loadingColor="white"
              loadingSize={25}
            />
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
                setIsRegionFieldFocus(false);
                if (data.region && data.region !== region.regionName) {
                  setData({
                    ...data,
                    region: region.regionName,
                    province: "",
                    city: "",
                    street_3: "",
                  });
                } else {
                  setData({
                    ...data,
                    region: region.regionName,
                  });
                }
                const updatedErrors = { ...errorMessages };
                delete updatedErrors[0]?.all;
                delete updatedErrors[0]?.regionError;
                setErrorMessages(updatedErrors);
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
                    setIsProvinceFieldFocus(false);
                    if (data.province && data.province !== province.name) {
                      setData({
                        ...data,
                        province: province.name,
                        city: "",
                        street_3: "",
                      });
                    } else {
                      setData({
                        ...data,
                        province: province.name,
                      });
                    }

                    const updatedErrors = { ...errorMessages };
                    delete updatedErrors[0]?.provinceError;
                    setErrorMessages(updatedErrors);
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
                    setIsCityFieldFocus(false);
                    if (data.city && data.city !== city.name) {
                      setData({
                        ...data,
                        city: city.name,
                        street_3: "",
                      });
                    } else {
                      setData({
                        ...data,
                        city: city.name,
                      });
                    }
                    const updatedErrors = { ...errorMessages };
                    delete updatedErrors[0]?.cityError;
                    setErrorMessages(updatedErrors);
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
                    setIsBarangayFieldFocus(false);
                    setData({
                      ...data,
                      street_3: barangay,
                    });
                    const updatedErrors = { ...errorMessages };
                    delete updatedErrors[0]?.barangayError;
                    setErrorMessages(updatedErrors);
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
