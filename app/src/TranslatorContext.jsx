import React, { useState, createContext } from "react";
import axios from "axios";

export const TranslatorContext = createContext();

const TranslatorProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const translateText = async (text) => {
    const apiKey = "c4601f1be388488aa7433f305ff71533"; // Use your Azure Translator key
    const endpoint =
      "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";

    try {
      const response = await axios.post(
        `${endpoint}&to=${selectedLanguage}`,
        [{ text }],
        {
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            "Ocp-Apim-Subscription-Region": "australiaeast",
            "Content-Type": "application/json",
          },
        }
      );

      const translation = response.data?.[0]?.translations?.[0]?.text;
      return translation || text;
    } catch (error) {
      console.error("Error with translation:", error);
      return text;
    }
  };

  return (
    <TranslatorContext.Provider
      value={{ selectedLanguage, setSelectedLanguage, translateText }}
    >
      {children}
    </TranslatorContext.Provider>
  );
};

export default TranslatorProvider;
