import { deleteUser } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const deleteAccountFromAuth = async (user) => {
  try {
    await deleteUser(user);
    console.log("User deleted from authentication");
  } catch (error) {
    console.error("Error deleting user from authentication:", error);
    throw error;
  }
};

const changeDeletedUserData = async (user) => {
  try {
    const userDoc = doc(db, "users", user.uid); // Reference to user document
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      await updateDoc(userDoc, {
        fullname: "Deleted User",
      });
      console.log("User data updated");
    } else {
      console.log("User document not found");
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

const changeDeletedUserPosts = async (user) => {
  try {
    // Update posts
    const postsQuery = query(
      collection(db, "posts"),
      where("creatorUid", "==", user.uid)
    );
    const postsSnapshot = await getDocs(postsQuery);
    postsSnapshot.forEach(async (post) => {
      await updateDoc(post.ref, {
        username: "Deleted User",
      });
    });

    // Update reviews
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("reviewerId", "==", user.uid)
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);
    reviewsSnapshot.forEach(async (review) => {
      await updateDoc(review.ref, {
        reviewerName: "Deleted User",
      });
    });
  } catch (error) {
    console.error("Error updating posts or reviews:", error);
    throw error;
  }
};

const deleteAccount = async (user) => {
  try {
    await changeDeletedUserData(user),
      await changeDeletedUserPosts(user),
      await deleteAccountFromAuth(user),
      console.log("Account deleted successfully");
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error; // Rethrow the error to propagate it
  }
};

export default deleteAccount;
