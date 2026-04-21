import { useEffect, useRef, useState } from "react";
import { View, Text, Animated, PanResponder } from "react-native";
import { fps } from "./RangeSlider.styled";
import { MIN_GAP, PRICE_MAX, THUMB_SIZE } from "../../../constants/filters";

interface RangeSliderProps {
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

function formatPrice(price: number): string {
  if (price === 0) return "Gratis";
  if (price >= 1000) {
    const k = price / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}K€`;
  }
  return `${price}€`;
}

export function RangeSlider({
  minValue,
  maxValue,
  onChange,
  onDragStart,
  onDragEnd,
}: RangeSliderProps) {
  const trackWidthRef = useRef(0);
  const leftXRef = useRef(0);
  const rightXRef = useRef(0);
  const startLeftX = useRef(0);
  const startRightX = useRef(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onDragStartRef = useRef(onDragStart);
  onDragStartRef.current = onDragStart;
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;

  const leftThumbX = useRef(new Animated.Value(0)).current;
  const rightThumbX = useRef(new Animated.Value(0)).current;

  const [displayMin, setDisplayMin] = useState(minValue);
  const [displayMax, setDisplayMax] = useState(maxValue);

  useEffect(() => {
    setDisplayMin(minValue);
    setDisplayMax(maxValue);
    const tw = trackWidthRef.current;
    if (tw > 0) {
      const lx = (minValue / PRICE_MAX) * tw;
      const rx = (maxValue / PRICE_MAX) * tw;
      leftThumbX.setValue(lx);
      rightThumbX.setValue(rx);
      leftXRef.current = lx;
      rightXRef.current = rx;
    }
  }, [minValue, maxValue, leftThumbX, rightThumbX]);

  const onLayout = (e: { nativeEvent: { layout: { width: number } } }) => {
    const tw = e.nativeEvent.layout.width;
    trackWidthRef.current = tw;
    const lx = (minValue / PRICE_MAX) * tw;
    const rx = (maxValue / PRICE_MAX) * tw;
    leftThumbX.setValue(lx);
    rightThumbX.setValue(rx);
    leftXRef.current = lx;
    rightXRef.current = rx;
  };

  const leftPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startLeftX.current = leftXRef.current;
        onDragStartRef.current?.();
      },
      onPanResponderMove: (_, { dx }) => {
        const tw = trackWidthRef.current;
        if (tw === 0) return;
        const newX = Math.max(
          0,
          Math.min(rightXRef.current - MIN_GAP, startLeftX.current + dx),
        );
        leftThumbX.setValue(newX);
        leftXRef.current = newX;
        setDisplayMin(Math.round((newX / tw) * PRICE_MAX));
      },
      onPanResponderRelease: () => {
        const tw = trackWidthRef.current;
        onChangeRef.current(
          Math.round((leftXRef.current / tw) * PRICE_MAX),
          Math.round((rightXRef.current / tw) * PRICE_MAX),
        );
        onDragEndRef.current?.();
      },
    }),
  ).current;

  const rightPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startRightX.current = rightXRef.current;
        onDragStartRef.current?.();
      },
      onPanResponderMove: (_, { dx }) => {
        const tw = trackWidthRef.current;
        if (tw === 0) return;
        const newX = Math.max(
          leftXRef.current + MIN_GAP,
          Math.min(tw, startRightX.current + dx),
        );
        rightThumbX.setValue(newX);
        rightXRef.current = newX;
        setDisplayMax(Math.round((newX / tw) * PRICE_MAX));
      },
      onPanResponderRelease: () => {
        const tw = trackWidthRef.current;
        onChangeRef.current(
          Math.round((leftXRef.current / tw) * PRICE_MAX),
          Math.round((rightXRef.current / tw) * PRICE_MAX),
        );
        onDragEndRef.current?.();
      },
    }),
  ).current;

  const minActive = displayMin > 0;
  const maxActive = displayMax < PRICE_MAX;

  return (
    <View style={fps.sliderWrapper}>
      {/* Current values */}
      <View style={fps.sliderLabelsRow}>
        <Text
          style={[
            fps.sliderRangeLabel,
            minActive && fps.sliderRangeLabelActive,
          ]}
        >
          {formatPrice(displayMin)}
        </Text>
        <Text
          style={[
            fps.sliderRangeLabel,
            maxActive && fps.sliderRangeLabelActive,
          ]}
        >
          {formatPrice(displayMax)}
        </Text>
      </View>

      {/* Track */}
      <View style={{ paddingHorizontal: THUMB_SIZE / 2 }}>
        <View style={fps.sliderTrackOuter} onLayout={onLayout}>
          {/* Colored fill between thumbs */}
          <Animated.View
            style={[
              fps.sliderTrackFill,
              {
                left: leftThumbX,
                width: Animated.subtract(rightThumbX, leftThumbX),
              },
            ]}
          />
          {/* Left thumb */}
          <Animated.View
            style={[
              fps.sliderThumb,
              {
                transform: [
                  { translateX: Animated.subtract(leftThumbX, THUMB_SIZE / 2) },
                ],
              },
            ]}
            {...leftPanResponder.panHandlers}
          />
          {/* Right thumb */}
          <Animated.View
            style={[
              fps.sliderThumb,
              {
                transform: [
                  {
                    translateX: Animated.subtract(rightThumbX, THUMB_SIZE / 2),
                  },
                ],
              },
            ]}
            {...rightPanResponder.panHandlers}
          />
        </View>
      </View>

      {/* Fixed end labels */}
      <View style={fps.sliderEndLabels}>
        <Text style={fps.sliderEndLabelText}>Gratis</Text>
        <Text style={fps.sliderEndLabelText}>5.000€</Text>
      </View>
    </View>
  );
}
