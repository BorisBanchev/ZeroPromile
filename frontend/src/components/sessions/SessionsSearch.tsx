import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SessionsSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SessionsSearch = ({ searchTerm, setSearchTerm }: SessionsSearchProps) => {
  return (
    <View className="mb-5 flex-row items-center rounded-2xl bg-[#0A1628] px-4 py-3 border border-slate-700">
      <Ionicons name="search" size={14} color="gray" />

      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search sessions..."
        placeholderTextColor="#6B7280"
        className="ml-3 flex-1 text-white"
      />
    </View>
  );
};

export default SessionsSearch;
