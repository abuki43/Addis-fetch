import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl, // Import RefreshControl
} from "react-native";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  or,
  orderBy,
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
  const [refreshing, setRefreshing] = useState(false); // State for RefreshControl
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
        where("reviewedPersonId", "==", profileUserID),
        orderBy("timestamp", "desc")
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

  const refresh = async () => {
    setError(null);
    setRefreshing(true); // Start refreshing
    try {
      await fetchUser();
      await fetchPosts();
      await fetchReviews();
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError("Failed to refresh data");
    } finally {
      setRefreshing(false); // Stop refreshing
    }
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
        <Text className="text-xl text-gray-600 font-medium text-center mb-2">
          Please sign up to view your profile.
        </Text>
        <Text className="text-gray-400 mb-6 text-center w-3/4">
          Don't have an account? Create a new one to enjoy all the features.
        </Text>
        <TouchableOpacity
          className="px-6 py-2 bg-Primary rounded-xl active:bg-orange-600 shadow-sm"
          onPress={() => router.push("/signUp")}
        >
          <Text className="text-white font-bold text-lg">Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-500">{error}</Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-Primary rounded-lg"
          onPress={refresh}
        >
          <Text className="text-white font-bold">Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      refreshControl={
        <RefreshControl
          refreshing={refreshing} // Controlled by the refreshing state
          onRefresh={refresh} // Call the refresh function
          colors={["#EA9050"]} // Customize the loading spinner color
          tintColor="#EA9050" // Customize the loading spinner color
        />
      }
    >
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
      <View className="flex-1 pt-0 pb-12">
        {activeTab === "info" && (
          <ProfileInfo
            isOwner={isOwner} // IF THE USER IS THE OWNER OF THE PROFILE
            user={currentUser} // USER THAT IS BEING VIEWED ON THE PROFILE
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
