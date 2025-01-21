import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";

enum SigninType {
  Phone,
  Email,
  Google,
  Apple,
}
const Page = () => {
  const [countryCode, setCountryCode] = useState("+234");
  const [phoneNumber, setPhoneNumber] = useState("");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const router = useRouter();
  const { signIn } = useSignIn();

  const onSignIn = async (type: SigninType) => {
    if (type === SigninType.Phone) {
      const fullPhoneNumber = `${countryCode} ${phoneNumber}`;
      try {
        const { supportedFirstFactors } = await signIn!.create({
          identifier: fullPhoneNumber,
        });
        const firstPhoneFactor: any = supportedFirstFactors?.find(
          (factor: any) => {
            return factor.strategy === "phone_code";
          }
        );
        const { phoneNumberId } = firstPhoneFactor;

        await signIn!.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });
        router.push({
          pathname: "/verify/[phone]",
          params: { phone: fullPhoneNumber, signIn: 'true' },
        });
      } catch (err) {
        console.error("error", JSON.stringify(err, null, 2));
        if(isClerkAPIResponseError(err)) {
          if(err.errors[0].code === 'form_identifier_not_found'){
            Alert.alert('Error', err.errors[0].message)
          }
        }
      }
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome back!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter the phone number associated with your account.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Country Code"
            style={styles.input}
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            value={countryCode}
            onChangeText={setCountryCode}
          />
          <TextInput
            placeholder="Mobile number"
            style={[styles.input, { flex: 1 }]}
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <TouchableOpacity
          disabled={phoneNumber === ""}
          style={[
            defaultStyles.pillButton,
            phoneNumber !== "" ? styles.enabled : styles.disabled,
            { marginBottom: 20, marginTop: 5 },
          ]}
          onPress={() => onSignIn(SigninType.Phone)}
        >
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
          <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
          <View
            style={{
              flex: 1,
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.gray,
            }}
          />
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              marginTop: 20,
              backgroundColor: "#fff",
            },
          ]}
          onPress={() => onSignIn(SigninType.Email)}
        >
          <Ionicons name="mail" size={24} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: Colors.dark }]}>
            Sign in with Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              marginTop: 20,
              backgroundColor: "#fff",
            },
          ]}
          onPress={() => onSignIn(SigninType.Google)}
        >
          <Ionicons name="logo-google" size={24} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: Colors.dark }]}>
            Sign in with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              marginTop: 20,
              backgroundColor: "#fff",
            },
          ]}
          onPress={() => onSignIn(SigninType.Apple)}
        >
          <Ionicons name="logo-apple" size={24} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: Colors.dark }]}>
            Sign in with Apple
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: "row",
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 18,
    marginRight: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});
export default Page;
