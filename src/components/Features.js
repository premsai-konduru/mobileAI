import { View, Text, Image } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export default function Features() {
    return (
        <View style={{ height: hp(60) }} className="space-y-4">
            <Text style={{ fontSize: wp(6.5) }} className="font-semibold text-gray-700">Features</Text>
            {/* Gemini ai */}
            <View className="bg-emerald-200 p-4 rounded-xl space-y-2">
                <View className="flex-row item-center space-x-1">
                    <Image source={require('../../assets/images/GeminiIcon.png')} style={{ width: hp(4), height: hp(4) }} />
                    <Text style={{ fontSize: wp(4.8) }} className="my-auto px-3 font-semibold text-gray-700"> Gemini-pro </Text>
                </View>
                <Text style={{ fontSize: wp(3.8) }} className="text-gray-700 font-medium" >
                    Gemini pro model is a powerful AI model that can generate human-like text based on your prompt.
                </Text>
            </View>
            {/* Pollination ai */}
            <View className="bg-gray-200 p-4 rounded-xl space-y-2">
                <View className="flex-row item-center space-x-1">
                    <Image source={require('../../assets/images/pollinationIcon.png')} style={{ width: hp(4), height: hp(4) }} />
                    <Text style={{ fontSize: wp(4.8) }} className="my-auto px-3 font-semibold text-gray-700">Pollination ai</Text>
                </View>
                <Text style={{ fontSize: wp(3.8) }} className="text-gray-700 font-medium" >
                    Pollination AI can generate high-quality images based on your prompt, providing you with a visual representation of your ideas.
                </Text>
            </View>
            {/* Smart AI */}
            <View className="bg-cyan-200 p-4 rounded-xl space-y-2">
                <View className="flex-row item-center space-x-1">
                    <Image source={require('../../assets/images/smartaiIcon.png')} style={{ width: hp(4), height: hp(4) }} />
                    <Text style={{ fontSize: wp(4.8) }} className="my-auto px-3 font-semibold text-gray-700">Smart AI</Text>
                </View>
                <Text style={{ fontSize: wp(3.8) }} className="text-gray-700 font-medium" >
                    A powerful voice assistant with the abilities of Gemini-pro and pollination.ai, providing you the best of both worlds.
                </Text>
            </View>
        </View>
    )
}