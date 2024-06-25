import { SignupAPI } from "@/components/Api";
import { Button } from "@/components/Button";
import { CircleShape } from "@/components/CircleShape";
import { InputField } from "@/components/InputField";
import { Colors, FontSizes, Viewport, customizeFont } from "@/styles/styles";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNPickerSelect from "react-native-picker-select";
import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";

export default function SignUp() {
  const fontLoaded = customizeFont();
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any[]>([]);
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    contact_number: "",
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  const handleSignup = () => {
    let validationErrors: { [key: string]: string } = {};

    const allFieldsBlank =
      !data.first_name &&
      !data.last_name &&
      !data.gender &&
      !data.contact_number &&
      !data.email &&
      !data.username &&
      !data.password &&
      !data.confirm_password;

    if (allFieldsBlank) {
      validationErrors.all = "Please fill out all the fields.";
    } else {
      if (!data.first_name) {
        validationErrors.first_name = "Please input first name.";
      }
      if (!data.last_name) {
        validationErrors.last_name = "Please input last name.";
      }
      if (!data.gender) {
        validationErrors.gender = "Please select gender.";
      }
      if (!data.contact_number || data.contact_number.length !== 11) {
        validationErrors.contact_number =
          "Please input valid 11-digit mobile number.";
      }
      if (!data.email || !emailRegex.test(data.email)) {
        validationErrors.email = "Please input a valid email.";
      }
      if (!data.username) {
        validationErrors.username = "Please input username.";
      }
      if (!passwordRegex.test(data.password)) {
        validationErrors.password =
          "Please include at least 8 characters long and include at least one uppercase letter and one number.";
      } else {
        if (data.password !== data.confirm_password) {
          validationErrors.passDoesNotMatch = "Password does not match.";
        }
      }
    }
    const errorArray = [validationErrors];
    setErrorMessages(errorArray);

    if (Object.keys(validationErrors).length === 0) {
      SignupAPI(data, toast, setIsLoading, router, setIsSuccess);
    }
  };

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
          width: Viewport.width * 1,
          height: Viewport.height * 1.1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.primaryColor2,
          position: "relative",
        }}
      >
        <CircleShape
          style={{
            backgroundColor: Colors.primaryColor3,
            bottom: Viewport.height * 0.9,
            left: Viewport.width * 0.65,
          }}
        />
        <View style={{ width: Viewport.width * 0.8 }}>
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
                Sign up
              </Text>
              <Text
                style={{
                  fontFamily: "Inter",
                  color: Colors.secondaryColor3,
                  fontSize: FontSizes.small,
                }}
              >
                Create your account to start earning, find your ideal boarding
                house, and connect with the community!
              </Text>
            </>
          )}
        </View>
        {errorMessages[0]?.all && (
          <Text
            style={{
              color: Colors.errorColor,
              fontSize: FontSizes.small,
              textAlign: "center",
            }}
          >
            {errorMessages[0]?.all}
          </Text>
        )}
        <View
          style={{
            width: Viewport.width * 0.8,
            marginTop: Viewport.height * 0.02,
            gap: 20,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ height: Viewport.height * 0.06 }}>
              <InputField
                value={data.first_name}
                placeholder="First name"
                autoCapitalize="words"
                style={{
                  width: Viewport.width * 0.38,
                  height: Viewport.height * 0.05,
                  paddingLeft: 10,
                }}
                onChangeText={(value) => {
                  if (value) {
                    setData({
                      ...data,
                      first_name: value,
                    });
                    const updatedErrors = { ...errorMessages };
                    delete updatedErrors[0]?.first_name;
                    setErrorMessages(updatedErrors);
                  } else {
                    setData({
                      ...data,
                      first_name: "",
                    });
                  }
                }}
                floatingPlaceHolder
                colors={
                  errorMessages[0]?.all || errorMessages[0]?.first_name
                    ? "error"
                    : "dark"
                }
              />
              {errorMessages[0]?.first_name && (
                <Text
                  style={{
                    color: Colors.errorColor,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                  }}
                >
                  {errorMessages[0]?.first_name}
                </Text>
              )}
            </View>

            <View style={{ height: Viewport.height * 0.06 }}>
              <InputField
                value={data.last_name}
                placeholder="Last name"
                autoCapitalize="words"
                style={{
                  width: Viewport.width * 0.38,
                  height: Viewport.height * 0.05,
                  paddingLeft: 10,
                }}
                onChangeText={(value) => {
                  if (value) {
                    setData({
                      ...data,
                      last_name: value,
                    });
                    const updatedErrors = { ...errorMessages };
                    delete updatedErrors[0]?.last_name;
                    setErrorMessages(updatedErrors);
                  } else {
                    setData({
                      ...data,
                      last_name: "",
                    });
                  }
                }}
                floatingPlaceHolder
                colors={
                  errorMessages[0]?.all || errorMessages[0]?.last_name
                    ? "error"
                    : "dark"
                }
              />
              {errorMessages[0]?.last_name && (
                <Text
                  style={{
                    color: Colors.errorColor,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                  }}
                >
                  {errorMessages[0]?.last_name}
                </Text>
              )}
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ height: Viewport.height * 0.06 }}>
              <RNPickerSelect
                value={data.gender}
                placeholder={{
                  label: "Gender",
                  value: null,
                }}
                style={{
                  placeholder: {
                    color:
                      errorMessages[0]?.all || errorMessages[0]?.gender
                        ? Colors.errorColor
                        : Colors.secondaryColor4,
                    right: 8,
                    bottom: 8,
                  },
                  viewContainer: {
                    width: Viewport.width * 0.38,
                    height: Viewport.height * 0.05,
                    borderColor:
                      errorMessages[0]?.all || errorMessages[0]?.gender
                        ? Colors.errorColor
                        : Colors.secondaryColor4,
                    borderBottomWidth: 2,
                  },
                  inputAndroid: {
                    width: Viewport.width * 0.38,
                    height: Viewport.height * 0.05,
                    color: Colors.secondaryColor3,
                    right: 8,
                    bottom: 8,
                  },
                  inputIOS: {
                    width: Viewport.width * 0.38,
                    height: Viewport.height * 0.02,
                    color: Colors.secondaryColor3,
                    right: 8,
                    bottom: 8,
                  },
                }}
                onValueChange={(value) => {
                  if (value) {
                    setData({
                      ...data,
                      gender: value,
                    });
                    const updatedErrors = { ...errorMessages };
                    delete updatedErrors[0]?.gender;
                    setErrorMessages(updatedErrors);
                  }
                }}
                items={[
                  { key: "Male", label: "Male", value: "Male" },
                  { key: "Female", label: "Female", value: "Female" },
                ]}
              />
              {errorMessages[0]?.gender && (
                <Text
                  style={{
                    color: Colors.errorColor,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                  }}
                >
                  {errorMessages[0]?.gender}
                </Text>
              )}
            </View>

            <View style={{ height: Viewport.height * 0.06 }}>
              <InputField
                value={data.contact_number}
                placeholder="Mobile number"
                autoCapitalize="words"
                keyboardType="numeric"
                style={{
                  width: Viewport.width * 0.38,
                  height: Viewport.height * 0.05,
                  paddingLeft: 10,
                }}
                onChangeText={(value) => {
                  if (value) {
                    setData({
                      ...data,
                      contact_number: value,
                    });
                    const updatedErrors = { ...errorMessages };
                    delete updatedErrors[0]?.contact_number;
                    setErrorMessages(updatedErrors);
                  } else {
                    setData({
                      ...data,
                      contact_number: "",
                    });
                  }
                }}
                floatingPlaceHolder
                colors={
                  errorMessages[0]?.all || errorMessages[0]?.contact_number
                    ? "error"
                    : "dark"
                }
              />
              {errorMessages[0]?.contact_number && (
                <Text
                  style={{
                    color: Colors.errorColor,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                    width: Viewport.width * 0.38,
                  }}
                >
                  {errorMessages[0]?.contact_number}
                </Text>
              )}
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ height: Viewport.height * 0.06 }}>
              <InputField
                value={data.email}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                style={{
                  width: Viewport.width * 0.8,
                  height: Viewport.height * 0.05,
                  paddingLeft: 10,
                }}
                onChangeText={(value) => {
                  setData({
                    ...data,
                    email: value,
                  });
                  if (value && emailRegex.test(value)) {
                    const updatedErrors = { ...errorMessages };
                    delete updatedErrors[0]?.email;
                    setErrorMessages(updatedErrors);
                  }
                }}
                floatingPlaceHolder
                colors={
                  errorMessages[0]?.all || errorMessages[0]?.email
                    ? "error"
                    : "dark"
                }
              />
              {errorMessages[0]?.email && (
                <Text
                  style={{
                    color: Colors.errorColor,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                  }}
                >
                  {errorMessages[0]?.email}
                </Text>
              )}
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ height: Viewport.height * 0.06 }}>
              <InputField
                value={data.username}
                placeholder="Username"
                autoCapitalize="none"
                style={{
                  width: Viewport.width * 0.8,
                  height: Viewport.height * 0.05,
                  paddingLeft: 10,
                }}
                onChangeText={(value) => {
                  if (value) {
                    setData({
                      ...data,
                      username: value,
                    });
                    const updatedErrors = { ...errorMessages };
                    delete updatedErrors[0]?.username;
                    setErrorMessages(updatedErrors);
                  } else {
                    setData({
                      ...data,
                      username: "",
                    });
                  }
                }}
                floatingPlaceHolder
                colors={
                  errorMessages[0]?.all || errorMessages[0]?.username
                    ? "error"
                    : "dark"
                }
              />
              {errorMessages[0]?.username && (
                <Text
                  style={{
                    color: Colors.errorColor,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                  }}
                >
                  {errorMessages[0]?.username}
                </Text>
              )}
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                height: !errorMessages[0]?.passDoesNotMatch
                  ? Viewport.height * 0.075
                  : Viewport.height * 0.06,
              }}
            >
              <InputField
                value={data.password}
                placeholder="Password"
                autoCapitalize="none"
                style={{
                  width: Viewport.width * 0.8,
                  height: Viewport.height * 0.05,
                  paddingLeft: 10,
                }}
                onChangeText={(value) => {
                  setData({
                    ...data,
                    password: value,
                  });
                  if (passwordRegex.test(value)) {
                    const updatedErrors = { ...errorMessages };
                    delete updatedErrors[0]?.password;
                    setErrorMessages(updatedErrors);
                  }
                  if (value === data.confirm_password) {
                    const updatedErrors = { ...errorMessages };
                    delete updatedErrors[0]?.passDoesNotMatch;
                    setErrorMessages(updatedErrors);
                  }
                }}
                floatingPlaceHolder
                secureTextEntry
                colors={
                  errorMessages[0]?.all ||
                  errorMessages[0]?.password ||
                  errorMessages[0]?.passDoesNotMatch
                    ? "error"
                    : "dark"
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
                  {passwordRegex.test(data.password)
                    ? ""
                    : "Please include at least 8 characters long and include at least one uppercase letter and one number."}
                </Text>
              )}
              {errorMessages[0]?.passDoesNotMatch && (
                <Text
                  style={{
                    color: Colors.errorColor,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                  }}
                >
                  {errorMessages[0]?.passDoesNotMatch}
                </Text>
              )}
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ height: Viewport.height * 0.05 }}>
              <InputField
                value={data.confirm_password}
                placeholder="Confirm password"
                autoCapitalize="none"
                style={{
                  width: Viewport.width * 0.8,
                  height: Viewport.height * 0.05,
                  paddingLeft: 10,
                }}
                onChangeText={(value) => {
                  setData({
                    ...data,
                    confirm_password: value,
                  });
                  if (value === data.password) {
                    const updatedErrors = { ...errorMessages };
                    delete updatedErrors[0]?.passDoesNotMatch;
                    setErrorMessages(updatedErrors);
                  }
                }}
                floatingPlaceHolder
                secureTextEntry
                colors={
                  errorMessages[0]?.all || errorMessages[0]?.passDoesNotMatch
                    ? "error"
                    : "dark"
                }
              />
              {errorMessages[0]?.passDoesNotMatch && (
                <Text
                  style={{
                    color: Colors.errorColor,
                    fontSize: FontSizes.tiny,
                    textAlign: "left",
                  }}
                >
                  {errorMessages[0]?.passDoesNotMatch}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            width: Viewport.width * 0.8,
            height: Viewport.height * 0.15,
            marginTop: Viewport.height * 0.05,
            gap: 20,
          }}
        >
          <Button
            text="Sign up"
            buttonStyle={{
              width: Viewport.width * 0.8,
              height: Viewport.height * 0.06,
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
              alignItems: "center",
              textAlign: "center",
            }}
            onPress={handleSignup}
            isLoading={isLoading}
            disabled={isLoading || isSuccess ? true : false}
            loadingText="Signing up"
            loadingColor="white"
            loadingSize={25}
          />

          <Link href="/(auth)/(signin)" asChild>
            <Button
              text="Already have an account?"
              text2="Sign in"
              buttonStyle={{
                width: Viewport.width * 0.8,
                height: Viewport.height * 0.04,
                justifyContent: "space-between",
                flexDirection: "row",
                backgroundColor: "transparent",
                borderColor: Colors.secondaryColor3,
                borderBottomWidth: 2,
              }}
              textStyle={{
                color: Colors.secondaryColor3,
                fontSize: FontSizes.small,
              }}
            />
          </Link>
        </View>
        <CircleShape
          style={{
            backgroundColor: Colors.primaryColor4,
            top: Viewport.height * 0.9,
            right: Viewport.width * 0.65,
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
