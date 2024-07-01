import { Text, View, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import { LinearGradientBG } from "@/components/LinearGradientBG";
import {
  customizeFont,
  Colors,
  FontSizes,
  Styles,
  Viewport,
} from "@/styles/styles";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/Button";
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";
import { ResetPasswordAPI, SigninAPI } from "@/components/Api";
import { CustomizedModal } from "@/components/CustomizedModat";

export default function Signin() {
  const fontLoaded = customizeFont();
  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isForgotPasswordPressed, setIsForgotPasswordPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [email, setEmail] = useState("");
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const [errorMessages, setErrorMessages] = useState<any[]>([]);
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleSignin = () => {
    SigninAPI(
      data,
      toast,
      setIsLoading,
      router,
      setIsSuccess,
      setIsError,
      dispatch
    );
  };
  useEffect(() => {
    let validationErrors: { [key: string]: string } = {};
    if (isErrorEmail) {
      validationErrors.email =
        "We couldn't find an account with that email address.";
    }
    const errorArray = [validationErrors];
    setErrorMessages(errorArray);
  }, [isErrorEmail]);

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
      <LinearGradientBG
        style={{
          width: Viewport.width * 1,
          height: Viewport.height * 1.1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={Styles.flexRow}>
          <Image source={require("@/assets/images/icon-logo.png")} />
          {fontLoaded[0] && (
            <Text
              style={{
                fontFamily: "InriaSans",
                color: Colors.secondaryColor1,
                fontSize: FontSizes.large,
              }}
            >
              HanapBHouse
            </Text>
          )}
        </View>
        <View
          style={{
            width: Viewport.width * 0.85,
            marginTop: Viewport.height * 0.03,
            alignItems: "center",
          }}
        >
          {fontLoaded[0] && (
            <Text
              style={{
                fontFamily: "Inter",
                color: Colors.secondaryColor1,
                fontSize: FontSizes.small,
              }}
            >
              Open your doors to new possibilities, earn with ease, find your
              ideal boarding house, and forge new connections!
            </Text>
          )}
        </View>
        <View
          style={{
            width: Viewport.width * 0.85,
            marginTop: Viewport.height * 0.03,
            alignItems: "center",
            gap: 20,
          }}
        >
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
              setData({
                ...data,
                username: value,
              });
            }}
            floatingPlaceHolder
            colors={isError ? ["error", "light-error"] : ["light"]}
          />
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
            }}
            floatingPlaceHolder
            colors={isError ? ["error", "light-error"] : ["light"]}
            secureTextEntry
          />
        </View>
        <View
          style={{
            width: Viewport.width * 0.8,
            height: Viewport.height * 0.35,
            marginTop: Viewport.height * 0.01,
            gap: 40,
          }}
        >
          <View
            style={{
              width: Viewport.width * 0.8,
              alignItems: "flex-end",
            }}
          >
            <Button
              text="Forgot password?"
              buttonStyle={{
                width: Viewport.width * 0.35,
                alignItems: "flex-end",
              }}
              textStyle={{
                color: Colors.secondaryColor1,
                fontSize: FontSizes.small,
              }}
              onPress={() => {
                setIsForgotPasswordPressed(true);
              }}
            />
          </View>
          <Button
            text="Sign in"
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
            }}
            onPress={handleSignin}
            isLoading={isLoading}
            disabled={isLoading || isSuccess ? true : false}
            loadingText="Signing in"
            loadingColor="white"
            loadingSize={25}
          />

          <Link href="/(auth)/signup" asChild>
            <Button
              text="Don't have an account?"
              text2="Sign up"
              buttonStyle={{
                width: Viewport.width * 0.8,
                height: Viewport.height * 0.04,
                justifyContent: "space-between",
                flexDirection: "row",
                backgroundColor: "transparent",
                borderColor: Colors.secondaryColor1,
                borderBottomWidth: 2,
              }}
              textStyle={{
                color: Colors.secondaryColor1,
                fontSize: FontSizes.small,
              }}
            />
          </Link>
        </View>
      </LinearGradientBG>
      <CustomizedModal
        visible={isForgotPasswordPressed}
        animationType="fade"
        onCloseRequest={() => {
          setIsForgotPasswordPressed(false);
        }}
        transparent={true}
        hasHeader={true}
        headerContent="Forgot Password?"
        headerStyle={{
          fontSize: FontSizes.medium,
          fontFamily: "Inter",
          fontWeight: "bold",
        }}
        viewStyle={{
          width: Viewport.width * 0.85,
          height: Viewport.height * 0.42,
          borderRadius: 25,
          backgroundColor: Colors.primaryColor2,
          gap: 10,
        }}
      >
        <Text
          style={{
            fontSize: FontSizes.small,
            fontFamily: "Inter",
            width: Viewport.width * 0.7,
          }}
        >
          Please input the email address registered with your account below, and
          we'll email instructions to reset your password.
        </Text>
        <View
          style={{
            height: Viewport.height * 0.06,
          }}
        >
          <InputField
            value={email}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              width: Viewport.width * 0.7,
              height: Viewport.height * 0.05,
              paddingLeft: 10,
            }}
            onChangeText={(value) => {
              setEmail(value);
              if (value && emailRegex.test(value)) {
                const updatedErrors = { ...errorMessages };
                delete updatedErrors[0]?.email;
                setErrorMessages(updatedErrors);
                setIsErrorEmail(false);
              }
            }}
            floatingPlaceHolder
            colors={errorMessages[0]?.email ? ["error"] : ["dark"]}
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: Viewport.width * 0.7,
            marginTop: Viewport.height * 0.04,
          }}
        >
          <Button
            text="Cancel"
            buttonStyle={{
              width: Viewport.width * 0.3,
              height: Viewport.height * 0.06,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                isLoading || isSuccess ? Colors.secondaryColor4 : "transparent",
              borderColor:
                isLoading || isSuccess
                  ? Colors.secondaryColor4
                  : Colors.primaryColor1,
              borderWidth: 2,
            }}
            disabled={isLoading || isSuccess ? true : false}
            textStyle={{
              color: Colors.secondaryColor3,
              fontSize: FontSizes.small,
            }}
            onPress={() => {
              setIsForgotPasswordPressed(false);
              setEmail("");
              setIsErrorEmail(false);
              const updatedErrors = { ...errorMessages };
              delete updatedErrors[0];
              setErrorMessages(updatedErrors);
            }}
          />
          <Button
            text="Proceed"
            buttonStyle={{
              width: Viewport.width * 0.33,
              height: Viewport.height * 0.06,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                isLoading || isSuccess
                  ? Colors.secondaryColor4
                  : Colors.primaryColor1,
            }}
            isLoading={isLoading}
            disabled={isLoading || isSuccess ? true : false}
            loadingText=""
            loadingColor="white"
            loadingSize={25}
            textStyle={{
              color: Colors.secondaryColor1,
              fontSize: FontSizes.small,
            }}
            onPress={() => {
              let validationErrors: { [key: string]: string } = {};
              if (!email || !emailRegex.test(email)) {
                validationErrors.email = "Please input a valid email.";
              }
              if (isErrorEmail) {
                validationErrors.email =
                  "We couldn't find an account with that email address.";
              }
              const errorArray = [validationErrors];
              setErrorMessages(errorArray);

              if (Object.keys(validationErrors).length === 0) {
                ResetPasswordAPI(
                  email,
                  toast,
                  setEmail,
                  setIsForgotPasswordPressed,
                  setIsLoading,
                  setIsSuccess,
                  setIsErrorEmail
                );
              }
            }}
          />
        </View>
      </CustomizedModal>
    </KeyboardAwareScrollView>
  );
}
