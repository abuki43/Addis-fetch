import React from "react";
import { View, Text, Image, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CustomButton from "./../CustomButton";
const ProfileHeader = ({ user, isOwner, onEditPress, onMessagePress }) => {
  const handleSendMessage = () => {
    router.push(`/PrivateChat?UID=${user.id}&fullname=${user.fullname}`);
    console.log("user", user, user.id);
  };

  const handleUserReview = () => {
    router.push(`/ReviewPage?reviewedPersonId=${user.id}`);
  };
  return (
    <View className="items-center py-5  ">
      <Image
        source={{
          uri: "https://th.bing.com/th?id=OIP.ENnbVUeD-xGXTsnBMjtlDwHaKl&w=209&h=298&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
        }}
        className="w-24 h-24 rounded-full"
      />
      <Text className="text-2xl font-bold mt-2">{user?.fullname}</Text>
      <Text className="text-lg text-gray-600 mt-1 text-center">
        {user?.bio || "Be happy by using Addis-Fetch..."}
      </Text>
      <View className="flex-row mt-2">
        {!isOwner && (
          <>
            <CustomButton
              title="Message"
              containerStyles="bg-Primary  min-h-[42px] w-24 mr-2"
              textStyles="text-white"
              handlePress={handleSendMessage}
            />
            <CustomButton
              title="Review"
              containerStyles="bg-Primary  min-h-[42px] w-24"
              textStyles="text-white"
              handlePress={handleUserReview}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default ProfileHeader;
