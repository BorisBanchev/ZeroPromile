import { Session } from "@/src/types/sessions";
import SessionDrinkBox from "./SessionDrinkBox";
import { View, Text } from "react-native";

interface SessionDrinkBoxesProps {
  session: Session;
}

const SessionDrinkBoxes = ({ session }: SessionDrinkBoxesProps) => {
  return (
    <View>
      <Text className="text-gray-400 mb-3">Drinks Timeline</Text>
      {session.drinks.reverse().map((d, index) => (
        <SessionDrinkBox drink={d} key={index} />
      ))}
    </View>
  );
};

export default SessionDrinkBoxes;
