import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import {
  fetchConversations,
  handleConversationPress,
} from "../../lib/messages";

const Messages = () => {
  const { user } = useGlobalContext();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Initialize fetching conversations
  useEffect(() => {
    const unsubscribe = fetchConversations(
      user,
      setConversations,
      setLoading,
      setError,
      setRefreshing
    );
    return () => unsubscribe && unsubscribe();
  }, [user]);

  // Handle refresh action
  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations(
      user,
      setConversations,
      setLoading,
      setError,
      setRefreshing
    );
  };

  // Render loading state
  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#EA9050" />
      </View>
    );

  // Render error state
  if (error)
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-Secondary rounded-lg"
          onPress={onRefresh}
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );

  // Render when no user is logged in
  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-500">
          Please sign In to view your messages.
        </Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-Secondary rounded-lg"
          onPress={() => router.push("/signIn")}
        >
          <Text className="text-white font-bold">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render when no conversations exist
  return (
    <View className="flex-1 p-4 bg-gray-100">
      {conversations.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">No conversations yet.</Text>
          <TouchableOpacity
            onPress={onRefresh}
            className="bg-orange-500 rounded-lg p-2 mt-4"
          >
            <Text className="text-white font-bold">Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-4 bg-white shadow rounded-lg mb-2 flex-row items-center md:w-3/4 md:ml-6 md:mt-2"
              onPress={() =>
                handleConversationPress(
                  item.id,
                  item.otherUserId,
                  item.fullname,
                  user,
                  router,
                  setError
                )
              }
            >
              <View className="h-10 w-10 rounded-full mr-4 bg-[#f88a29] justify-center items-center md:mb-3 ">
                <Text className="text-white text-lg font-bold">
                  {item.fullname.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="text-lg font-bold flex-1 text-gray-600">
                {item.fullname}
              </Text>
              {item.unread && (
                <View className="h-3 w-3 bg-Primary rounded-full" />
              )}
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default Messages;
