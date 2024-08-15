import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";

const PostCard = ({ post }) => {
  const router = useRouter();
  const { user } = useGlobalContext();

  const handleContact = () => {
    if (!user) {
      Alert.alert("Error", "You need to be logged in to contact the user.");
      return;
    }

    // Navigate to the chat screen, passing the user's ID for chat initiation
    router.push(
      `/PrivateChat?UID=${post.creatorUid}&fullname=${post.username}`
    );
  };

  const convertTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return "";
  };

  let profileLink =
    user.uid == post.creatorUid
      ? `/Profile`
      : `/OthersProfile?UID=${post.creatorUid}`;

  const goTo = () => {
    console.log("profileLink", profileLink);
  };

  return (
    <View className="bg-white rounded-lg shadow-md mb-5 overflow-hidden p-1">
      {post.image && (
        <Image
          source={{ uri: post.image }}
          className="w-full h-52 rounded-sm"
        />
      )}
      <View className="p-4">
        <Link href={profileLink} asChild>
          <TouchableOpacity onPress={goTo}>
            <Text className="text-lg font-bold text-Primary-500 mb-2">
              {post.username}
            </Text>
          </TouchableOpacity>
        </Link>
        <Text className="text-base text-gray-700 mb-4">{post.description}</Text>
        <View className="mb-4">
          <Text className="text-sm text-gray-500">
            {convertTimestamp(post.timestamp)}
          </Text>
          <Text className="text-sm text-gray-500">{post.location}</Text>
          <Text className="text-sm font-bold text-gray-700">
            Category: {post.category}
          </Text>
          <Text className="text-base font-bold text-Primary">
            Price: ${post.price}
          </Text>
        </View>
        {post.creatorUid != user?.uid && (
          <TouchableOpacity
            className="bg-Primary rounded-md p-3"
            onPress={handleContact}
          >
            <Text className="text-white text-center font-bold">Contact</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PostCard;
