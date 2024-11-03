import axios from "axios";

const subscriptionKey = "c4601f1be388488aa7433f305ff71533";
const endpoint = "https://api.cognitive.microsofttranslator.com/";

export const translateText = async (text, targetLang) => {
  const url = `${endpoint}&to=${targetLang}`;

  const options = {
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Ocp-Apim-Subscription-Region": "australiaeast",
      "Content-Type": "application/json",
    },
  };

  const body = [{ Text: text }];

  try {
    const response = await axios.post(url, body, options);
    return response.data[0].translations[0].text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return the original text on failure
  }
};
