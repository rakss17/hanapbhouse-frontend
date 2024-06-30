import { View, Text } from "react-native";
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

export default function ResetPassword() {
  const fontLoaded = customizeFont();
  const [errorMessages, setErrorMessages] = useState<any[]>([]);
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState({
    uid: "",
    token: "",
    password: "",
    confirm_password: "",
  });
  const toast = useToast();
  const router = useRouter();
  const params = useGlobalSearchParams();
  const uid = params.slug3;
  const token = params.slug4;

  useEffect(() => {
    if (uid && token) {
      setData({
        ...data,
        uid: String(uid),
        token: String(token),
      });
    }
  }, [uid, token]);

  const handleResetPassword = () => {
    let validationErrors: { [key: string]: string } = {};
    if (!passwordRegex.test(data.password)) {
      validationErrors.password =
        "Please include at least 8 characters long and include at least one uppercase letter and one number.";
    } else {
      if (data.password !== data.confirm_password) {
        validationErrors.passDoesNotMatch = "Password does not match.";
      }
    }
    const errorArray = [validationErrors];
    setErrorMessages(errorArray);

    if (Object.keys(validationErrors).length === 0) {
      ResetPasswordConfirmAPI(
        data.uid,
        data.token,
        data.password,
        toast,
        router,
        setIsLoading,
        setIsSuccess,
        setData
      );
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
          backgroundColor: Colors.primaryColor2,
          flex: 1,
          position: "relative",
          gap: 20,
          alignItems: "center",
        }}
      >
        <CircleShape
          style={{
            backgroundColor: Colors.primaryColor3,
            bottom: Viewport.height * 0.9,
            left: Viewport.width * 0.65,
          }}
        />
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
                Create a new password
              </Text>
            </>
          )}
        </View>

        <View
          style={{
            height: !errorMessages[0]?.passDoesNotMatch
              ? Viewport.height * 0.075
              : Viewport.height * 0.06,
            width: Viewport.width * 0.8,
          }}
        >
          <InputField
            value={data.password}
            placeholder="New password"
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

        <View
          style={{
            height: Viewport.height * 0.05,
            marginTop: Viewport.width * 0.02,
          }}
        >
          <InputField
            value={data.confirm_password}
            placeholder="Confirm new password"
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
                ? ["error"]
                : ["dark"]
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

        <Button
          text="Proceed"
          buttonStyle={{
            width: Viewport.width * 0.8,
            height: Viewport.height * 0.06,
            marginTop: Viewport.width * 0.03,
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
          onPress={handleResetPassword}
          isLoading={isLoading}
          disabled={isLoading || isSuccess ? true : false}
          loadingText=""
          loadingColor="white"
          loadingSize={25}
        />

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
