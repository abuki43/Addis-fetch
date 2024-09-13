// lib/chatUtils.js

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
import { auth, db, storage } from "../config/firebaseConfig";
import * as ImagePicker from "expo-image-picker";

// Initiate or Continue Chat
export const initiateOrContinueChat = async (
  UID,
  user,
  chatId,
  setChatId,
  setMessages,
  setLoading,
  setError
) => {
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

      // Ensure that unsubscribe is a function
      return () =>
        typeof unsubscribeMessages === "function" && unsubscribeMessages();
    }
  } catch (err) {
    setError("Failed to initiate chat.");
    console.error(err);
    setLoading(false);
  }
};

// Handle Send Message
export const handleSend = async (
  newMessages,
  chatId,
  user,
  UID,
  setImageUploading,
  setError
) => {
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

    await updateDoc(doc(db, "chats", chatId), {
      [`unread_${UID}`]: true,
      [`unread_${user.uid}`]: false,
    });
  } catch (err) {
    setError("Error sending message");
    console.error(err);
    setImageUploading(false);
  }
};

// Upload Image
export const uploadImage = async (fileUri) => {
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

// Pick Image
export const pickImage = async (handleSend, setImageUploading) => {
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
            user: { _id: auth.currentUser.uid },
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