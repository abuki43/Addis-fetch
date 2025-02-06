import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  useWindowDimensions,
  Pressable,
  Linking,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import newImage from "../../assets/images/IMAGE3.png";
import { useGlobalContext } from "../../context/GlobalProvider";
import { handleSignUp } from "../../lib/signUp";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const router = useRouter();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // URLs for external policies
  const TERMS_URL = "https://addis-fetchet.onrender.com/policy.html";
  const PRIVACY_URL = "https://addis-fetchet.onrender.com/policy.html";

  const handleSubmit = async () => {
    if (!acceptPolicy) {
      Alert.alert(
        "Terms & Conditions",
        "Please accept the Terms & Conditions to continue"
      );
      return;
    }

    await handleSignUp(
      fullname,
      phoneNumber,
      email,
      password,
      setUser,
      setIsLogged,
      router,
      setIsLoading
    );
  };

  const openExternalLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Error",
          "Sorry, we couldn't open this link. Please try again later."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Something went wrong while opening the link. Please try again later."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView
        className={`flex-1 grow ${isTablet ? "px-16" : "px-4"}`}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <View
          className={`flex-1 justify-center self-center w-full py-4 px-3
            ${isTablet ? "max-w-[550px]" : "max-w-[350px]"}`}
        >
          <View className="mb-8 items-center">
            <Image source={newImage} className="w-32 h-32" />
            <Text
              className={`text-blue-900 font-bold mt-2
                ${isTablet ? "text-4xl" : "text-2xl"}`}
            >
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
            secureTextEntry
          />

          <View className="flex-row items-center mt-4 mb-6">
            <Pressable
              onPress={() => setAcceptPolicy(!acceptPolicy)}
              className="mr-3"
            >
              <View
                className={`w-6 h-6 border-2 rounded ${
                  acceptPolicy
                    ? "bg-Primary border-Primary"
                    : "border-gray-300 bg-white"
                } justify-center items-center`}
              >
                {acceptPolicy && <Text className="text-white text-sm">✓</Text>}
              </View>
            </Pressable>
            <Text className="flex-1 text-gray-600">
              I accept the{" "}
              <Text
                className="text-Primary underline"
                onPress={() => openExternalLink(TERMS_URL)}
              >
                Terms & Conditions
              </Text>{" "}
              and{" "}
              <Text
                className="text-Primary underline"
                onPress={() => openExternalLink(PRIVACY_URL)}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>

          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            isLoading={isLoading}
            containerStyles="mt-6 bg-Primary"
            textStyles="text-white"
          />

          <TouchableOpacity
            className="mt-4"
            onPress={() => router.push("/signIn")}
          >
            <Text
              className={`text-center text-blue-500
                ${isTablet ? "text-lg" : "text-sm"}`}
            >
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
