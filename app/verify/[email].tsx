import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { Fragment, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

const CELL_COUNT = 6;

const Page: React.FC = () => {
  const { signin, email } = useLocalSearchParams<{
    signin?: string;
    email: string;
  }>();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();

  useEffect(() => {
    if (code.length === CELL_COUNT) {
      signin === "true" ? verifySignIn() : verifySignUpCode();
    }
  }, [code]);

  const handleError = (err: any) => {
    console.error("Error:", JSON.stringify(err, null, 2));
    if (isClerkAPIResponseError(err)) {
      Alert.alert("Error", err.errors[0]?.message || "An unexpected error occurred.");
    } else {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const verifySignUpCode = async () => {
    setIsLoading(true);
    try {
      const signUpAttempt = await signUp?.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt?.status === "complete") {
        await setActive?.({ session: signUpAttempt.createdSessionId });
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifySignIn = async () => {
    setIsLoading(true);
    try {
      const signInAttempt = await signIn?.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });
      if (signInAttempt?.status === "complete") {
        await setActive?.({ session: signInAttempt.createdSessionId });
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>6-digit code</Text>
      <Text style={defaultStyles.descriptionText}>
        Code sent to {email}. Enter it below to proceed.
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <CodeField
          ref={ref}
          {...props}
          value={code}
          onChangeText={setCode}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Fragment key={index}>
              <Text
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
              {index === 2 && <View style={styles.separator} />}
            </Fragment>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 18,
    textAlign: "center",
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
  },
  focusCell: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  separator: {
    height: 2,
    width: 10,
    backgroundColor: Colors.gray,
    alignSelf: "center",
  },
});

export default Page;
