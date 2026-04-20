import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useChartData } from "@/src/hooks/useChartData";
import { Session } from "@/src/types/sessions";
import { formatTime24h } from "@/src/utils/chart/formatTime24hours";
import { LineChart } from "react-native-gifted-charts";
import { BacDataPoint, BacPointerLabel } from "./BacChartParts";

interface BacChartOverTimeProps {
  session: Session;
}

const TOOLTIP_WIDTH = 130;
const TOOLTIP_HEIGHT = 82;
const POINT_SPACING = 70;

const BacChartOverTime = ({ session }: BacChartOverTimeProps) => {
  const rawData = useChartData(
    session.drinks,
    session.startedAt,
    session.endedAt,
  );

  const chartData = rawData.map((p) => ({
    value: p.bac,
    label: formatTime24h(p.time),
    dataPointColor: "#49e2e2",
    drinkName: p.drink?.drinkName || "Metabolism",
    volume: p.drink?.volumeMl ?? null,
    abv: p.drink?.abv ?? null,
    isDrink: !!p.drink,
  }));

  const actualMax = Math.max(...chartData.map((d) => d.value), 0);
  const chartMax = actualMax > 0 ? Number((actualMax * 1.1).toFixed(2)) : 0.2;
  const chartWidth = chartData.length * POINT_SPACING + 80;

  return (
    <View className="w-full bg-slate-800/40 border border-slate-700 rounded-xl p-4 mb-6">
      <Text className="text-gray-400 text-xs font-bold uppercase mb-4">
        BAC Over Time
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          areaChart
          curved
          data={chartData}
          height={220}
          width={chartWidth}
          maxValue={chartMax}
          noOfSections={4}
          spacing={POINT_SPACING}
          initialSpacing={20}
          endSpacing={40}
          thickness={2}
          focusedDataPointShape="none"
          dataPointsRadius={0}
          customDataPoint={(item: any) => <BacDataPoint item={item} />}
          showFractionalValues
          roundToDigits={2}
          yAxisLabelSuffix="‰"
          formatYLabel={(label) => Number(label).toFixed(2)}
          yAxisTextStyle={{ color: "#94a3b8", fontSize: 10 }}
          yAxisLabelWidth={55}
          hideRules={false}
          rulesType="solid"
          rulesColor="rgba(71, 85, 105, 0.2)"
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor="rgba(71, 85, 105, 0.5)"
          xAxisLabelTextStyle={{
            color: "#94a3b8",
            fontSize: 9,
            width: POINT_SPACING,
            textAlign: "center",
            marginTop: 8,
          }}
          color="#49e2e2"
          startFillColor="#49e2e2"
          endFillColor="#49e2e2"
          startOpacity={0.15}
          endOpacity={0.01}
          overflowTop={56}
          overflowBottom={28}
          pointerConfig={{
            pointerStripColor: "rgba(73, 226, 226, 0.5)",
            pointerStripWidth: 2,
            strokeDashArray: [5, 5],
            autoAdjustPointerLabelPosition: true,
            pointerLabelWidth: TOOLTIP_WIDTH,
            pointerLabelHeight: TOOLTIP_HEIGHT,
            shiftPointerLabelY: 0,
            pointerLabelComponent: (items: any[]) => (
              <BacPointerLabel item={items[0]} chartMax={chartMax} />
            ),
          }}
        />
      </ScrollView>
    </View>
  );
};

export default BacChartOverTime;
