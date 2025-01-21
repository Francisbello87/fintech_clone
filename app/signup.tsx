import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";

const Page = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const router = useRouter();
  const { signUp } = useSignUp();
  const onSignUp = async () => {
    try {
      await signUp!.create({
        emailAddress,
        password,
      });
      await signUp!.prepareEmailAddressVerification({ strategy: "email_code" });
      router.push({
        pathname: "/verify/[email]",
        params: { email: emailAddress },
      });
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your email. We will send you a confirmation code there.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor={Colors.gray}
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            value={password}
            placeholder="Enter password"
            secureTextEntry={true}
            style={styles.input}
            placeholderTextColor={Colors.gray}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 18 }}>Already have an account?</Text>
          <Link href={"/login"} asChild style={{ marginLeft: 5 }} replace>
            <TouchableOpacity>
              <Text style={defaultStyles.textLink}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          disabled={emailAddress === "" || password === ""}
          style={[
            defaultStyles.pillButton,
            emailAddress !== "" && password !== ""
              ? styles.enabled
              : styles.disabled,
            { marginBottom: 20, marginTop: 5 },
          ]}
          onPress={onSignUp}
        >
          <Text style={defaultStyles.buttonText}>Sign up</Text>
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
