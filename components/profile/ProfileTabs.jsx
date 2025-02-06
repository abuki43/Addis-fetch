import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const ProfileTabs = ({ activeTab, setActiveTab, isOwner }) => {
  const tabs = [
    { id: "info", label: "Info", icon: "person-outline" },
    { id: "posts", label: "Posts", icon: "documents-outline" },
    { id: "reviews", label: "Reviews", icon: "star-outline" },
  ];

  return (
    <View className="bg-white rounded-2xl shadow-sm overflow-hidden m-3 mb-0">
      <View className="flex-row justify-between p-1">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className={`flex-1 flex-row items-center justify-center py-3 px-4 space-x-2 
              ${
                activeTab === tab.id
                  ? "bg-orange-50 rounded-xl border border-orange-200"
                  : "bg-transparent"
              }`}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={activeTab === tab.id ? "#EA9050" : "#6B7280"}
            />
            <Text
              className={`font-medium ${
                activeTab === tab.id ? "text-orange-500" : "text-gray-600"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ProfileTabs;
