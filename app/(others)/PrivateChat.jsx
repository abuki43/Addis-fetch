import React, { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator, Alert, Text, Image } from "react-native";
import { Link } from "expo-router";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../config/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { GiftedChat, Actions, Bubble } from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";

const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const PrivateChat = () => {
  const { UID, fullname } = useLocalSearchParams();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const initiateOrContinueChat = async () => {
      if (!user || !UID) return;

      try {
        if (!chatId) {
          const chatsRef = collection(db, "chats");
          const q = query(
            chatsRef,
            where("participants", "array-contains", user.uid)
          );
          const chatSnapshot = await getDocs(q);
          let foundChatId = null;

          chatSnapshot.forEach((doc) => {
            const participants = doc.data().participants;
            if (participants.includes(UID)) {
              foundChatId = doc.id;
            }
          });

          if (foundChatId) {
            setChatId(foundChatId);
          } else {
            const newChatRef = await addDoc(chatsRef, {
              participants: [user.uid, UID],
              createdAt: new Date(),
              unread: true,
            });
            setChatId(newChatRef.id);
          }
        }

        if (chatId) {
          const messagesRef = collection(db, "chats", chatId, "messages");
          const q = query(messagesRef, orderBy("timestamp", "asc"));

          const unsubscribeMessages = onSnapshot(
            q,
            (querySnapshot) => {
              const messagesList = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  _id: doc.id,
                  text: data.text.startsWith("http") ? "" : data.text,
                  image: data.text.startsWith("http") ? data.text : null,
                  createdAt: data.timestamp.toDate(),
                  user: {
                    _id: data.senderId,
                  },
                };
              });

              setMessages(
                messagesList.sort((a, b) => a.createdAt - b.createdAt).reverse() // Sort messages chronologically
              );

              setLoading(false);

              // Mark messages as read
              updateDoc(doc(db, "chats", chatId), { unread: false });
            },
            (err) => {
              setError("Error fetching messages");
              console.error(err);
              setLoading(false);
            }
          );

          return () => {
            unsubscribeMessages();
          };
        }
      } catch (err) {
        setError("Failed to initiate chat.");
        Alert.alert("Error", "Failed to initiate chat.");
        console.error(err);
        setLoading(false);
      }
    };

    initiateOrContinueChat();
  }, [chatId, UID, user]);

  const handleSend = useCallback(
    async (newMessages = []) => {
      const [message] = newMessages;
      try {
        setImageUploading(true); // Start loading

        if (message.image) {
          // Send image
          await addDoc(collection(db, "chats", chatId, "messages"), {
            text: message.image,
            senderId: user.uid,
            timestamp: new Date(),
          });
        } else {
          // Send text
          await addDoc(collection(db, "chats", chatId, "messages"), {
            text: message.text,
            senderId: user.uid,
            timestamp: new Date(),
          });
        }

        setImageUploading(false); // End loading
        const otherParticipantId = UID; // // Set unread status only for the other participant
        // Update unread status for the recipient
        await updateDoc(doc(db, "chats", chatId), {
          [`unread_${otherParticipantId}`]: true,
        });
      } catch (err) {
        setError("Error sending message");
        console.error(err);
        setImageUploading(false); // End loading in case of error
      }
    },
    [chatId, user]
  );

  const uploadImage = async (fileUri) => {
    try {
      const storageRef = ref(storage, `images/${new Date().toISOString()}`);

      const response = await fetch(fileUri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        setImageUploading(true); // Start loading

        const imageUrl = await uploadImage(result.assets[0].uri);
        if (imageUrl) {
          handleSend([
            {
              _id: new Date().getTime(),
              image: imageUrl,
              user: { _id: user.uid },
            },
          ]);
        }
        setImageUploading(false); // End loading
      } catch (error) {
        Alert.alert("Error", "Failed to upload image.");
        setImageUploading(false); // End loading in case of error
      }
    }
  };

  const renderActions = (props) => (
    <Actions
      {...props}
      options={{
        ["Send Image"]: pickImage,
      }}
      icon={() => <Text className="text-lg">+</Text>}
    />
  );

  const renderBubble = (props) => {
    if (props.currentMessage.image) {
      return (
        <Bubble
          {...props}
          renderMessageText={() => null} // Prevent text(image link) from being rendered
          renderMessageImage={() => (
            <Image
              source={{ uri: props.currentMessage.image }}
              style={{ width: 200, height: 200, borderRadius: 10 }}
            />
          )}
        />
      );
    }
    return <Bubble {...props} />;
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>{error}</Text>;

  return (
    <View className="flex-1 bg-white mt-6">
      <View className="p-4 bg-gray-900 border-b border-gray-300 rounded-lg">
        <Text className="text-xl font-bold text-white text-center">
          {fullname}
        </Text>
      </View>

      <View className="bg-slate-400">
        <Link href={`/ReviewPage?reviewedPersonId=${UID}`}>
          <Text className="text-center text-Primary underline">
            Write a review
          </Text>
        </Link>
      </View>
      {imageUploading && (
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: -25,
            marginLeft: -25,
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{ _id: user.uid }}
        renderUsernameOnMessage
        renderActions={renderActions}
        renderBubble={renderBubble}
        renderAvatar={({ currentMessage }) => {
          const isCurrentUser = currentMessage.user._id === user.uid;
          const initial = isCurrentUser
            ? user.displayName.charAt(0).toUpperCase()
            : fullname.charAt(0).toUpperCase();

          return (
            <View className="h-10 w-10 rounded-full bg-black justify-center items-center">
              <Link href={`/OthersProfile?UID=${currentMessage?.user._id}`}>
                <Text className="text-white text-lg font-bold">{initial}</Text>
              </Link>
            </View>
          );
        }}
      />
    </View>
  );
};

export default PrivateChat;
