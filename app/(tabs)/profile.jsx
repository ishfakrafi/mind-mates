import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import axios from "axios";
import { signOut } from "firebase/auth";
import * as Notifications from "expo-notifications";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../../components/firebase-config";
import TopBar from "../src/TopBar";
import { icons } from "../../constants";
import { useFocusEffect } from "@react-navigation/native";
import { loadThemeConfig, getThemeConfig } from "../themeConfig";
import { translateText } from "../translator";
import { LanguageContext } from "../LanguageContext";
import { UserContext } from "../UserContext";
import { router } from "expo-router";
import tw from "tailwind-react-native-classnames";
import * as FileSystem from "expo-file-system";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const [theme, setTheme] = useState({
    colors: {},
    fontSizes: {},
    baseFontSize: 16,
  });
  const { user, loadUserData } = useContext(UserContext); // Access user data
  console.log("User from Context:", user);
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext);

  const [profileImage, setProfileImage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textSize, setTextSize] = useState(16);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [translatedText, setTranslatedText] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme configuration
  useFocusEffect(
    React.useCallback(() => {
      const loadThemeAndUser = async () => {
        await loadThemeConfig();
        const config = getThemeConfig();
        setTheme(config || {});
      };
      loadThemeAndUser();
    }, [])
  );

  // Trigger data load and set loading state
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        await loadUserData();
      }
      setIsLoading(false); // Stop loading once data is retrieved
    };
    fetchData();
  }, [user, loadUserData]); // Only depends on user and loadUserDa

  // Translate text based on selected language
  useEffect(() => {
    const loadTranslations = async () => {
      const translations = {
        hello: await translateText("Hello", selectedLanguage),
        userName: await translateText(
          user?.displayName || "User",
          selectedLanguage
        ),
        notification: await translateText("Notification", selectedLanguage),
        privacy: await translateText("Privacy and Security", selectedLanguage),
        appearance: await translateText("Appearance", selectedLanguage),
        logout: await translateText("Log out", selectedLanguage),
        deleteAccount: await translateText(
          "Delete my account",
          selectedLanguage
        ),
      };
      setTranslatedText(translations);
    };
    if (user) loadTranslations(); // Run only if user data is available
  }, [selectedLanguage, user]);

  // Handle notification permissions
  const requestNotificationPermissions = async () => {
    const isEnabled = !isNotificationEnabled;
    setIsNotificationEnabled(isEnabled);
    if (isEnabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          translatedText.alertNotificationPermission ||
            "Notification permissions required!"
        );
      }
    }
  };
  const firestore = getFirestore();
  // Handle photo change and upload to Firestore
  const handlePhotoChange = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access the media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Compress image for smaller size
    });

    console.log("Image Picker Result:", result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      if (!imageUri) {
        Alert.alert("Error", "Invalid image URI.");
        return;
      }

      // Get the currently authenticated user
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.uid) {
        console.log("Auth currentUser:", currentUser);
        Alert.alert("Error", "User is not authenticated.");
        return;
      }

      try {
        // Convert image to Base64
        const base64Image = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log("Base64 Image Length:", base64Image.length);

        // Update Firestore with Base64 image
        const userDocRef = doc(firestore, "users", currentUser.uid); // Use the valid UID
        await updateDoc(userDocRef, { profilePicture: base64Image });

        setProfileImage(`data:image/jpeg;base64,${base64Image}`);
        Alert.alert("Success", "Your profile picture has been updated.");
        console.log(`data:image/jpeg;base64,${base64Image}`);
      } catch (error) {
        console.error("Error updating profile picture:", error);
        Alert.alert("Error", "There was an issue saving your profile picture.");
      }
    } else {
      Alert.alert("Error", "Image selection was canceled or invalid.");
    }
  };

  const handleAppearance = () => {
    router.push("/Appearance");
  };
  const handlePrivacyStatement = () => {
    router.push("/PrivacySecurity");
  };
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        router.replace("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };
  const handleDeleteAccount = () => {
    Alert.alert(
      translatedText.deleteAccount || "Delete Account",
      translatedText.alertDeleteAccount ||
        "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
              currentUser
                .delete()
                .then(() => {
                  console.log("User account deleted");
                  Alert.alert(
                    translatedText.alertSuccess || "Success",
                    translatedText.deleteAccount ||
                      "Your account has been deleted."
                  );
                  router.replace("/");
                })
                .catch((error) => {
                  console.error("Error deleting user:", error);
                  Alert.alert(
                    translatedText.alertError || "Error",
                    translatedText.alertReauthenticate ||
                      "Please reauthenticate before deleting your account."
                  );
                });
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View
      style={[
        tw`p-4 py-8`,
        { flex: 1, backgroundColor: theme.colors.background },
      ]}
    >
      <TopBar
        firstName={user.displayName?.split(" ")[0]}
        email={user.email}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ paddingVertical: 20 }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 16 }}
          >
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: profileImage }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />

              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  backgroundColor: theme.colors.cswhite,
                  borderRadius: 50,
                  padding: 5,
                }}
                onPress={handlePhotoChange}
              >
                <Image
                  source={require("../../assets/icons/edit.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text
                style={{
                  fontSize: textSize,
                  fontWeight: "bold",
                  color: theme.colors.heading,
                }}
              >
                {translatedText.userName || user.displayName}
              </Text>
              <Text
                style={{
                  fontSize: textSize - 2,
                  color: theme.colors.textSecondary,
                }}
              >
                {user.email}
              </Text>
            </View>
          </View>
          {/* Notification Switch */}
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomColor: theme.colors.divider,
            }}
          >
            <Text
              style={{ fontSize: textSize, color: theme.colors.textPrimary }}
            >
              {translatedText.notification || "Notification"}
            </Text>
            <Switch
              value={isNotificationEnabled}
              onValueChange={requestNotificationPermissions}
            />
          </View>
          {/* Privacy and Security */}
          <TouchableOpacity onPress={handlePrivacyStatement}>
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.divider,
              }}
            >
              <Text
                style={{ fontSize: textSize, color: theme.colors.textPrimary }}
              >
                {translatedText.privacy || "Privacy and Security"}
              </Text>
            </View>
          </TouchableOpacity>
          {/* Appearance */}
          <TouchableOpacity onPress={handleAppearance}>
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.divider,
              }}
            >
              <Text
                style={{ fontSize: textSize, color: theme.colors.textPrimary }}
              >
                {translatedText.appearance || "Appearance"}
              </Text>
            </View>
          </TouchableOpacity>
          {/* Log Out */}
          <TouchableOpacity onPress={handleLogout}>
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.divider,
              }}
            >
              <Text
                style={{ fontSize: textSize, color: theme.colors.textPrimary }}
              >
                {translatedText.logout || "Log out"}
              </Text>
            </View>
          </TouchableOpacity>
          {/* Delete Account */}
          <TouchableOpacity onPress={handleDeleteAccount}>
            <View style={{ padding: 16, backgroundColor: theme.colors.danger }}>
              <Text
                style={{
                  fontSize: textSize,
                  color: theme.colors.cswhite,
                  textAlign: "center",
                }}
              >
                {translatedText.deleteAccount || "Delete my account"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
