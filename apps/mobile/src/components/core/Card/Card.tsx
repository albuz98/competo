import React from "react";
import { View } from "react-native";
import { styles } from "./Card.styled";

interface CardProps {
  children: React.ReactNode;
  style?: object;
}

export const Card = ({ children, style }: CardProps) => {
  return <View style={[styles.card, style]}>{children}</View>;
};
