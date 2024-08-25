import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileInfo from "./ProfileInfo";
import ProfileActivities from "./ProfileActivities";
import Reviews from "./Reviews";
import { useGlobalContext } from "./../../context/GlobalProvider";
import { db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfilePage = ({ isOwner, userID }) => {
  const { user: globalUser, setUser } = useGlobalContext();
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  let profileUserID = isOwner ? globalUser?.uid : userID;

  const fetchUser = async () => {
    try {
      if (!profileUserID) {
        throw new Error("No user ID found");
      }

      const userDocRef = doc(db, "users", profileUserID);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setCurrentUser(userDocSnap.data());
      } else {
        console.error("No such user document!");
        setError("User not found");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(db, "posts"),
        where("creatorUid", "==", profileUserID)
      );

      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("reviewedPersonId", "==", profileUserID)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsData = reviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setError(null);
    setLoading(true);
    fetchUser();
    fetchPosts();
    fetchReviews();
  };

  useEffect(() => {
    if (isOwner) {
      if (globalUser) {
        setCurrentUser(globalUser);
        fetchPosts();
        fetchReviews();
      } else {
        setError("Global user is not available");
        setLoading(false);
      }
    } else {
      if (userID) {
        fetchUser();
        fetchPosts();
        fetchReviews();
      } else {
        setError("User ID is not provided");
        setLoading(false);
      }
    }
  }, [isOwner, userID, globalUser]);

  const saveProfile = async (info) => {
    if (isOwner) {
      try {
        setLoading(true);
        const userDocRef = doc(db, "users", globalUser.uid);
        await updateDoc(userDocRef, info);
        setIsEditing(false);
        setUser({ ...globalUser, ...info });
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({ ...globalUser, ...info })
        );
        fetchUser();
      } catch (error) {
        console.error("Error updating profile:", error);
        setError("Failed to update profile");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#EA9050" />
      </View>
    );
  }

  if (!globalUser && isOwner) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-500">
          Please sign up to view your profile.
        </Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-Secondary rounded-lg"
          onPress={() => router.push("/signUp")}
        >
          <Text className="text-white font-bold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-500">{error}</Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-Secondary rounded-lg"
          onPress={refresh}
        >
          <Text className="text-white font-bold">Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <ProfileHeader
        user={currentUser}
        isOwner={isOwner}
        onEditPress={() => setIsEditing(true)}
        onMessagePress={() => {}}
      />
      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOwner={isOwner}
      />
      <View className="flex-1">
        {activeTab === "info" && (
          <ProfileInfo
            isOwner={isOwner}
            user={currentUser}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            saveProfile={saveProfile}
            isLoading={loading}
          />
        )}
        {activeTab === "posts" && <ProfileActivities posts={posts} />}
        {activeTab === "reviews" && <Reviews reviews={reviews} />}
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
