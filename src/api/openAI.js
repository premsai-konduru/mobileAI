import axios from 'axios';
const { apiKey } = require('../constants');

const client = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    }
});

const chatGptEndPoint = 'https://api.openai.com/v1/chat/completions';
const dalleEndPoint = 'https://api.openai.com/v1/images/generations';

export const apiCall = async (prompt, messages) => {
    try {
        const res = await client.post(chatGptEndPoint, {
            model: "gpt-3.5-turbo",
            messages: [{
                role:'user',
                content: `Does this mesasge want to generate an AI picture, image, art or anything similar? ${prompt}. Simply answer with "yes" or "no".`
            }]
        })
        console.log('Response from OpenAI:', res.data);
    } catch (error) {
        console.log("Error calling OpenAI API: ", error);
        // return Promiseresolve({ messages: [...messages, { role: 'assistant', content: 'Sorry, I could not process your request. Please try again later.' }] });
        return Promise.resolve({success: false, msg: error.message});
    }
}