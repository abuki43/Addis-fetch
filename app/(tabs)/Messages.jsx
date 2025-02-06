import React, { useEffect, useState } from "react";
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

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#EA9050" />
        <Text className="mt-4 text-gray-500 font-medium">
          Loading messages...
        </Text>
      </View>
    );

  if (error)
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-red-500 text-lg mb-2 text-center">{error}</Text>
        <TouchableOpacity
          className="mt-4 px-6 py-3 bg-orange-500 rounded-xl active:bg-orange-600 shadow-sm"
          onPress={onRefresh}
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-xl text-gray-600 font-medium text-center mb-2">
          Sign in to view your messages
        </Text>
        <Text className="text-gray-400 mb-6 text-center">
          Connect with others and start conversations
        </Text>
        <TouchableOpacity
          className="px-6 py-2 bg-Primary rounded-xl active:bg-orange-600 shadow-sm"
          onPress={() => router.push("/signIn")}
        >
          <Text className="text-white font-bold text-lg">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {conversations.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-xl text-gray-600 font-medium text-center mb-2">
            No conversations yet
          </Text>
          <Text className="text-gray-400 mb-6 text-center">
            Start chatting with other users
          </Text>
          <TouchableOpacity
            onPress={onRefresh}
            className="px-6 py-3 bg-orange-500 rounded-xl active:bg-orange-600 shadow-sm"
          >
            <Text className="text-white font-bold">Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          className="px-4 pt-4 mb-20"
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isDeletedUser = item.fullname === "Deleted User";
            return (
              <TouchableOpacity
                className="mb-3 bg-white rounded-2xl shadow-sm overflow-hidden active:bg-gray-50 md:w-3/4"
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
                <View className="p-3 flex-row items-center space-x-4">
                  <View
                    className={`h-12 w-12 ${
                      isDeletedUser ? "bg-gray-400" : "bg-Primary"
                    } rounded-full flex items-center justify-center`}
                  >
                    <Text className="text-white text-xl font-bold">
                      {item.fullname.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-lg font-semibold text-gray-800">
                        {item.fullname}
                      </Text>
                      {isDeletedUser && (
                        <View className="bg-gray-200 px-2 py-1 rounded-full">
                          <Text className="text-xs text-gray-600 font-medium">
                            Deleted Account
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-sm text-gray-500">
                      Tap to view chat
                    </Text>
                  </View>
                  {item.unread && (
                    <View className="h-3 w-3 rounded-full bg-orange-500 shadow-sm" />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#f97316"
              colors={["#f97316"]}
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default Messages;
