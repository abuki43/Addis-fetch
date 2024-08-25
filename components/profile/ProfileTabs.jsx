import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const ProfileTabs = ({ activeTab, setActiveTab, isOwner }) => {
  return (
    <View className="flex-row justify-around bg-white shadow-md py-2 rounded-b-lg">
      <TouchableOpacity
        onPress={() => setActiveTab("info")}
        className={`py-2 px-4 rounded-lg ${
          activeTab === "info" ? "bg-[#f2bb94]" : "bg-transparent"
        }`}
      >
        <Text
          className={
            activeTab === "info"
              ? "text-lg font-bold text-black"
              : "text-lg text-gray-500"
          }
        >
          Info
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveTab("posts")}
        className={`py-2 px-4 rounded-lg ${
          activeTab === "posts" ? "bg-[#f2bb94]" : "bg-transparent"
        }`}
      >
        <Text
          className={
            activeTab === "posts"
              ? "text-lg font-bold text-black"
              : "text-lg text-gray-500"
          }
        >
          Posts
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveTab("reviews")}
        className={`py-2 px-4 rounded-lg ${
          activeTab === "reviews" ? "bg-[#f2bb94]" : "bg-transparent"
        }`}
      >
        <Text
          className={
            activeTab === "reviews"
              ? "text-lg font-bold text-black"
              : "text-lg text-gray-500"
          }
        >
          Reviews
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileTabs;
