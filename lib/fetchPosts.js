import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const ORDERS_BATCH_SIZE = 100;

const usePosts = (postType, searchQuery) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(
    async (startAfterDoc = null, clearExisting = false) => {
      setLoading(true);
      setError("");
      try {
        let postsQuery = query(
          collection(db, "posts"),
          where("postType", "==", postType),
          orderBy("timestamp", "desc"),
          limit(ORDERS_BATCH_SIZE)
        );

        if (startAfterDoc) {
          postsQuery = query(postsQuery, startAfter(startAfterDoc));
        }

        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (postsData.length < ORDERS_BATCH_SIZE) {
          setHasMore(false);
        }

        setPosts((prevPosts) =>
          clearExisting ? postsData : [...prevPosts, ...postsData]
        );
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(
          error.message.includes("network")
            ? "Network error. Please check your internet connection."
            : "An error occurred while fetching posts."
        );
      } finally {
        setLoading(false);
      }
    },
    [postType]
  );

  useEffect(() => {
    if (!searchQuery && lastVisible === null) {
      fetchPosts(null, true);
    }
  }, [fetchPosts, searchQuery, lastVisible]);

  const onRefresh = useCallback(async () => {
    console.log("Refreshing posts...");
    setRefreshing(true);
    setLastVisible(null);
    setHasMore(true);
    await fetchPosts(null, true);
    setRefreshing(false);
  }, [fetchPosts]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && !searchQuery) {
      fetchPosts(lastVisible);
    }
  }, [hasMore, loading, lastVisible, fetchPosts, searchQuery]);

  const applyFilters = (query) => {
    const results = posts.filter((post) => {
      const description = post.description
        ? post.description.toLowerCase()
        : "";
      const category = post.category ? post.category.toLowerCase() : "";
      const fromLocation = post.fromLocation
        ? post.fromLocation.toLowerCase()
        : "";
      const toLocation = post.toLocation ? post.toLocation.toLowerCase() : "";

      const matchQuery =
        description.includes(query.toLowerCase()) ||
        category.includes(query.toLowerCase()) ||
        fromLocation.includes(query.toLowerCase()) ||
        toLocation.includes(query.toLowerCase());

      return matchQuery;
    });

    setFilteredPosts(results);
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredPosts(posts);
    }
  }, [posts, searchQuery]);

  return {
    posts,
    filteredPosts,
    setFilteredPosts,
    loading,
    refreshing,
    error,
    hasMore,
    onRefresh,
    handleLoadMore,
    applyFilters,
  };
};

export default usePosts;
