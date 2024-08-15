import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const ProfileTabs = ({ activeTab, setActiveTab, isOwner }) => {
  return (
    <View className="flex-row justify-around my-2">
      <TouchableOpacity onPress={() => setActiveTab("info")} className="py-2">
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
      <TouchableOpacity onPress={() => setActiveTab("posts")} className="py-2">
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
      {
        <TouchableOpacity
          onPress={() => setActiveTab("reviews")}
          className="py-2"
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
      }
    </View>
  );
};

export default ProfileTabs;
