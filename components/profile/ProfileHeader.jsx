import React from "react";
import { View, Text, Image, Animated, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CustomButton from "./../CustomButton";
import { getAuth, signOut } from "firebase/auth";
import { useGlobalContext } from "../../context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileHeader = ({ user, isOwner, onEditPress, onMessagePress }) => {
  const { setUser } = useGlobalContext();

  const handleSendMessage = () => {
    router.push(`/PrivateChat?UID=${user.id}&fullname=${user.fullname}`);
  };

  const handleUserReview = () => {
    router.push(`/ReviewPage?reviewedPersonId=${user.id}`);
  };

  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      router.replace("/");
      const auth = getAuth();
      await signOut(auth);
      setUser("");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View className="items-center py-3 bg-white shadow-lg rounded-b-2xl">
      <Image
        source={{
          uri: user?.profilePicture || "https://placekitten.com/200/200",
        }}
        className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-md"
      />
      <Text className="text-3xl font-bold mt-3 text-gray-900">
        {user?.fullname}
      </Text>
      <Text className="text-lg text-gray-600 mt-1 text-center px-5">
        {user?.bio || "Be happy by using Addis-Fetch..."}
      </Text>
      <View className="flex-row mt-4 space-x-4">
        {!isOwner && (
          <>
            <CustomButton
              title="Message"
              containerStyles="bg-[#e5e7eb]  min-h-[42px] w-24 mr-2"
              textStyles="text-gray"
              handlePress={handleSendMessage}
            />
            <CustomButton
              title="Review"
              containerStyles="bg-[#e5e7eb]  min-h-[42px] w-24"
              textStyles="text-gray"
              handlePress={handleUserReview}
            />
          </>
        )}
        {isOwner && (
          <CustomButton
            title="Logout"
            containerStyles="bg-[#e5e7eb]  min-h-[42px] w-24 mr-2"
            textStyles="text-gray"
            handlePress={handleLogOut}
          />
        )}
      </View>
    </View>
  );
};

export default ProfileHeader;
