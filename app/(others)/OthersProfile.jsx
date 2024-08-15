import ProfilePage from "../../components/profile/ProfilePage";
import { ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

const OthersProfile = ({ route }) => {
  let params = useLocalSearchParams();
  let userId = params?.UID;

  console.log("otherprofileId", userId);

  const isOwner = false; // Determine if viewing own profile  route.params?.isOwner
  return <ProfilePage isOwner={isOwner} userID={userId} />;
};

export default OthersProfile;
