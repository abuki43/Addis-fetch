import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "./../CustomButton";

const PersonalInfo = ({
  user,
  isEditing,
  setIsEditing,
  saveProfile,
  isOwner,
  isLoading,
}) => {
  const router = useRouter();

  const [info, setInfo] = useState({
    fullname: user?.fullname,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    bio: user?.bio,
  });

  // Ensure `info` state is initialized with `user` data when the component first renders
  useEffect(() => {
    setInfo({
      fullname: user?.fullname || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      bio: user?.bio || "Be happy by using Addis-Fetch...",
    });
  }, [user]);

  return (
    <ScrollView className="p-5 pb-9 ">
      <Text className="text-lg my-1">Full Name</Text>
      <TextInput
        value={info?.fullname}
        onChangeText={(text) => setInfo({ ...info, fullname: text })}
        editable={isEditing && isOwner}
        className="text-lg p-2 bg-gray-100 rounded my-1"
      />
      <Text className="text-lg my-1">Bio</Text>
      <TextInput
        value={info?.bio}
        onChangeText={(text) => setInfo({ ...info, bio: text })}
        editable={isEditing && isOwner}
        className="text-lg p-2 bg-gray-100 rounded my-1"
      />
      <Text className="text-lg my-1">Email</Text>
      <TextInput
        value={info?.email}
        onChangeText={(text) => setInfo({ ...info, email: text })}
        editable={isEditing && isOwner}
        className="text-lg p-2 bg-gray-100 rounded my-1"
      />
      <Text className="text-lg my-1">Phone</Text>
      <TextInput
        value={info?.phoneNumber}
        onChangeText={(text) => setInfo({ ...info, phoneNumber: text })}
        editable={isEditing && isOwner}
        className="text-lg p-2 bg-gray-100 rounded my-1"
      />

      {isOwner ? (
        isEditing ? (
          <CustomButton
            title="Save"
            containerStyles="bg-Primary mt-3 "
            textStyles="text-white"
            handlePress={() => saveProfile(info)}
          />
        ) : (
          <CustomButton
            isLoading={isLoading}
            title="Edit"
            containerStyles="bg-Primary mt-3 mb-8"
            textStyles="text-white"
            handlePress={() => setIsEditing(true)}
          />
        )
      ) : null}
    </ScrollView>
  );
};

export default PersonalInfo;
