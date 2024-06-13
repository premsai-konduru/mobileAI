import { View, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { DocumentDirectoryPath, writeFile, readDir, stat, readFile, unlink } from 'react-native-fs';
import Features from '../components/Features';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Voice from '@react-native-community/voice';
import { PermissionsAndroid } from 'react-native';
import { dummyMessages } from '../constants';

import geminiAI from '../api/geminiAI';
import pollinationAI from '../api/pollinationAI';

export default function HomeScreen() {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  let result;

  useEffect(() => {
    requestAudioRecordingPermission();
    if (Voice.isAvailable) {
      Voice.onSpeechStart = speechStartHandler;
      Voice.onSpeechResults = speechResultsHandler;
      Voice.onSpeechEnd = speechEndHandler;
      Voice.onSpeechError = speechErrorHandler;
    }
    readFile();
    return () => {
      if (Voice.removeAllListeners) {
        Voice.removeAllListeners();
      }
    };
  }, []);

  // Function to append a message to the messages.json file
  const appendMessage = async (newMessage) => {
    try {
      const path = `${DocumentDirectoryPath}/messages.json`;
      let msgs = [];
      if (messages && messages.length > 0) {
        msgs = messages.map(message => ({ ...message, ImageContent: undefined })); // Remove ImageContent from existing messages
      }
      msgs.push(newMessage); // Append new message to msgs array
      await writeFile(path, JSON.stringify({ msgs }), 'utf8');
      setMessages(msgs); // Update state with updated messages
      // Alert.alert('Message appended', null, [{ text: 'OK' }]);
    } catch (e) {
      console.log('Error appending message:', e);
    }
  };

  // Function to read messages from file and set messages state
  const readFile = async () => {
    try {
      const path = `${DocumentDirectoryPath}/messages.json`;
      const exists = await readFile(path, 'utf8');
      if (exists) {
        const data = JSON.parse(exists);
        setMessages(data.msgs); // Set messages state with messages from file
      } else {
        // If file doesn't exist, create an empty file
        await writeFile(path, JSON.stringify({ msgs: [] }), 'utf8');
      }
    } catch (error) {
      console.log('Error reading file:', error);
    }
  };

  // Function to delete the messages file
  const deleteFile = async () => {
    try {
      const path = `${DocumentDirectoryPath}/messages.json`;
      await unlink(path);
      console.log('File deleted');
    } catch (error) {
      console.log('Error deleting file:', error);
    }
  };

  const requestAudioRecordingPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Audio Recording Permission',
          message: 'This app needs audio recording permission to use speech recognition.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Audio recording permission granted');
      } else {
        console.log('Audio recording permission denied');
      }
    } catch (err) {
      console.warn('Error requesting audio recording permission:', err);
    }
  };

  const clear = async () => {
    try {
      await deleteFile(); // Delete the messages file
      setMessages([]); // Set messages state to empty array
    } catch (error) {
      console.log('Error clearing messages:', error);
    }
  };

  const stopSpeaking = () => {
    setSpeaking(false);
    setRecording(false);
  };

  const speechStartHandler = () => {
    console.log("Speech start handler");
  };

  const speechEndHandler = () => {
    setRecording(false);
    console.log("Speech end handler");
  };

  const speechResultsHandler = (e) => {
    console.log("Voice event: ", e);
    const text = e.value[0];
    //console.log("text:", text);
    result = text;
    //console.log("result:",result);
    // Add spoken result to messages
    stopSpeaking();
    // setMessages(...messages, { role: 'user', content: text });
    appendMessage({ role: 'user', content: text });
    handleResponse();
  };

  const speechErrorHandler = (e) => {
    console.log("Speech error handler: ", e);
  };

  const startRecording = async () => {
    try {
      setRecording(true);
      await Voice.start('en-US'); // or 'en-GB'
      setSpeaking(true);
    } catch (error) {
      console.log("Error starting recording:", error);
      setRecording(false);
      setSpeaking(false);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      stopSpeaking();
    } catch (error) {
      console.log("Error stopping recording:", error);
    }
  };

  const handleResponse = async () => {

    //console.log(messages);
    const prompt = result;
    //console.log("prompt:", prompt);
    //console.log("result:", result);

    let text;
    let im;
    // for text response from gemini-pro ai
    try {
      const response = await geminiAI(prompt);
      //console.log(response);

      if (response) {
        if (response.Text != -1) {
          // Text-only response
          text = response.Text;
        } else {
          console.log('No response received from GeminiAI');
        }
      } else {
        console.log('No response received from GeminiAI');
      }
    } catch (error) {
      console.error('Error handling GeminiAI response:', error);
    }
    // For image response from pollination ai
    try {
      const response = await pollinationAI(prompt);
      console.log("polli:", response);
      if (response != -1) {
        im = response;
        console.log("im:", im);
      }
    } catch (error) {
      console.error('Error handling pollinationAI response:', error);
    }

    if (text.length > 1 && im) {
      // setMessages([...messages, { role: 'assistant', content: text, ImageContent: im }]);
      appendMessage({ role: 'assistant', content: text, ImageContent: im });
    } else if (text.length > 1) {
      // setMessages([...messages, { role: 'assistant', content: text }]);
      appendMessage({ role: 'assistant', content: text });
    } else if (im) {
      // setMessages([...messages, { role: 'assistant', content: text, ImageContent: im }]);
      appendMessage({ role: 'assistant', content: text, ImageContent: im });
    } else {
      // setMessages([...messages, { role: 'assistant', content: 'Something went wrong. Please try again later.' }]);
      appendMessage({ role: 'assistant', content: 'Something went wrong. Please try again later.' });
    }

  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
        {/* Bot icon */}
        <View className="flex-row justify-center">
          <Image className="my-5" source={require('../../assets/images/bot.png')} style={{ width: wp(35), height: wp(35) }} />
        </View>

        {/* Features or messages */}
        {messages.length > 0 ? (
          <View className="space-y-2 flex-1">
            <Text style={{ fontSize: wp(5) }} className="text-gray-700 font-semibold ml-1">
              Assistant
            </Text>
            <View style={{ height: hp(58) }} className="bg-neutral-200 rounded-3xl p-4">
              <ScrollView bounces={false} showsVerticalScrollIndicator={false} className="space-y-4">
                {messages.map((message, index) => {
                  if (message.role === 'assistant') {
                    if (message.content && message.content.includes('https')) {
                      // Render image
                      return (
                        <View key={index} className="flex-row justify-start">
                          <View className="p-2 flex rounded-2xl bg-purple-100 rounded-tl-none">
                            <Image source={{ uri: message.ImageContent }} className="rounded-2xl" resizeMode="contain" style={{ width: wp(60), height: wp(60) }} />
                          </View>
                        </View>
                      );
                    } else {
                      // Render text response
                      return (
                        <View key={index} style={{ width: wp(70) }} className="bg-purple-200 rounded-xl p-2 rounded-tr-none">
                          <Text className="text-black">{message.content}</Text>
                        </View>
                      );
                    }
                  } else {
                    // Render user input
                    return (
                      <View key={index} className="flex-row justify-end">
                        <View style={{ width: wp(70) }} className="bg-white rounded-xl p-2 rounded-tr-none">
                          <Text className="text-black">{message.content}</Text>
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}

        {/* Recording, clear, and stop buttons */}
        <View className="flex justify-center items-center mt-10">
          {recording ? (
            <TouchableOpacity onPress={stopRecording}>
              {/* Recording stop button */}
              <Image className="rounded-full mb" source={require('../../assets/images/Rec.gif')} style={{ width: hp(11), height: hp(11.5) }} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              {/* Recording start button */}
              <Image className="rounded-full mb-2.5" source={require('../../assets/images/mic.png')} style={{ width: hp(9), height: hp(9) }} />
            </TouchableOpacity>
          )}

          {messages.length > 0 && (
            <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10 }} className="bg-neutral-400 rounded-3xl ap-2 absolute right-2" onPress={clear}>
              <Text className="text-white font-semibold">Clear</Text>
            </TouchableOpacity>
          )}

          {speaking && (
            <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10 }} className="bg-red-400 rounded-3xl ap-2 absolute left-2" onPress={stopSpeaking}>
              <Text className="text-white font-semibold">Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
