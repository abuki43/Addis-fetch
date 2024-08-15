import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import PostCard from "../../components/TravelerCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Ionicons } from "@expo/vector-icons"; // For the back icon

const OrdersScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [locationFrom, setLocationFrom] = useState("");
  const [locationTo, setLocationTo] = useState("");
  const [isSearchResults, setIsSearchResults] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(db, "posts"),
        where("postType", "==", "order")
      );
      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setFilteredPosts(postsData); // Initially, show all posts
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleSearch = () => {
    setSearchVisible(true);
  };

  const handleFilterSubmit = () => {
    const filtered = posts.filter((post) => {
      const matchQuery =
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLocationFrom =
        locationFrom === "" ||
        post.fromLocation.toLowerCase().includes(locationFrom.toLowerCase()) ||
        post.fromLocation.toLowerCase() === "anywhere";

      const matchLocationTo =
        locationTo === "" ||
        post.toLocation.toLowerCase().includes(locationTo.toLowerCase()) ||
        post.toLocation.toLowerCase() === "anywhere";

      return matchQuery && matchLocationFrom && matchLocationTo;
    });

    setFilteredPosts(filtered);
    setSearchVisible(false);
    setIsSearchResults(true);
  };

  const handleResetSearch = () => {
    setFilteredPosts(posts);
    setSearchQuery("");
    setLocationFrom("");
    setLocationTo("");
    setIsSearchResults(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={handleSearch}
          style={styles.searchInputContainer}
        >
          <Text style={styles.searchPlaceholder}>Search...</Text>
        </TouchableOpacity>
      </View>

      {isSearchResults && (
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            onPress={handleResetSearch}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
            <Text style={styles.backButtonText}>Back to All Orders</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredPosts.length === 0 ? (
            <Text>No posts available.</Text>
          ) : (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </ScrollView>
      )}

      <Modal
        visible={searchVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSearchVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchModalInput}
            />
            <TextInput
              placeholder="From Location..."
              value={locationFrom}
              onChangeText={setLocationFrom}
              style={styles.searchModalInput}
            />
            <TextInput
              placeholder="To Location..."
              value={locationTo}
              onChangeText={setLocationTo}
              style={styles.searchModalInput}
            />
            <TouchableOpacity
              onPress={handleFilterSubmit}
              style={styles.filterButton}
            >
              <Text style={styles.filterButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSearchVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  searchContainer: { padding: 16, backgroundColor: "#ffffff" },
  searchInputContainer: {
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f0f0f0",
  },
  searchPlaceholder: { color: "#a0a0a0" },
  scrollContainer: { padding: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  searchModalInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  filterButtonText: { color: "#ffffff" },
  closeButton: { marginTop: 10, alignItems: "center" },
  closeButtonText: { color: "#0000ff" },
  backButtonContainer: { padding: 16, backgroundColor: "#ffffff" },
  backButton: { flexDirection: "row", alignItems: "center" },
  backButtonText: { marginLeft: 8, fontSize: 16, color: "#000000" },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   searchContainer: {
//     padding: 15,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   searchInputContainer: {
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     justifyContent: "center",
//     backgroundColor: "#fff",
//   },
//   searchPlaceholder: {
//     fontSize: 16,
//     color: "#999",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingHorizontal: 16,
//     paddingVertical: 15,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
//   },
//   modalContainer: {
//     width: "90%",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//     alignItems: "center",
//   },
//   searchModalInput: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 5,
//     padding: 10,
//     fontSize: 16,
//     width: "100%",
//     marginBottom: 20,
//   },
//   filterButton: {
//     backgroundColor: "#007BFF",
//     borderRadius: 5,
//     padding: 15,
//     alignItems: "center",
//     marginBottom: 10,
//     width: "100%",
//   },
//   filterButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   closeButton: {
//     alignItems: "center",
//     padding: 10,
//     width: "100%",
//   },
//   closeButtonText: {
//     fontSize: 16,
//     color: "#007BFF",
//   },
// });

export default OrdersScreen;
