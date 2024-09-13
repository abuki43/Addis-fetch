import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// Function to validate sign-up inputs
const validateInputs = (fullname, phoneNumber, email, password) => {
  if (!fullname || !phoneNumber || !email || !password) {
    Alert.alert("Validation Error", "All fields are required.");
    return false;
  }

  // Simple regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Validation Error", "Please enter a valid email address.");
    return false;
  }

  // Simple password length check
  if (password.length < 6) {
    Alert.alert(
      "Validation Error",
      "Password should be at least 6 characters long."
    );
    return false;
  }

  return true;
};

// Function to handle user sign-up
export const handleSignUp = async (
  fullname,
  phoneNumber,
  email,
  password,
  setUser,
  setIsLogged,
  router,
  setIsLoading
) => {
  if (!validateInputs(fullname, phoneNumber, email, password)) return;

  setIsLoading(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await sendEmailVerification(user);
    await updateProfile(user, { displayName: fullname });

    await setDoc(doc(db, "users", user.uid), {
      fullname,
      phoneNumber,
      email,
      id: user.uid,
    });

    const minimalUserData = {
      uid: user.uid,
      email: user.email,
      fullname,
      phoneNumber,
    };

    setUser(minimalUserData);

    // Store only minimal data in AsyncStorage
    await AsyncStorage.setItem("userData", JSON.stringify(minimalUserData));

    setIsLogged(true);

    Alert.alert(
      "Verify your email",
      "A verification email has been sent to your email address. Please verify your email."
    );

    router.replace("/Travlers");
  } catch (error) {
    console.log(error);
    let errorMessage;
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "This email is already in use. Please try another.";
        break;
      case "auth/invalid-email":
        errorMessage = "The email address is badly formatted.";
        break;
      case "auth/weak-password":
        errorMessage = "Password is too weak. Please use a stronger password.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    Alert.alert("Registration failed", errorMessage);
  }

  setIsLoading(false);
};
