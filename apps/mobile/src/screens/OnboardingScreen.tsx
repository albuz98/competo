import React, { useRef, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { styles, CARD_WIDTH, CARD_HEIGHT, CARD_GAP, SNAP, SIDE_PADDING } from "../styles/OnboardingScreen.styles";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

const SLIDES = [
  {
    id: "1",
    cardColors: ["#0f4c81", "#1e88e5"] as const,
    accentColor: "#42a5f5",
    emoji: "⚽",
    title: "Trova i migliori\ntornei nella tua zona",
    subtitle: "Scendi in campo e scopri tutte le funzionalità di Competo",
  },
  {
    id: "2",
    cardColors: ["#4a0080", "#9c27b0"] as const,
    accentColor: "#ce93d8",
    emoji: "🏆",
    title: "Iscriviti ai tornei\nin pochi click",
    subtitle: "Registrati, scegli il torneo e gareggia con i migliori atleti",
  },
  {
    id: "3",
    cardColors: ["#1a3a1a", "#2e7d32"] as const,
    accentColor: "#81c784",
    emoji: "🥇",
    title: "Competi e vinci\npremi incredibili",
    subtitle: "Metti alla prova le tue abilità e scala la classifica globale",
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<any>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      const next = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: next * SNAP, animated: true });
      setActiveIndex(next);
    } else {
      navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
    }
  };

  const skip = () => navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });

  const slide = SLIDES[activeIndex];

  return (
    <LinearGradient
      colors={["#E8601A", "#F5A020"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>

        {/* Carousel */}
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
            onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SNAP);
              setActiveIndex(Math.max(0, Math.min(index, SLIDES.length - 1)));
            }}
            scrollEventThrottle={16}
          >
            {SLIDES.map((s, i) => {
              const inputRange = [(i - 1) * SNAP, i * SNAP, (i + 1) * SNAP];

              const rotate = scrollX.interpolate({
                inputRange,
                outputRange: ["8deg", "0deg", "-8deg"],
                extrapolate: "clamp",
              });
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.87, 1, 0.87],
                extrapolate: "clamp",
              });
              const translateY = scrollX.interpolate({
                inputRange,
                outputRange: [16, 0, 16],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={s.id}
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    transform: [{ rotate }, { scale }, { translateY }],
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

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        {/* Text */}
        <View style={styles.textBlock}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.skipBtn} onPress={skip} activeOpacity={0.8}>
            <Text style={styles.skipBtnText}>SKIP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBtn} onPress={goNext} activeOpacity={0.8}>
            <Text style={styles.nextBtnText}>
              {activeIndex === SLIDES.length - 1 ? "START" : "NEXT"}
            </Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

