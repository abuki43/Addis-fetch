import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  Button,
} from "react-native";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  get,
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
import { VirtualizedList } from "react-native";

const ProfilePage = ({ isOwner, userID }) => {
  const { user: globalUser, setUser } = useGlobalContext();
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  let profileUserID = isOwner ? globalUser.uid : userID; // this is used when to get the user id of the profile being viewed(where he is sees his own profile or someone else's profile)

  const fetchUser = async () => {
    try {
      // Reference to the user's document in Firestore
      const userDocRef = doc(db, "users", profileUserID);

      // Fetch the document snapshot
      const userDocSnap = await getDoc(userDocRef);

      // Check if the document exists and then retrieve the data
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setCurrentUser(userData);
      } else {
        console.error("No such user document!");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchPosts = async () => {
    console.log("from profile page", profileUserID);
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
      console.log("reviews", reviews);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews: ", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isOwner) {
      setCurrentUser(globalUser);
    } else {
      // Fetch user data from Firebase

      fetchUser();
    }
    // Fetch posts data from Firebase

    fetchPosts();
    fetchReviews();
  }, []);

  const saveProfile = async (info) => {
    console.log("clicked");
    if (isOwner) {
      console.log("passwed");
      try {
        setLoading(true);
        const userDocRef = doc(db, "users", globalUser.uid);
        await updateDoc(userDocRef, info);
        setIsEditing(false);
        setUser({ ...info, globalUser });
        fetchUser();
        setLoading(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  posts.map((post) => console.log("p", post.creatorUid));
  console.log("u", globalUser.uid);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View className=" flex-1 bg-gray-100 ">
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
  );
};

export default ProfilePage;
