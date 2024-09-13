import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// General input validation for the sign-in process
const validateSignInInputs = (email, password) => {
  if (!email || !password) {
    Alert.alert("Validation Error", "Email and password are required.");
    return false;
  }

  return true;
};

// Function to handle user sign-in
export const handleSignIn = async (
  email,
  password,
  setUser,
  setIsLogged,
  router,
  setIsLoading
) => {
  if (!validateSignInInputs(email, password)) return;

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
        "Your email is not verified. Check your email to verify",
        [
          {
            text: "Resend",
            onPress: async () => {
              try {
                await sendEmailVerification(user);
                Alert.alert(
                  "Verification Email Sent",
                  "A verification email has been sent to your email address. Please verify your email."
                );
                await finalizeSignIn(
                  user,
                  setUser,
                  setIsLogged,
                  router,
                  setIsLoading
                );
              } catch (verificationError) {
                Alert.alert("Error", verificationError.message);
              }
            },
          },
          {
            text: "OK",
            onPress: async () => {
              await finalizeSignIn(
                user,
                setUser,
                setIsLogged,
                router,
                setIsLoading
              );
            },
            style: "cancel",
          },
        ]
      );
    } else {
      await finalizeSignIn(user, setUser, setIsLogged, router, setIsLoading);
    }
  } catch (error) {
    console.log("error", error);
    let errorMessage;
    switch (error.code) {
      case "auth/invalid-credential":
        errorMessage = "The credential is not valid. Please try again.";
        break;
      case "auth/invalid-email":
        errorMessage = "The email address is badly formatted.";
        break;
      case "auth/user-not-found":
        errorMessage = "No user found with this email.";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect email or password. Please try again.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Please check your network connection.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    Alert.alert("Sign-in failed", errorMessage);
  }

  setIsLoading(false);
};

// Function to finalize user sign-in
export const finalizeSignIn = async (
  user,
  setUser,
  setIsLogged,
  router,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();

    const minimalUserData = {
      uid: user.uid,
      email: user.email,
      fullname: userData.fullname,
      phoneNumber: userData.phoneNumber,
      bio: userData?.bio,
    };

    setUser(minimalUserData);

    // Store only minimal data in AsyncStorage
    await AsyncStorage.setItem("userData", JSON.stringify(minimalUserData));

    // setUser({ ...user, ...userData });

    // await AsyncStorage.setItem(
    //   "userData",
    //   JSON.stringify({ ...user, ...userData })
    // );

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
