import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../components/firebase-config"; // Make sure this is the correct path
import { loadThemeConfig, getThemeConfig } from "../app/themeConfig"; // Import themeConfig
import { useNavigation } from "@react-navigation/native";
const PrivacySecurity = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypeNewPassword, setRetypeNewPassword] = useState("");

  const theme = getThemeConfig();
  const textSize = theme.baseFontSize;
  // Check if displayName exists, and split if it's valid
  useEffect(() => {
    if (auth.currentUser?.displayName) {
      const nameParts = auth.currentUser.displayName.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts[1] || "");
    } else {
      // Handle the case where displayName is not set
      setFirstName("");
      setLastName("");
    }
  }, []);

  const handleSaveDetails = () => {
    const displayName = `${firstName} ${lastName}`.trim();

    if (auth.currentUser) {
      updateProfile(auth.currentUser, { displayName })
        .then(() => {
          Alert.alert("Success", "User details updated successfully");
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  };

  const handlePasswordChange = () => {
    if (newPassword !== retypeNewPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    // Re-authenticate the user
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // Successfully re-authenticated, now update the password
        updatePassword(user, newPassword)
          .then(() => {
            Alert.alert("Success", "Password updated successfully");
            // Optionally, reset the input fields
            setOldPassword("");
            setNewPassword("");
            setRetypeNewPassword("");
          })
          .catch((error) => {
            Alert.alert("Error", error.message);
          });
      })
      .catch((error) => {
        Alert.alert("Error", "Old password is incorrect");
      });
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        backgroundColor: theme.colors.background,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ padding: 10 }}
      >
        <Text style={{ color: theme.colors.accent, fontSize: textSize }}>
          Back
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: textSize + 2,
          fontWeight: "bold",
          color: theme.colors.heading,
          marginBottom: 10,
        }}
      >
        Privacy and Security
      </Text>

      {/* User details form */}
      <Text style={{ color: theme.colors.textPrimary, fontSize: textSize }}>
        First Name
      </Text>
      <TextInput
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
        style={{
          borderColor: theme.colors.divider,
          borderWidth: 1,
          marginBottom: 10,
          padding: 8,
          color: theme.colors.textPrimary,
          backgroundColor: theme.colors.background,
        }}
      />

      <Text style={{ color: theme.colors.textPrimary, fontSize: textSize }}>
        Last Name
      </Text>
      <TextInput
        value={lastName}
        onChangeText={(text) => setLastName(text)}
        style={{
          borderColor: theme.colors.divider,
          borderWidth: 1,
          marginBottom: 10,
          padding: 8,
          color: theme.colors.textPrimary,
          backgroundColor: theme.colors.background,
        }}
      />

      <TouchableOpacity onPress={handleSaveDetails}>
        <View
          style={{
            padding: 10,
            backgroundColor: theme.colors.accent,
            borderRadius: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.colors.cswhite, fontSize: textSize }}>
            Save Details
          </Text>
        </View>
      </TouchableOpacity>

      {/* Password change form */}
      <Text
        style={{
          fontSize: textSize + 2,
          fontWeight: "bold",
          color: theme.colors.heading,
          marginTop: 20,
        }}
      >
        Change Password
      </Text>

      <Text style={{ color: theme.colors.textPrimary, fontSize: textSize }}>
        Old Password
      </Text>
      <TextInput
        value={oldPassword}
        onChangeText={(text) => setOldPassword(text)}
        style={{
          borderColor: theme.colors.divider,
          borderWidth: 1,
          marginBottom: 10,
          padding: 8,
          color: theme.colors.textPrimary,
          backgroundColor: theme.colors.background,
        }}
        secureTextEntry
      />

      <Text style={{ color: theme.colors.textPrimary, fontSize: textSize }}>
        New Password
      </Text>
      <TextInput
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
        style={{
          borderColor: theme.colors.divider,
          borderWidth: 1,
          marginBottom: 10,
          padding: 8,
          color: theme.colors.textPrimary,
          backgroundColor: theme.colors.background,
        }}
        secureTextEntry
      />

      <Text style={{ color: theme.colors.textPrimary, fontSize: textSize }}>
        Retype New Password
      </Text>
      <TextInput
        value={retypeNewPassword}
        onChangeText={(text) => setRetypeNewPassword(text)}
        style={{
          borderColor: theme.colors.divider,
          borderWidth: 1,
          marginBottom: 10,
          padding: 8,
          color: theme.colors.textPrimary,
          backgroundColor: theme.colors.background,
        }}
        secureTextEntry
      />

      <TouchableOpacity onPress={handlePasswordChange}>
        <View
          style={{
            padding: 10,
            backgroundColor: theme.colors.success,
            borderRadius: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.colors.cswhite, fontSize: textSize }}>
            Change Password
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PrivacySecurity;
