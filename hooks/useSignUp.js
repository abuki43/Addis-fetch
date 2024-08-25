// hooks/useSignUp.js
import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";

const useSignUp = () => {
  const { setUser, setIsLogged, user: userData } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async ({ fullname, phoneNumber, email, password }) => {
    if (!fullname || !phoneNumber || !email || !password) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullname });
      await sendEmailVerification(user, {
        handleCodeInApp: true,
        url: "addis-fetch://",
      });

      await setDoc(doc(db, "users", user.uid), {
        fullname,
        phoneNumber,
        email,
        id: user.uid,
      });

      setUser({ ...userCredential.user, ...userData });

      auth.onAuthStateChanged(async (u) => {
        if (u) {
          try {
            await AsyncStorage.setItem(
              "userData",
              JSON.stringify({ ...userCredential.user, ...userData })
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
      Alert.alert("Success", "Verify your email!");
      router.push("/Travlers");
    } catch (error) {
      handleFirebaseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirebaseError = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        Alert.alert("Error", "This email address is already in use.");
        break;
      case "auth/invalid-email":
        Alert.alert("Error", "The email address is invalid.");
        break;
      case "auth/operation-not-allowed":
        Alert.alert("Error", "Email/password accounts are not enabled.");
        break;
      case "auth/weak-password":
        Alert.alert("Error", "The password is too weak.");
        break;
      default:
        Alert.alert("Error", error.message);
        break;
    }
  };

  return { handleSignUp, isLoading };
};

export default useSignUp;
