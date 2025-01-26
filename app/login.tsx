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
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const onSignIn = React.useCallback(
    async (type: SigninType) => {
      if (type === SigninType.Email) {
        if (!isLoaded) return;

        // Start the sign-in process using the email and password provided
        try {
          const signInAttempt = await signIn!.create({
            identifier: emailAddress,
            password,
          });

          // If sign-in process is complete, set the created session as active
          // and redirect the user
          if (signInAttempt.status === "complete") {
            await setActive({ session: signInAttempt.createdSessionId });

            router.replace("/");
          } else {
            // If the status isn't complete, check why. User might need to
            // complete further steps.
            console.error(JSON.stringify(signInAttempt, null, 2));
          }
        } catch (err) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.error(JSON.stringify(err, null, 2));
        }
      }
    },
    [isLoaded, emailAddress, password]
  );
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
          {/* <TextInput
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
          /> */}
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            style={[styles.input]}
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <TextInput
            value={password}
            placeholder="Enter password"
            secureTextEntry={true}
            style={[styles.input]}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <TouchableOpacity
          disabled={emailAddress === "" || password === ""}
          style={[
            defaultStyles.pillButton,
            emailAddress !== "" ? styles.enabled : styles.disabled,
            { marginBottom: 20, marginTop: 5 },
          ]}
          onPress={() => onSignIn(SigninType.Email)}
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
    marginVertical: 20,
    // flexDirection: "row",
    gap: 20,
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 10,
    borderRadius: 12,
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
