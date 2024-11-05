import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import axios from "axios";
import { updateProfile, signOut } from "firebase/auth";
import * as Notifications from "expo-notifications";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../../components/firebase-config";
import TopBar from "../src/TopBar";
import { useNavigation } from "@react-navigation/native";
import { icons } from "../../constants";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadThemeConfig, getThemeConfig } from "../themeConfig"; // Ensure correct path

const Profile = () => {
  const navigation = useNavigation();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textSize, setTextSize] = useState(16);

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [user, setUser] = useState({
    displayName: "",
    email: "",
    photoURL: null,
  });
  const [firstName, setFirstName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedText, setTranslatedText] = useState({});

  const theme = getThemeConfig(); // Get the theme configuration, including colors

  const apiKey = "c4601f1be388488aa7433f305ff71533";
  const apiRegion = "australiaeast";

  // Function to translate text
  const translateText = async (text) => {
    try {
      const response = await axios.post(
        `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${selectedLanguage}`,
        [{ text }],
        {
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            "Ocp-Apim-Subscription-Region": apiRegion,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data[0]?.translations[0]?.text || text;
    } catch (error) {
      console.error("Error translating text:", error);
      return text;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const initializeTheme = async () => {
        await loadThemeConfig(); // Load saved theme config from AsyncStorage
        const config = getThemeConfig();
        setIsDarkMode(config.isDarkMode);
        setTextSize(config.baseFontSize);
      };

      initializeTheme();
    }, [])
  );

  useEffect(() => {
    console.log("Dark mode:", isDarkMode);
    console.log("Text size:", textSize);
  }, [isDarkMode, textSize]);

  // Load user data
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const fullName = currentUser.displayName || "Anonymous User";
      const firstName = fullName.split(" ")[0];
      setFirstName(firstName);
      setUser({
        displayName: fullName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
      });
    }
  }, []);

  // Load translations based on selected language and user data
  useEffect(() => {
    const loadTranslations = async () => {
      const translations = {
        hello: await translateText("Hello"),
        userName: await translateText(`${user.displayName}`),
        notification: await translateText("Notification"),
        privacy: await translateText("Privacy and Security"),
        appearance: await translateText("Appearance"),
        logout: await translateText("Log out"),
        deleteAccount: await translateText("Delete my account"),
        alertSuccess: await translateText("Success"),
        alertPictureUpdated: await translateText(
          "Your profile picture has been updated."
        ),
        alertDeleteAccount: await translateText(
          "Are you sure you want to delete your account? This action cannot be undone."
        ),
        alertNotificationPermission: await translateText(
          "Sorry, we need notification permissions to make this work!"
        ),
        alertError: await translateText("Error"),
        alertReauthenticate: await translateText(
          "Please reauthenticate before deleting your account."
        ),
      };
      setTranslatedText(translations);
    };

    loadTranslations();
  }, [selectedLanguage, user.displayName]);

  // Handle notification permissions
  const requestNotificationPermissions = async () => {
    const isEnabled = !isNotificationEnabled;
    setIsNotificationEnabled(isEnabled);
    if (isEnabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          translatedText.alertNotificationPermission ||
            "Sorry, we need notification permissions to make this work!"
        );
      }
    }
  };

  // Handle photo change
  const handlePhotoChange = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(
        translatedText.alertError ||
          "Permission to access the media library is required!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const currentUser = auth.currentUser;
      const newPhotoURL = result.assets[0].uri;

      await updateProfile(currentUser, { photoURL: newPhotoURL });

      setUser((prevUser) => ({
        ...prevUser,
        photoURL: newPhotoURL,
      }));

      Alert.alert(
        translatedText.alertSuccess || "Success",
        translatedText.alertPictureUpdated ||
          "Your profile picture has been updated."
      );
    }
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

  const handlePrivacyStatement = () => {
    router.push("/PrivacySecurity");
  };

  const handleAppearance = () => {
    router.push("/Appearance");
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TopBar
        firstName={firstName}
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
                source={user.photoURL ? { uri: user.photoURL } : icons.google}
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
                {translatedText.userName || `${user.displayName}`}
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
              borderBottomColor: theme.colors.divider,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
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
