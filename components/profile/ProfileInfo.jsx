import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
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
    fullname: user?.fullname,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    bio: user?.bio,
  });

  useEffect(() => {
    setInfo({
      fullname: user?.fullname || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      bio: user?.bio || "Be happy by using Addis-Fetch...",
    });
  }, [user]);

  return (
    <ScrollView className="p-6 bg-white rounded-lg shadow-lg mb-10">
      <Text className="text-xl font-medium my-2">Full Name</Text>
      <TextInput
        value={info?.fullname}
        onChangeText={(text) => setInfo({ ...info, fullname: text })}
        editable={isEditing && isOwner}
        className="text-lg p-3 bg-gray-100 rounded-lg my-2 shadow-inner"
      />
      <Text className="text-xl font-medium my-2">Bio</Text>
      <TextInput
        value={info?.bio}
        onChangeText={(text) => setInfo({ ...info, bio: text })}
        editable={isEditing && isOwner}
        className="text-lg p-3 bg-gray-100 rounded-lg my-2 shadow-inner"
      />
      <Text className="text-xl font-medium my-2">Email</Text>
      <TextInput
        value={info?.email}
        onChangeText={(text) => setInfo({ ...info, email: text })}
        editable={isEditing && isOwner}
        className="text-lg p-3 bg-gray-100 rounded-lg my-2 shadow-inner"
      />
      <Text className="text-xl font-medium my-2">Phone</Text>
      <TextInput
        value={info?.phoneNumber}
        onChangeText={(text) => setInfo({ ...info, phoneNumber: text })}
        editable={isEditing && isOwner}
        className="text-lg p-3 bg-gray-100 rounded-lg my-2 shadow-inner"
      />

      {isOwner ? (
        isEditing ? (
          <CustomButton
            title="Save"
            containerStyles="bg-Primary rounded-md mt-4 mb-10 px-6 py-3"
            textStyles="text-white font-semibold text-lg"
            handlePress={() => saveProfile(info)}
          />
        ) : (
          <CustomButton
            isLoading={isLoading}
            title="Edit"
            containerStyles="bg-Primary rounded-md mt-4 mb-10 px-6 py-3"
            textStyles="text-white font-semibold text-lg"
            handlePress={() => setIsEditing(true)}
          />
        )
      ) : null}
    </ScrollView>
  );
};

export default ProfileInfo;
