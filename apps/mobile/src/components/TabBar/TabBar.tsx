import { View, Text, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { tbStyles } from "./TabBar.styles";
import { colors } from "../../theme/colors";
import { ButtonGeneric } from "../Button/Button";

interface TabItem<T extends string> {
  key: T;
  label: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
}

interface TabBarProps<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (key: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function TabBar<T extends string>({
  tabs,
  value,
  onChange,
  style,
}: TabBarProps<T>) {
  return (
    <View style={[tbStyles.tabBar, style]}>
      {tabs.map((tab) => {
        const isActive = tab.key === value;
        return (
          <ButtonGeneric
            key={tab.key}
            style={[tbStyles.tab, isActive && tbStyles.tabActive]}
            handleBtn={() => onChange(tab.key)}
          >
            {tab.icon && (
              <Ionicons
                name={tab.icon}
                size={15}
                color={isActive ? colors.primary : colors.placeholder}
              />
            )}
            <Text
              style={[tbStyles.tabText, isActive && tbStyles.tabTextActive]}
            >
              {tab.label}
            </Text>
          </ButtonGeneric>
        );
      })}
    </View>
  );
}
