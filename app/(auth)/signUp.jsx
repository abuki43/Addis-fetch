import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  useWindowDimensions,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import newImage from "../../assets/images/IMAGE3.png";
import { useGlobalContext } from "../../context/GlobalProvider";
import { handleSignUp } from "../../lib/signUp";

const signUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Get screen width to adjust styles dynamically
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SafeAreaView className="h-full flex-1 bg-gray-100">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: isTablet ? 64 : 16,
        }}
      >
        <View
          className="flex-1 justify-center px-6 py-8 "
          style={{
            alignSelf: "center", // Center contents horizontally
            maxWidth: 550, // Limit content width on tablets
            width: "100%", // Ensure responsiveness
            paddingVertical: 16,
          }}
        >
          <View className="mb-8 items-center">
            <Image source={newImage} className="w-32 h-32" />
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
            handlePress={() =>
              handleSignUp(
                fullname,
                phoneNumber,
                email,
                password,
                setUser,
                setIsLogged,
                router,
                setIsLoading
              )
            }
            isLoading={isLoading}
            containerStyles="mt-6 bg-Primary"
            textStyles="text-white"
          />

          <TouchableOpacity
            onPress={() => router.push("/signIn")}
            className="mt-4"
          >
            <Text
              className="text-center text-blue-500"
              style={{ fontSize: 16 }}
            >
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signUp;
