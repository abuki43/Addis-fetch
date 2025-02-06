import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import newImage from "../../assets/images/IMAGE3.png";
import { useGlobalContext } from "../../context/GlobalProvider";
import { handleSignIn } from "../../lib/signIn";

const signIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

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
            ${isTablet ? "max-w-[550px]" : ""} `}
        >
          <View className="mb-8 items-center">
            <Image source={newImage} className="w-32 h-32" />
            <Text
              className={`text-blue-900 font-bold mt-2
                ${isTablet ? "text-4xl" : "text-2xl"}`}
            >
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
            handlePress={() =>
              handleSignIn(
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
            className="mt-4"
            onPress={() => router.push("/signUp")}
          >
            <Text
              className={`text-center text-blue-500
                ${isTablet ? "text-lg" : "text-sm"}`}
            >
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;
