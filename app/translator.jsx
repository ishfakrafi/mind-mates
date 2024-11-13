import axios from "axios";

const apiKey = "c4601f1be388488aa7433f305ff71533";
const apiRegion = "australiaeast";

export const translateText = async (text, selectedLanguage) => {
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
