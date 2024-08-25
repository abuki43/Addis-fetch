import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import { db } from "../../config/firebaseConfig";

const Messages = () => {
  const { user } = useGlobalContext();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Optimized fetchConversations function
  const fetchConversations = useCallback(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const conversationsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(
      conversationsQuery,
      async (querySnapshot) => {
        try {
          const conversationsList = await Promise.all(
            querySnapshot.docs.map(async (conversationDoc) => {
              const data = conversationDoc.data();
              const otherParticipantId = data.participants.find(
                (participant) => participant !== user.uid
              );

              const otherParticipantDoc = await getDoc(
                doc(db, "users", otherParticipantId)
              );

              if (!otherParticipantDoc.exists()) {
                throw new Error("User data not found");
              }

              const otherParticipantData = otherParticipantDoc.data();
              const isUnread = data[`unread_${user.uid}`] || false;

              return {
                id: conversationDoc.id,
                otherUserId: otherParticipantId,
                fullname: otherParticipantData.fullname || "Unknown",
                avatar:
                  otherParticipantData.avatar ||
                  "https://via.placeholder.com/150",
                unread: isUnread,
              };
            })
          );
          setConversations(conversationsList.reverse());
        } catch (err) {
          console.error("Error fetching conversations:", err.message);
          setError("Failed to load conversations.");
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      (err) => {
        console.error("Error in onSnapshot:", err.message);
        setError("Error fetching conversations");
        setLoading(false);
        setRefreshing(false);
      }
    );

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    const unsubscribe = fetchConversations();
    return () => unsubscribe && unsubscribe();
  }, [fetchConversations]);

  const handleConversationPress = async (
    conversationId,
    otherUserId,
    fullname
  ) => {
    try {
      router.push(`/PrivateChat?UID=${otherUserId}&fullname=${fullname}`);
      await updateDoc(doc(db, "chats", conversationId), {
        [`unread_${user.uid}`]: false,
      });
    } catch (err) {
      console.error("Error updating unread status:", err.message);
      setError("Failed to update conversation status.");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
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
          className="mt-4 px-4 py-2 bg-primary rounded-lg"
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
          <Text className="text-lg text-gray-600">No converstation yet.</Text>
          <TouchableOpacity
            onPress={fetchConversations}
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
              className="p-4 bg-white shadow rounded-lg mb-2 flex-row items-center"
              onPress={() =>
                handleConversationPress(
                  item.id,
                  item.otherUserId,
                  item.fullname
                )
              }
            >
              <View className="h-10 w-10 rounded-full mr-4 bg-[#f88a29] justify-center items-center">
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
