import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Redirect, router } from "expo-router";
import Swiper from "react-native-swiper";
import { CustomButton } from "../components/CustomButton";

import logo from "../assets/images/logo.png";
import secondImage from "../assets/images/secondImage.png";
import thirdImage from "../assets/images/thirdImage1.png";
import fourthImage from "../assets/images/fourthImage.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "../context/GlobalProvider";
const { width } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const { setUser } = useGlobalContext();

  const swiperRef = useRef(null);

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1); // Move to the next slide
    }
  };

  const onStart = () => {
    router.push("/signIn");
  };

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const user = await AsyncStorage.getItem("userData");
  //       console.log("user", user);
  //       if (user) {
  //         try {
  //           const userData = JSON.parse(user);
  //           setUser(userData);
  //           router.push("/Travlers");
  //         } catch (error) {
  //           console.error("Error parsing user data from AsyncStorage:", error);
  //           // Handle the case where the user data is not a valid JSON string
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error retrieving user data from AsyncStorage:", error);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        showsPagination={true}
        paginationStyle={styles.pagination}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        loop={false}
        showsButtons={true} // shows the > button to move to the next slide
      >
        {/* Slide 1 */}
        <View style={styles.slide}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Welcome to AddisFetch!</Text>
          <Text style={styles.description}>Your world, delivered.</Text>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.slide}>
          <Image source={secondImage} style={styles.logo} />
          <Text style={styles.title}>Shop the World, Your Way.</Text>
          <Text style={styles.description}>
            Discover a global marketplace at your fingertips.
          </Text>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>next</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.slide}>
          <Image source={thirdImage} style={styles.logo} />
          <Text style={styles.title}>
            {" "}
            Earn Up to 30% Back on Your Flight Cost.
          </Text>
          <Text style={styles.description}>Shop and travel with us.</Text>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>next</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.slide}>
          <Image source={fourthImage} style={styles.logo} />
          <Text style={styles.title}>Chat and Negotiate.</Text>
          <Text style={styles.description}>
            Chat with sellers to negotiate prices and arrange meetups.
          </Text>
          <TouchableOpacity style={styles.nextButton} onPress={onStart}>
            <Text style={styles.nextButtonText}>start</Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Adjust this color if needed
    paddingHorizontal: 10,
  },
  logo: {
    width: width * 0.5, // Adjust the logo size as needed
    height: width * 0.5,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000", // Adjust this color if needed
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666666", // Adjust this color if needed
    textAlign: "center",
    paddingHorizontal: 20,
  },
  pagination: {
    position: "absolute",
    bottom: 100, // Ensure this value positions the dots above the button
    alignSelf: "center",
    color: "#000000", // Adjust this color if needed
  },
  dot: {
    backgroundColor: "#bbbbbb",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#000000",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  nextButton: {
    position: "absolute",
    bottom: 30, // Adjust this value to position the button above the bottom edge
    backgroundColor: "#35424a", // Button background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  nextButtonText: {
    color: "#ffffff", // Button text color
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
