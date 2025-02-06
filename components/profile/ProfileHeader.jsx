import React, { useState } from "react";
import { View, Text, Image, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CustomButton from "./../CustomButton";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useGlobalContext } from "../../context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import newImage from "../../assets/images/IMAGE3.png";
import deleteAccount from "../../lib/deleteAccount";

const ProfileHeader = ({ user, isOwner, onEditPress, onMessagePress }) => {
  const { user: userLoggedIn, setUser } = useGlobalContext();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // State for three-dots menu

  const handleSendMessage = () => {
    router.push(`/PrivateChat?UID=${user.id}&fullname=${user.fullname}`);
  };

  const handleUserReview = () => {
    router.push(`/ReviewPage?reviewedPersonId=${user.id}`);
  };

  const handleLogOut = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      await signOut(auth);
      await AsyncStorage.removeItem("userData");
      router.replace("/");
      setUser("");
      console.log("User signed out");
    } catch (error) {
      console.log("Error signing out: ", error);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await deleteAccount(auth.currentUser);
      await handleLogOut();
      console.log("User account deleted");
    } catch (error) {
      console.log("Error deleting account: ", error);
      if (error.code === "auth/requires-recent-login") {
        alert("Please logout and log in again to delete your account.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleModalConfirm = () => {
    if (modalType === "logout") {
      handleLogOut();
    } else if (modalType === "delete") {
      handleDeleteAccount();
    }
  };

  const handleOpenWebsite = () => {
    setShowMenu(false); // Close the menu
    router.push("https://addis-fetchet.onrender.com/"); 
  };

  const MenuItems = () => (
    <View className="absolute top-8 right-0 bg-white rounded-xl shadow-2xl w-56 overflow-hidden border border-gray-100 z-30">
      <TouchableOpacity
        onPress={handleOpenWebsite}
        className="flex-row items-center space-x-3 p-4 border-b border-gray-100 active:bg-gray-50"
      >
        <View className="bg-blue-50 p-2 rounded-lg">
          <Ionicons name="globe-outline" size={20} color="#3B82F6" />
        </View>
        <View>
          <Text className="text-gray-800 font-medium">Visit Website</Text>
          <Text className="text-gray-500 text-xs">Access our full platform</Text>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color="#9CA3AF" 
          style={{ marginLeft: 'auto' }}
        />
      </TouchableOpacity>
     
    </View>
  );

  const ConfirmationModal = ({ type }) => {
    const isLogout = type === "logout";

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 m-5 w-[90%] max-w-sm">
            <View className="items-center mb-4">
              <View
                className={`w-12 h-12 ${
                  isLogout ? "bg-blue-100" : "bg-red-100"
                } rounded-full items-center justify-center mb-3`}
              >
                <Ionicons
                  name={isLogout ? "log-out-outline" : "warning-outline"}
                  size={24}
                  color={isLogout ? "#3B82F6" : "#EF4444"}
                />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                {isLogout ? "Logout" : "Delete Account"}
              </Text>
              <Text className="text-gray-500 text-center">
                {isLogout
                  ? "Are you sure you want to log out?"
                  : "This action cannot be undone. All your data will be permanently removed."}
              </Text>
            </View>

            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleModalConfirm}
                disabled={loading}
                className={`w-full py-3 rounded-xl ${
                  isLogout
                    ? "bg-blue-500 active:bg-blue-600"
                    : "bg-red-500 active:bg-red-600"
                } ${loading ? "opacity-50" : ""}`}
              >
                <Text className="text-white font-bold text-center">
                  {isLogout ? "Logout" : "Delete Account"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={loading}
                onPress={() => setShowModal(false)}
                className="w-full bg-gray-100 py-3 rounded-xl active:bg-gray-200"
              >
                <Text className="text-gray-600 font-bold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View className="items-center py-3 bg-white shadow-lg rounded-b-2xl md:m-2">
      {/* Three-Dots Menu */}
      <View className="absolute top-3 right-3">
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Ionicons name="ellipsis-vertical" size={24} color="gray" />
        </TouchableOpacity>

        {/* Menu Popup */}
        {showMenu && <MenuItems />}
      </View>

      {/* Profile Content */}
      <Image
        source={newImage}
        className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-md"
      />
      <Text className="text-3xl font-bold mt-3 text-gray-900">
        {user?.fullname}
      </Text>
      <Text className="text-lg text-gray-600 mt-1 text-center px-5">
        {user?.bio || "Be happy by using Addis-Fetch..."}
      </Text>
      <View className="flex-row mt-6 space-x-3">
        {userLoggedIn &&
          (!isOwner ? (
            <>
              <CustomButton
                title="Message"
                containerStyles="bg-gray-100 min-h-[42px] w-28 rounded-xl mr-3"
                textStyles="text-gray-700 font-medium"
                handlePress={handleSendMessage}
              />
              <CustomButton
                title="Review"
                containerStyles="bg-gray-100 min-h-[42px] w-28 rounded-xl"
                textStyles="text-gray-700 font-medium"
                handlePress={handleUserReview}
              />
            </>
          ) : (
            <View className="space-y-3">
              <View className="flex-row space-x-3 justify-center">
                <CustomButton
                  title="Logout"
                  containerStyles="bg-gray-100 min-h-[42px] w-28 rounded-xl mr-3"
                  textStyles="text-gray-700 font-medium"
                  handlePress={() => {
                    setModalType("logout");
                    setShowModal(true);
                  }}
                />
                <CustomButton
                  title="Delete Account"
                  containerStyles="bg-red-50 min-h-[42px] w-40 rounded-xl"
                  textStyles="text-red-500 font-medium"
                  handlePress={() => {
                    setModalType("delete");
                    setShowModal(true);
                  }}
                />
              </View>
            </View>
          ))}
      </View>

      <ConfirmationModal type={modalType} />
    </View>
  );
};

export default ProfileHeader;
