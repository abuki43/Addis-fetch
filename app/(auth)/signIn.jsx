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
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import getDoc
import { auth, db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../../assets/images/logo.png";

const signIn = () => {
  const { setUser, setIsLogged, user } = useGlobalContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Fetch complete user data (including fullname)
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef); // Use getDoc to fetch the document
      const userData = userDoc.data();

      setUser({ ...userCredential.user, ...userData }); // Merge user data

      console.log("user", userData, userCredential.user.uid);

      // Add an authentication state change listener
      auth.onAuthStateChanged((u) => {
        if (u) {
          // User is signed in, save the user object to AsyncStorage
          console.log("User is signed in");
          AsyncStorage.setItem(
            "userData",
            JSON.stringify({ ...userCredential.user, ...userData })
          )
            .then(() => {
              console.log("User data saved to AsyncStorage");
            })
            .catch((error) => {
              console.error("Error saving user data to AsyncStorage:", error);
            });
        } else {
          // User is signed out, remove user data from AsyncStorage
          AsyncStorage.removeItem("userData")
            .then(() => {
              console.log("User dataData removed from AsyncStorage");
            })
            .catch((error) => {
              console.error(
                "Error removing user data from AsyncStorage:",
                error
              );
            });
        }
      }); // Use userData to access the fullname
      setIsLogged(true);
      Alert.alert(
        "Sign-in successful",
        `Welcome back, ${userCredential.user.email}`
      );
      router.push("/Travlers");
    } catch (error) {
      Alert.alert("Sign-in failed", error.message);
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="h-full flex-1 bg-slate-50">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <View className="flex-1 justify-center px-6 py-8">
          <View className="mb-8 items-center">
            <Image source={logo} className="w-20 h-20" />
            <Text className="text-Primary text-3xl font-bold mt-4">
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

          <Text className="text-center text-gray-600 mt-4">
            or sign in with
          </Text>

          <View className="flex flex-row justify-between mt-6">
            <TouchableOpacity className="bg-red-500 flex-1 py-3 rounded-lg mr-2 flex flex-row items-center justify-center">
              <Image
                source={{
                  uri: "https://img.icons8.com/color/48/000000/google-logo.png",
                }}
                className="w-6 h-6 mr-2"
              />
              <Text className="text-white text-lg font-semibold">Google</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-600 flex-1 py-3 rounded-lg ml-2 flex flex-row items-center justify-center">
              <Image
                source={{
                  uri: "https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png",
                }}
                className="w-6 h-6 mr-2"
              />
              <Text className="text-white text-lg font-semibold">Facebook</Text>
            </TouchableOpacity>
          </View>

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
