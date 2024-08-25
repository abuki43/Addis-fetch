import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const ORDERS_BATCH_SIZE = 100;

const usePosts = () => {
  const [postResult, setPostResult] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(
    async (type = "travler", startAfterDoc = null, isRefreshing = false) => {
      // if (loading && !isRefreshing) return;

      setLoading(true);
      try {
        let postsQuery = query(
          collection(db, "posts"),
          where("postType", "==", type?.toLowerCase()),
          limit(ORDERS_BATCH_SIZE)
        );

        if (startAfterDoc) {
          postsQuery = query(postsQuery, startAfter(startAfterDoc));
          console.log("start after doc");
        }

        const querySnapshot = await getDocs(postsQuery);

        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isRefreshing) {
          setPostResult(postsData);
          console.log(type, postsData);
        } else {
          setPostResult((prevPosts) => [...prevPosts, ...postsData]);
          console.log(type, postResult);
        }

        if (querySnapshot.docs.length > 0) {
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [ORDERS_BATCH_SIZE]
  );

  const refreshPosts = useCallback(
    async (type) => {
      setRefreshing(true);
      setPostResult([]);
      setLastVisible(null);
      setHasMore(true);
      await fetchPosts(type, null, true);
    },
    [fetchPosts]
  );

  return { postResult, fetchPosts, refreshPosts, loading, hasMore, refreshing };
};

export default usePosts;
