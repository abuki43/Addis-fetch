import React, { useState } from "react";
import { View } from "react-native";
import FormField from "./../FormField";
import CustomButton from "./../CustomButton";

const ProfileInfo = ({
  user,
  isEditing,
  setIsEditing,
  saveProfile,
  isOwner,
  isLoading,
}) => {
  const [info, setInfo] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.bio || "Be happy by using Addis-Fetch...",
  });

  return (
    <View className="bg-white rounded-2xl shadow-sm p-6 mb-12 pb-12 m-3">
      <FormField
        title="Full Name"
        value={info.fullname}
        handleChangeText={(text) => setInfo({ ...info, fullname: text })}
        placeholder="Enter your full name"
        otherStyles={`space-y-1 ${isEditing ? 'border-orange-200' : 'border-gray-100'}`}
        editable={isEditing && isOwner}
      />

      <FormField
        title="Bio"
        value={info.bio}
        handleChangeText={(text) => setInfo({ ...info, bio: text })}
        placeholder="Enter your bio"
        multiline
        numberOfLines={4}
        otherStyles={`space-y-1 ${isEditing ? 'border-orange-200' : 'border-gray-100'}`}
        editable={isEditing && isOwner}
      />

      <FormField
        title="Email"
        value={info.email}
        handleChangeText={() => {}}
        placeholder="Enter your email"
        otherStyles="space-y-1 border-gray-100"
        editable={false}
      />

      <FormField
        title="Phone"
        value={info.phoneNumber}
        handleChangeText={(text) => setInfo({ ...info, phoneNumber: text })}
        placeholder="Enter your phone number"
        otherStyles={`space-y-1 ${isEditing ? 'border-orange-200' : 'border-gray-100'}`}
        editable={isEditing && isOwner}
      />

      {isOwner && (
        <CustomButton
          title={isEditing ? "Save Changes" : "Edit Profile"}
          containerStyles={`${
            isEditing ? "bg-orange-500" : "bg-orange-100"
          } rounded-xl py-4 mt-4`}
          textStyles={`font-semibold text-center ${
            isEditing ? "text-white" : "text-orange-500"
          }`}
          handlePress={() => {
            if (isEditing) {
              const { fullname, phoneNumber, bio } = info;
              saveProfile({ fullname, phoneNumber, bio });
            } else {
              setIsEditing(true);
            }
          }}
          isLoading={isLoading}
        />
      )}
    </View>
  );
};

export default ProfileInfo;