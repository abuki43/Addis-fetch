import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { updateDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";

const Messages = () => {
  const { user } = useGlobalContext();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchConversations = useCallback(() => {
    const user = auth.currentUser;
    if (user) {
      const conversationsQuery = query(
        collection(db, "chats"),
        where("participants", "array-contains", user.uid)
      );

      const unsubscribe = onSnapshot(
        conversationsQuery,
        async (querySnapshot) => {
          const conversationsList = await Promise.all(
            querySnapshot.docs.map(async (conversationDoc) => {
              const data = conversationDoc.data();
              const otherParticipantId = data.participants.find(
                (participant) => participant !== user.uid
              );
              const otherParticipantDoc = await getDoc(
                doc(db, "users", otherParticipantId)
              );
              const otherParticipantData = otherParticipantDoc.data();
              const isUnread = data[`unread_${user.uid}`] || false;
              return {
                id: conversationDoc.id,
                otherUserId: otherParticipantId,
                fullname: otherParticipantData?.fullname || "Unknown",
                avatar:
                  otherParticipantData?.avatar ||
                  "https://via.placeholder.com/150",
                unread: isUnread,
              };
            })
          );
          setConversations(conversationsList.reverse());
          setLoading(false);
        },
        (err) => {
          setError("Error fetching conversations");
          console.error(err);
          setLoading(false);
        }
      );

      return unsubscribe;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = fetchConversations();
    return () => unsubscribe && unsubscribe();
  }, [fetchConversations]);

  const handleConversationPress = async (
    conversationId,
    otherUserId,
    fullname
  ) => {
    // Mark messages as read for the current user
    router.push(`/PrivateChat?UID=${otherUserId}&fullname=${fullname}`);
    await updateDoc(doc(db, "chats", conversationId), {
      [`unread_${user.uid}`]: false,
    });
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>{error}</Text>;

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {conversations.length === 0 ? (
        <Text className="text-center text-gray-500">No conversations yet.</Text>
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
              <View className="h-10 w-10 rounded-full mr-4 bg-black justify-center items-center">
                <Text className="text-white text-lg font-bold">
                  {item.fullname.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="text-lg font-bold flex-1">{item.fullname}</Text>
              {item.unread && (
                <View className="h-3 w-3 bg-blue-500 rounded-full" />
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default Messages;
