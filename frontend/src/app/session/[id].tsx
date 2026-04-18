import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSessions } from "@/src/hooks/useSessions";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Notification } from "@/src/components/ui/Notification";
import AntDesign from "@expo/vector-icons/AntDesign";
import { formatPrettyDate } from "@/src/utils/formatDateToDayMonthDateYear";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { formatSessionDuration } from "@/src/utils/formatSessionDuration";

export default function SessionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { sessions } = useSessions();

  const session = sessions?.find((session) => session.sessionId === id);
  console.log(session?.drinks);
  if (!session) return;

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
      <Notification />
      <ScrollView className="px-4 py-">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1 mb-3 "
        >
          <AntDesign name="arrow-left" size={12} color="grey" />
          <Text className="text-gray-400">Back</Text>
        </TouchableOpacity>
        <View className="flex-col gap-0.3">
          <View className="flex-row gap-2 ">
            <Text className="text-white font-bold text-base">
              {session?.sessionName}
            </Text>
            {session?.active && (
              <View className="mx-1 my-1 px-1 bg-[#3b989b80] rounded-full justify-center">
                <Text className="text-[10px] text-[#32e1ca] font-bold">
                  Active
                </Text>
              </View>
            )}
          </View>
          <Text className="text-gray-400 text-sm">
            {formatPrettyDate(session.startedAt)}
          </Text>
        </View>
        <View className="flex-row flex-wrap justify-between my-4">
          <View className="w-[48%] h-20 mb-3 bg-slate-800/40 border border-slate-700 rounded-xl px-3 py-2">
            <View className="flex-row items-center gap-2 my-1">
              <Ionicons name={"trending-up-outline"} size={14} color="grey" />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="flex-1 text-gray-400 text-sm font-semibold"
              >
                Peak BAC
              </Text>
            </View>
            <Text
              style={
                session.peakBac > 0
                  ? { color: "#fa6171" }
                  : { color: "#32e1ca" }
              }
              className="text-xl font-bold"
            >
              {session.peakBac.toFixed(2)}‰
            </Text>
          </View>

          <View className="w-[48%] h-20 mb-3 bg-slate-800/40 border border-slate-700 rounded-xl px-3 py-2">
            <View className="flex-row items-center gap-2 my-1">
              <MaterialCommunityIcons
                name="glass-cocktail"
                color="grey"
                size={14}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="flex-1 text-gray-400 text-sm font-semibold"
              >
                Total Drinks
              </Text>
            </View>
            <Text className="text-white text-xl font-bold">
              {session.totalDrinks}
            </Text>
          </View>

          <View className="w-[48%] h-20 mb-3 bg-slate-800/40 border border-slate-700 rounded-xl px-3 py-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name={"time-outline"} size={14} color="grey" />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="flex-1 text-gray-400 text-sm font-semibold"
              >
                Duration
              </Text>
            </View>
            <Text className="text-white text-xl font-bold">
              {formatSessionDuration(session.startedAt)}
            </Text>
          </View>

          <View className="w-[48%] h-20 mb-3 bg-slate-800/40 border border-slate-700 rounded-xl px-3 py-2">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="water-drop" size={14} color="gray" />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="flex-1 text-gray-400 text-sm font-semibold"
              >
                Total Alcohol
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
