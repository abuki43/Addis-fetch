import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

// Fetch conversations from Firestore
export const fetchConversations = (
  user,
  setConversations,
  setLoading,
  setError,
  setRefreshing
) => {
  if (!user) {
    setLoading(false);
    return;
  }

  const conversationsQuery = query(
    collection(db, "chats"),
    where("participants", "array-contains", user.uid),
    orderBy("createdAt", "asc")
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
};

// Handle conversation press action
export const handleConversationPress = async (
  conversationId,
  otherUserId,
  fullname,
  user,
  router,
  setError
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
