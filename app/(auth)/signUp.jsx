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
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import logo from "../../assets/images/logo.png";

const signUp = () => {
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update profile (if needed)
      await updateProfile(user, { displayName: fullname });

      // Add user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullname,
        phoneNumber,
        email,
        id: user?.uid,
      });

      // Send verification email
      // await sendEmailVerification(user); // Use sendEmailVerification() directly
      Alert.alert("user registered successfully!");

      // Navigate to the next screen
      router.push("/Travlers");
    } catch (error) {
      Alert.alert("Registration failed", error.message);
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

          <Text className="text-center text-gray-600 mt-4">
            or sign up with
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
