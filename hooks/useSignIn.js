// hooks/useSignIn.js
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";

const useSignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async ({ email, password }) => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert(
          "Email not verified",
          "Your email is not verified. Would you like to resend the verification email?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Resend",
              onPress: async () => {
                try {
                  await sendEmailVerification(user, {
                    handleCodeInApp: true,
                    url: "addis-fetch://",
                  });
                  Alert.alert(
                    "Verification email sent",
                    "Please check your inbox."
                  );
                } catch (error) {
                  console.error("Error sending verification email:", error);
                  Alert.alert("Error", "Failed to send verification email.");
                }
              },
            },
          ]
        );
        setIsLoading(false);
        return;
      }

      // Fetch complete user data (including fullname)
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      setUser({ ...user, ...userData });

      auth.onAuthStateChanged(async (u) => {
        if (u) {
          try {
            await AsyncStorage.setItem(
              "userData",
              JSON.stringify({ ...user, ...userData })
            );
            console.log("User data saved to AsyncStorage");
          } catch (error) {
            console.error("Error saving user data to AsyncStorage:", error);
          }
        } else {
          try {
            await AsyncStorage.removeItem("userData");
            console.log("User data removed from AsyncStorage");
          } catch (error) {
            console.error("Error removing user data from AsyncStorage:", error);
          }
        }
      });

      setIsLogged(true);
      Alert.alert("Sign-in successful", `Welcome back, ${user.email}`);
    } catch (error) {
      handleFirebaseError(error);
    } finally {
      setIsLoading(false);
      router.push("/Travlers");
    }
  };

  const handleFirebaseError = (error) => {
    switch (error.code) {
      case "auth/user-not-found":
        Alert.alert("Error", "No user found with this email.");
        break;
      case "auth/wrong-password":
        Alert.alert("Error", "Incorrect password.");
        break;
      case "auth/invalid-email":
        Alert.alert("Error", "The email address is malformed.");
        break;
      case "auth/too-many-requests":
        Alert.alert(
          "Error",
          "Too many unsuccessful login attempts. Please try again later."
        );
        break;
      default:
        Alert.alert("Error", error.message);
        break;
    }
  };

  return { handleSignIn, isLoading };
};

export default useSignIn;
