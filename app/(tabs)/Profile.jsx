import ProfilePage from "../../components/profile/ProfilePage";
import { ScrollView } from "react-native";

const ProfileScreen = () => {
  const isOwner = true; // Determine if viewing own profile  route.params?.isOwner
  return <ProfilePage isOwner={isOwner} />;
};

export default ProfileScreen;
