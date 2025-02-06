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
import { useLocalSearchParams } from "expo-router";
import {
  GiftedChat,
  Actions,
  Bubble,
  InputToolbar,
} from "react-native-gifted-chat";
import { auth } from "../../config/firebaseConfig";
import {
  initiateOrContinueChat,
  handleSend as sendChatMessage,
  pickImage,
} from "../../lib/chat";

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    initiateOrContinueChat(
      user,
      UID,
      chatId,
      setChatId,
      setMessages,
      setLoading,
      setError
    );
  }, [chatId, UID, user]);

  const handleSend = useCallback(
    (newMessages = []) =>
      sendChatMessage(
        newMessages,
        chatId,
        user,
        UID,
        setError,
        setImageUploading,
        setChatId
      ),
    [chatId, user]
  );

  const handleImageClick = (imageUri) => {
    setSelectedImage(imageUri);
    setIsModalVisible(true);
  };

  console.log(user.uid);

  const renderActions = (props) => (
    <Actions
      {...props}
      containerStyle={styles.actionsContainer}
      options={{
        ["Send Image"]: () => pickImage(handleSend, setImageUploading, user),
      }}
      icon={() => (
        <Text className="w-8 h-8 bg-Secondary text-white rounded-full text-center text-lg">
          +
        </Text>
      )}
    />
  );

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      disabled={imageUploading}
    />
  );

  const renderBubble = (props) => {
    if (props.currentMessage.image) {
      return (
        <TouchableOpacity
          onPress={() => handleImageClick(props.currentMessage.image)}
        >
          <Image
            source={{ uri: props.currentMessage.image }}
            style={styles.messageImage}
          />
        </TouchableOpacity>
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{ left: styles.leftBubble, right: styles.rightBubble }}
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
  const isDeletedUser = fullname === "Deleted User";
  return (
    <View className="flex-1 bg-white mt px-1">
      <View className="mt-3 mx-2 p-4 bg-[#e5e7eb] rounded-lg flex">
        <Link href={`/OthersProfile?UID=${UID}`} className="text-center">
          <Text
            className={`text-xl font-bold ${
              isDeletedUser ? "text-gray-400" : "text-red-500"
            } text-center p-4 rounded-sm`}
          >
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
        onSend={(newMessages) => handleSend(newMessages)}
        user={{ _id: user.uid }}
        renderActions={renderActions}
        renderInputToolbar={renderInputToolbar}
        renderBubble={renderBubble}
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
