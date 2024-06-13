import AppNavigation from './src/navigation';
import React, { useEffect } from 'react'
// import { apiCall } from './src/api/openAI';
// require('dotenv').config();
// import dotenv from 'react-native-dotenv';
import geminiAI from './src/api/geminiAI';
import pollinationAI from './src/api/pollinationAI';

// dotenv.config();

export default function App() {
  // useEffect(() => { 
  //   // code to run on component mount
  //   apiCall('What is quantum computing');
  // }, []);
  // geminiAI();
  // pollinationAI("generate a beautiful scenery");
  return (
    <AppNavigation />
  )
}