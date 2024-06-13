const { GoogleGenerativeAI } = require("@google/generative-ai");

import { API_KEY } from '@env';

const apiKey = API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export default async function geminiAI(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const msg = prompt;
    console.log(msg);

    try {
        const result = await model.generateContent(msg);
        const response = await result.response;
        if (response.text()) {
            const text = response.text();
            console.log("Text:", text);

            return { Text: text };
        }
        else {
            // No content generated
            return { Text: -1 }; // Return error message if no content is found
        }
    } catch (error) {
        console.error("Error:", error);
        return { error }; // Return error object if something went wrong
    }
}
