import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
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
  serverTimestamp,
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../config/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import {
  GiftedChat,
  Actions,
  Bubble,
  InputToolbar,
} from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";

// there is some error on Gifted chat , found the below temp solution

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

  const [selectedImage, setSelectedImage] = useState(null); // for the image popup || to view the image at larger size
  const [isModalVisible, setIsModalVisible] = useState(false);

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
                console.log(data.timestamp);
                return {
                  _id: doc.id,
                  text: data.text.startsWith("http") ? "" : data.text,
                  image: data.text.startsWith("http") ? data.text : null,
                  createdAt: data?.timestamp?.toDate() || new Date(),
                  user: {
                    _id: data.senderId,
                  },
                };
              });

              setMessages(
                messagesList.sort((a, b) => a.createdAt - b.createdAt).reverse()
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
        setImageUploading(true);

        if (message.image) {
          await addDoc(collection(db, "chats", chatId, "messages"), {
            text: message.image,
            senderId: user.uid,
            timestamp: serverTimestamp(),
          });
        } else {
          await addDoc(collection(db, "chats", chatId, "messages"), {
            text: message.text,
            senderId: user.uid,
            timestamp: serverTimestamp(),
          });
        }
        console.log("message sent");
        setImageUploading(false);

        const otherParticipantId = UID;
        await updateDoc(doc(db, "chats", chatId), {
          [`unread_${otherParticipantId}`]: true,
          [`unread_${user.uid}`]: false,
        });
      } catch (err) {
        setError("Error sending message");
        console.error(err);
        setImageUploading(false);
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
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUploading(true);

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
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload image.");
      console.error(error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageClick = (imageUri) => {
    console.log("Image Clicked:", imageUri);
    setSelectedImage(imageUri);
    setIsModalVisible(true);
  };

  const renderActions = (props) => (
    <Actions
      {...props}
      containerStyle={styles.actionsContainer}
      options={{
        ["Send Image"]: pickImage,
      }}
      icon={() => (
        <Text
          className={`w-8 h-8 bg-Secondary text-white rounded-full text-center text-lg`}
        >
          +
        </Text>
      )}
    />
  );

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={styles.inputToolbarPrimary}
      disabled={imageUploading} // Disable while uploading
    />
  );

  const renderBubble = (props) => {
    if (props.currentMessage.image) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => {
              handleImageClick(props.currentMessage.image);
            }}
          >
            <Image
              source={{ uri: props.currentMessage.image }}
              style={styles.messageImage}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: styles.leftBubble,
          right: styles.rightBubble,
        }}
      />
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-transparent">
        <ActivityIndicator size="large" color="#EA9050" />
      </View>
    );
  }
  if (error) return <Text className="text-center text-red-500">{error}</Text>;

  return (
    <View className="flex-1 bg-white mt-6 px-1">
      <View className="mt-3 mx-2 p-4 bg-[#e5e7eb]  rounded-lg flex ">
        <Link href={`/OthersProfile?UID=${UID}`} className="text-center">
          <Text className="text-xl font-bold text-slate-700 text-center">
            {fullname || "unknown"}
          </Text>
        </Link>
      </View>

      <View style={styles.reviewContainer}>
        <Link href={`/ReviewPage?reviewedPersonId=${UID}`}>
          <Text style={styles.reviewText}>Write a review</Text>
        </Link>
      </View>

      {isModalVisible && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {imageUploading && (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      )}

      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{ _id: user.uid }}
        renderUsernameOnMessage
        renderActions={renderActions}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
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

const styles = StyleSheet.create({
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  uploadingOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -25,
    marginLeft: -25,
  },
  leftBubble: {
    backgroundColor: "#e5e7eb", // Gray-100
  },
  rightBubble: {
    backgroundColor: "gray",
  },
  reviewContainer: {
    // marginVertical: 5,
    // backgroundColor: "#4f46e5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  reviewText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionsContainer: {
    marginLeft: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  actionButton: {
    backgroundColor: "black",
    borderRadius: 25,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  actionButtonText: {
    width: 30,
    height: 30,
    backgroundColor: "black",
    color: "#fff",
    textAlign: "center",
    lineHeight: 30,
    fontSize: 20,
    fontWeight: "bold",
  },

  inputToolbar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    color: "black",
    borderColor: "#ccc",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
  },

  inputToolbarPrimary: {
    flex: 1,
    marginLeft: 10,
  },

  actionContainer: {
    position: "absolute",
    left: -10,
    bottom: 6,
    zIndex: 1,
  },

  iconContainer: {
    backgroundColor: "black",
    borderRadius: 25,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: -10,
    top: 50,
  },

  actionButton: {
    backgroundColor: "black",
    borderRadius: 25,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputToolbar: {
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalImage: {
    width: "90%",
    height: "80%",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#f87171",
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PrivateChat;
