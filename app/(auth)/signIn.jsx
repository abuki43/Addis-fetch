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

  // Get screen width to adjust styles dynamically
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: isTablet ? 64 : 16, // Adjust padding for tablets
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignSelf: "center", // Center contents horizontally
            maxWidth: 550, // Limit content width on tablets
            width: "100%", // Ensure responsiveness
            paddingVertical: 16,
          }}
        >
          <View style={{ marginBottom: 32, alignItems: "center" }}>
            <Image source={newImage} className="w-32 h-32" />
            <Text
              style={{
                color: "#1e3a8a",
                fontSize: isTablet ? 36 : 24, // Larger text for tablets
                fontWeight: "bold",
                marginTop: 8,
              }}
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
            onPress={() => router.push("/signUp")}
            style={{ marginTop: 16 }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#3b82f6",
                fontSize: isTablet ? 18 : 14, // Adjust font size for tablets
              }}
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
