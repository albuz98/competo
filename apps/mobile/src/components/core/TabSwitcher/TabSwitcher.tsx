import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Tab } from "../../../types/general";
import { TeamTab } from "../../../types/team";
import { tds } from "./TabSwitcher.styled";

interface TabSwitcherProps {
  TABS: Tab[];
  activeTab: TeamTab;
  setActiveTab: (tab: TeamTab) => void;
}

export const TabSwitcher = ({
  TABS,
  activeTab,
  setActiveTab,
}: TabSwitcherProps) => {
  return (
    <View style={tds.tabBar}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[tds.tabBtn, activeTab === tab.key && tds.tabBtnActive]}
          onPress={() => setActiveTab(tab.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              tds.tabBtnText,
              activeTab === tab.key && tds.tabBtnTextActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
