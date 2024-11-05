import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { searchableItems } from "../components/searchableItems"; // Adjust the import path as needed

export default function SearchBar({ onSelectSuggestion }) {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  // Update suggestions based on query
  const handleSearch = (text) => {
    setQuery(text);
    const results = searchableItems.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(results);
  };

  // Handle suggestion selection
  const handleSelect = (item) => {
    setQuery("");
    setFilteredItems([]);
    onSelectSuggestion(item); // Pass the selected item to the parent component
  };

  return (
    <View style={tw`flex-col my-4 bg-gray-200 rounded-lg p-2`}>
      <TextInput
        style={tw`ml-2 text-gray-800`}
        placeholder="Search mental health topics"
        placeholderTextColor="#9CA3AF"
        value={query}
        onChangeText={handleSearch}
      />
      {query.length > 0 && (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <Text style={tw`p-2 text-gray-800`}>
                {item.name} in {item.category}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
