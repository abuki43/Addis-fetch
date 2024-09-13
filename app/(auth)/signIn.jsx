// pages/signIn.js

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
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
