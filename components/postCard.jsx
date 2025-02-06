import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";

const PostCard = ({ post, isProfileView, handleDelete }) => {
  // isProfileView is a boolean that determines if the user is viewing the post on the profile tab
  const router = useRouter();
  const { user } = useGlobalContext();
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContact = () => {
    if (!user) {
      Alert.alert("Info", "You need to be logged in to contact the user.");
      return;
    }

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
    user?.uid == post.creatorUid
      ? `/Profile`
      : `/OthersProfile?UID=${post.creatorUid}`;

  const isDeletedUser = post?.username === "Deleted User";

  return (
    <>
      <View
        className={`bg-white rounded-2xl p-3 shadow-xl mb-2 overflow-hidden transform transition duration-300 hover:scale-105 ${
          loading ? "opacity-70" : ""
        }`}
        style={styles.Card}
      >
        {post.image && (
          <TouchableOpacity onPress={() => setImageModalVisible(true)}>
            <Image
              source={{ uri: post.image }}
              className="w-full h-48 rounded-xl"
              contentFit="cover"
            />
            {/* Add date overlay on image */}
            <View className="absolute top-4 right-4 bg-black/50 px-4 py-2 rounded-full">
              <Text className="text-white text-xs font-medium">
                {convertTimestamp(post.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <View className="px-4 pt-3 pb-2">
          <View className="flex-row items-center justify-between mb-4">
            <Link href={profileLink} asChild>
              <TouchableOpacity className="flex-row items-center">
                {/* Add avatar circle */}
                <View className="w-12 h-12 rounded-full bg-orange-100 items-center justify-center mr-3">
                  <Text className="text-Primary text-lg font-bold">
                    {post.username?.[0]?.toUpperCase()}
                  </Text>
                </View>
                <Text className="text-lg font-bold text-Primary">
                  {post.username}
                </Text>
              </TouchableOpacity>
            </Link>
            {isDeletedUser && (
              <View className="bg-gray-200 px-2 py-1 rounded-full">
                <Text className="text-xs text-gray-600 font-medium">
                  Deleted Account
                </Text>
              </View>
            )}
          </View>

          <Text className="text-gray-700 text-base leading-6 mb-4">
            {post.description}
          </Text>

          {/* Location section with improved design */}
          <View className="bg-orange-50 rounded-xl px-4 py-2 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-1">
                <Text className="text-gray-500 text-xs mb-1">From</Text>
                <Text className="text-gray-800 font-semibold">
                  {post.locationFrom}
                </Text>
              </View>
              <View className="w-8 h-px bg-orange-200 mx-2" />
              <View className="flex-1">
                <Text className="text-gray-500 text-xs mb-1">To</Text>
                <Text className="text-gray-800 font-semibold">
                  {post.locationTo}
                </Text>
              </View>
            </View>
          </View>

          {/* Tags section */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            <View className="bg-orange-100 px-3 py-1.5 rounded-full">
              <Text className="text-Primary font-medium text-sm">
                {post.category}
              </Text>
            </View>
            <View className="bg-green-100 px-3 py-1.5 rounded-full">
              <Text className="text-green-700 font-bold text-sm">
                ${post.price}
              </Text>
            </View>
          </View>

          {/* Buttons section */}
          {post.creatorUid === user?.uid && isProfileView && (
            <View className="flex-row items-center">
              <TouchableOpacity
                className="bg-red-500 rounded-full py-3.5 px-6 mr-2 w-full"
                onPress={() => handleDelete(post.id, setLoading)}
                disabled={loading}
              >
                <Text className="text-white text-center font-bold">
                  {loading ? "Deleting..." : "Delete Post"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {post.creatorUid !== user?.uid && (
            <TouchableOpacity
              className="bg-Primary rounded-full  shadow-lg active:scale-95 transform transition h-12 flex items-center justify-center mt-2"
              onPress={handleContact}
            >
              <Text className="text-white text-center font-bold">Contact</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/90">
          <Image
            source={{ uri: post.image }}
            className="w-11/12 h-4/5 rounded-3xl"
            contentFit="cover"
          />
          <TouchableOpacity
            onPress={() => setImageModalVisible(false)}
            className="mt-6 bg-white/90 rounded-full p-4 px-8"
          >
            <Text className="text-center text-black font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  Card: {
    elevation: 4, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.3, // iOS
    shadowRadius: 3.84, // iOS
  },
});

export default PostCard;
