import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import logo from "../../assets/images/logo.png";
import newImage from "../../assets/images/IMAGE3.png";

const signIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateInputs = () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Email and password are required.");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      if (!user.emailVerified) {
        // Prompt the user to verify their email
        Alert.alert(
          "Email not verified",
          "Your email is not verified. Check you email to verify",
          [
            {
              text: "resend",
              onPress: async () => {
                try {
                  // const actionCodeSettings = {
                  //   url: "addis-fetch://verify", // Custom scheme URL
                  //   handleCodeInApp: true,
                  // };
                  await sendEmailVerification(userCredential.user);
                  Alert.alert(
                    "Verification Email Sent",
                    "A verification email has been sent to your email address. Please verify your email "
                  );
                  await finalizeSignIn(user);
                } catch (verificationError) {
                  Alert.alert("Error", verificationError.message);
                }
              },
            },
            {
              text: "ok",
              onPress: async () => {
                // Allow the user to continue without verification
                await finalizeSignIn(user);
              },
              style: "cancel",
            },
          ]
        );
      } else {
        await finalizeSignIn(user);
      }
    } catch (error) {
      console.log("error", error);
      let errorMessage;
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "The email address is badly formatted.";
          break;
        case "auth/user-not-found":
          errorMessage = "No user found with this email.";
          break;
        case "auth/invalid-credential":
          errorMessage = "Incorrect inputs. Please try again.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Please check your network";
        default:
          errorMessage = "An unknown error occurred. Please try again later.";
      }
      Alert.alert("Sign-in failed", errorMessage);
    }

    setIsLoading(false);
  };

  const finalizeSignIn = async (user) => {
    setIsLoading(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      setUser({ ...user, ...userData });

      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({ ...user, ...userData })
      );

      setIsLogged(true);
      Alert.alert(
        "Sign-in successful",
        `Welcome back, ${userData.fullname || user.email}`
      );
      router.replace("/Travlers");
    } catch (error) {
      console.error("Error during finalizing sign-in:", error);
      Alert.alert(
        "Error",
        "An error occurred while signing in. Please try again."
      );
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="h-full flex-1 bg-gray-100 ">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <View className="flex-1 justify-center px-6 py-8">
          <View className="mb-8 items-center">
            <Image source={newImage} className="w-24 h-24" />
            <Text className="text-Primary text-3xl font-bold mt-2">
              Sign In
            </Text>
          </View>

          <FormField
            title="Email"
            value={email}
            placeholder="Enter your email"
            handleChangeText={setEmail}
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={password}
            placeholder="Enter your password"
            handleChangeText={setPassword}
          />

          <CustomButton
            title="Sign In"
            handlePress={handleSignIn}
            isLoading={isLoading}
            containerStyles="mt-6 bg-Primary"
            textStyles="text-white"
          />

          <TouchableOpacity
            onPress={() => router.push("/signUp")}
            className="mt-4"
          >
            <Text className="text-center text-blue-500">
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;
