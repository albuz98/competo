import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  CARD_GAP,
  CARD_HEIGHT,
  CARD_WIDTH,
  SIDE_PADDING,
  SNAP,
  styles,
} from "./OnboardingCarousel.styles";

const SLIDES = [
  {
    id: "1",
    cardColors: ["#0f4c81", "#1e88e5"] as const,
    accentColor: "#42a5f5",
    emoji: "⚽",
    title: "Trova i migliori tornei",
  },
  {
    id: "2",
    cardColors: ["#4a0080", "#9c27b0"] as const,
    accentColor: "#ce93d8",
    emoji: "🏆",
    title: "Iscriviti in pochi click",
  },
  {
    id: "3",
    cardColors: ["#1a3a1a", "#2e7d32"] as const,
    accentColor: "#81c784",
    emoji: "🥇",
    title: "Competi e vinci",
  },
];

type Props = {
  onIndexChange?: (index: number, total: number) => void;
};

export default function OnboardingCarousel({ onIndexChange }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<any>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = scrollX.addListener(({ value }) => {
      const index = Math.round(value / SNAP);
      const clamped = Math.max(0, Math.min(index, SLIDES.length - 1));
      setActiveIndex(clamped);
      onIndexChange?.(clamped, SLIDES.length);
    });
    return () => scrollX.removeListener(id);
  }, []);

  const slide = SLIDES[activeIndex];

  return (
    <>
      <View style={styles.carouselWrapper}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          decelerationRate="fast"
          snapToInterval={SNAP}
          snapToAlignment="start"
          contentContainerStyle={{
            paddingHorizontal: SIDE_PADDING,
            gap: CARD_GAP,
            alignItems: "center",
          }}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
        >
          {SLIDES.map((s, i) => {
            const inputRange = [(i - 1) * SNAP, i * SNAP, (i + 1) * SNAP];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.9, 1, 0.9],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={s.id}
                style={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  transform: [{ scale }],
                }}
              >
                <LinearGradient
                  colors={s.cardColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.3, y: 1 }}
                  style={styles.card}
                >
                  <View
                    style={[
                      styles.circle,
                      styles.circleLarge,
                      { backgroundColor: s.accentColor },
                    ]}
                  />
                  <View
                    style={[
                      styles.circle,
                      styles.circleSmall,
                      { backgroundColor: s.accentColor },
                    ]}
                  />
                  <Text style={styles.cardEmoji}>{s.emoji}</Text>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{slide.title}</Text>
      </View>
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </>
  );
}
