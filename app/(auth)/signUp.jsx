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
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import logo from "../../assets/images/logo.png";
import newImage from "../../assets/images/IMAGE3.png";
import { useGlobalContext } from "../../context/GlobalProvider";

const signUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Input validation
  const validateInputs = () => {
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

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Update profile with the user's full name
      await updateProfile(user, { displayName: fullname });

      // Add user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullname,
        phoneNumber,
        email,
        id: user.uid,
      });

      // Set user in global context and AsyncStorage
      const userData = { ...userCredential.user, fullname, phoneNumber };
      setUser(userData);

      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      // Mark the user as logged in
      setIsLogged(true);

      // Alert for email verification
      Alert.alert(
        "Verify your email",
        "A verification email has been sent to your email address. Please verify your email "
      );

      // Navigate to the next screen
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
          errorMessage =
            "Password is too weak. Please use a stronger password.";
          break;
        default:
          errorMessage = "An unknown error occurred. Please try again later.";
      }
      Alert.alert("Registration failed", errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView className="h-full flex-1 bg-gray-100">
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
              Create an Account
            </Text>
          </View>

          <FormField
            title="Full Name"
            value={fullname}
            placeholder="Enter your full name"
            handleChangeText={setFullname}
          />
          <FormField
            title="Phone Number"
            value={phoneNumber}
            placeholder="Enter your phone number"
            handleChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
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
            title="Sign Up"
            handlePress={handleSignUp}
            isLoading={isLoading}
            containerStyles="mt-6 bg-Primary"
            textStyles="text-white"
          />

          <TouchableOpacity
            onPress={() => router.push("/signIn")}
            className="mt-4"
          >
            <Text className="text-center text-blue-500">
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signUp;
