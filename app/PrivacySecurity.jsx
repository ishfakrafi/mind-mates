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

const PrivacySecurity = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypeNewPassword, setRetypeNewPassword] = useState("");

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
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Privacy and Security
      </Text>

      {/* User details form */}
      <Text>First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
        style={{
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 8,
        }}
      />

      <Text>Last Name</Text>
      <TextInput
        value={lastName}
        onChangeText={(text) => setLastName(text)}
        style={{
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 8,
        }}
      />

      <TouchableOpacity onPress={handleSaveDetails}>
        <View
          style={{
            padding: 10,
            backgroundColor: "blue",
            borderRadius: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Save Details</Text>
        </View>
      </TouchableOpacity>

      {/* Password change form */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
        Change Password
      </Text>

      <Text>Old Password</Text>
      <TextInput
        value={oldPassword}
        onChangeText={(text) => setOldPassword(text)}
        style={{
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 8,
        }}
        secureTextEntry
      />

      <Text>New Password</Text>
      <TextInput
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
        style={{
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 8,
        }}
        secureTextEntry
      />

      <Text>Retype New Password</Text>
      <TextInput
        value={retypeNewPassword}
        onChangeText={(text) => setRetypeNewPassword(text)}
        style={{
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 8,
        }}
        secureTextEntry
      />

      <TouchableOpacity onPress={handlePasswordChange}>
        <View
          style={{
            padding: 10,
            backgroundColor: "green",
            borderRadius: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Change Password</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PrivacySecurity;
