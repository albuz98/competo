import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  Insets,
} from "react-native";
import { styles } from "./Button.styles";
import { colorGradient, colors } from "../../theme/colors";
import { big, medium, sizesEnum, small } from "../../theme/dimension";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ─── ButtonFullColored ───────────────────────────────────────────────────────────

interface ButtonFullColoredProps {
  text: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  handleBtn: () => Promise<void> | void;
  isDisabled?: boolean;
  loading?: boolean;
  loaderColor?: string;
  isColored?: boolean;
  size?: sizesEnum;
}

export function ButtonFullColored({
  text,
  iconLeft,
  iconRight,
  handleBtn,
  isDisabled,
  loading,
  isColored = false,
  loaderColor = "#E8601A",
  size = sizesEnum.big,
}: ButtonFullColoredProps) {
  const colorBg = isDisabled
    ? colors.disabled
    : isColored
      ? colors.primaryGradientMid
      : "#fff";
  const colorText =
    isColored && !isDisabled ? "#fff" : colors.primaryGradientMid;

  const dimensionBtn =
    size === sizesEnum.small
      ? small.btn
      : size === sizesEnum.big
        ? big.btn
        : null;
  const dimensionText =
    size === sizesEnum.small
      ? small.text
      : size === sizesEnum.big
        ? big.text
        : null;

  return (
    <TouchableOpacity
      style={[
        styles.btnFullColored,
        styles.btnBase,
        { backgroundColor: colorBg },
        dimensionBtn,
        isDisabled && styles.btnDisabled,
      ]}
      onPress={handleBtn}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={loaderColor} />
      ) : (
        <>
          {iconLeft && iconLeft}
          <Text
            style={[
              {
                color: colorText,
              },
              dimensionText,
            ]}
          >
            {text}
          </Text>
          {iconRight && iconRight}
        </>
      )}
    </TouchableOpacity>
  );
}

// ─── ButtonBorderColored ─────────────────────────────────────────────────────────

interface ButtonBorderColoredProps {
  text: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  handleBtn: () => Promise<void> | void;
  isDisabled?: boolean;
  loading?: boolean;
  loaderColor?: string;
  size?: sizesEnum;
  isColored?: boolean;
  isActive?: boolean;
}

export function ButtonBorderColored({
  text,
  iconLeft,
  iconRight,
  handleBtn,
  isDisabled,
  loading,
  loaderColor = "#E8601A",
  size = sizesEnum.big,
  isColored = false,
  isActive = false,
}: ButtonBorderColoredProps) {
  const color = isActive || !isColored ? "#fff" : colors.primaryGradientMid;
  const dimensionBtn =
    size === sizesEnum.small
      ? small.btn
      : size === sizesEnum.medium
        ? medium.btn
        : size === sizesEnum.big
          ? big.btn
          : null;
  const dimensionText =
    size === sizesEnum.small
      ? small.text
      : size === sizesEnum.medium
        ? medium.text
        : size === sizesEnum.big
          ? big.text
          : null;

  return (
    <TouchableOpacity
      style={[
        styles.btnBorderColored,
        styles.btnBase,
        isDisabled && styles.btnDisabled,
        dimensionBtn,
        {
          borderColor: color,
          backgroundColor: isActive ? colors.primary : "transparent",
          borderWidth: size === sizesEnum.big ? 2 : 1,
        },
      ]}
      onPress={handleBtn}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={loaderColor} />
      ) : (
        <>
          {iconLeft && iconLeft}
          <Text style={[dimensionText, { color: color }]}>{text}</Text>
          {iconRight && iconRight}
        </>
      )}
    </TouchableOpacity>
  );
}

// ─── ButtonLink ──────────────────────────────────────────────────────────────

interface ButtonLinkProps {
  text: string;
  icon?: React.ReactNode;
  handleBtn: () => Promise<void> | void;
  fontSize?: number;
  isBold?: boolean;
  style?: StyleProp<ViewStyle>;
  isColored?: boolean;
  color?: string;
}

export function ButtonLink({
  text,
  icon,
  handleBtn,
  fontSize,
  isBold,
  isColored = false,
  style,
  color,
}: ButtonLinkProps) {
  const styleText = color
    ? color
    : !isColored
      ? "#fff"
      : colors.primaryGradientMid;

  return (
    <TouchableOpacity style={[styles.linkBtn, style]} onPress={handleBtn}>
      {icon && icon}
      <Text
        style={[
          fontSize ? { fontSize } : undefined,
          isBold && { fontWeight: "700" },
          { color: styleText },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

// ─── ButtonIcon ──────────────────────────────────────────────────────────────

interface ButtonIconProps {
  icon: React.ReactNode;
  handleBtn: () => Promise<void> | void;
  isDisabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  loaderColor?: string;
  hitSlop?: Insets;
}

export function ButtonIcon({
  icon,
  handleBtn,
  isDisabled,
  loading,
  style,
  loaderColor = "#E8601A",
  hitSlop,
}: ButtonIconProps) {
  const defaultHitSlop: Insets = { top: 8, bottom: 8, left: 8, right: 8 };
  return (
    <TouchableOpacity
      style={[styles.iconBtn, style, isDisabled && styles.btnDisabled]}
      onPress={handleBtn}
      disabled={isDisabled}
      activeOpacity={0.7}
      hitSlop={hitSlop ?? defaultHitSlop}
    >
      {loading ? <ActivityIndicator color={loaderColor} /> : icon}
    </TouchableOpacity>
  );
}

// ─── ButtonAccept ───────────────────────────────────────────────────────────

interface ButtonAcceptProps {
  text: string;
  handleBtn: () => Promise<void> | void;
  loading?: boolean;
  loaderColor?: string;
}

export function ButtonAccept({
  text,
  handleBtn,
  loading,
  loaderColor,
}: ButtonAcceptProps) {
  return (
    <TouchableOpacity
      style={styles.btnAccept}
      onPress={handleBtn}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={loaderColor} />
      ) : (
        <Text style={styles.textAccept}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── ButtonReject ───────────────────────────────────────────────────────────

interface ButtonRejectProps {
  text: string;
  handleBtn: () => Promise<void> | void;
  loading?: boolean;
  loaderColor?: string;
}

export function ButtonReject({
  text,
  handleBtn,
  loading,
  loaderColor,
}: ButtonRejectProps) {
  return (
    <TouchableOpacity
      style={styles.btnReject}
      onPress={handleBtn}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={loaderColor} />
      ) : (
        <Text style={styles.textReject}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── ButtonGeneric ───────────────────────────────────────────────────────────

interface ButtonGenericProps {
  handleBtn: () => Promise<void> | void;
  children?: React.ReactNode;
  loading?: boolean;
  loaderColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function ButtonGeneric({
  handleBtn,
  children,
  loading,
  loaderColor,
  style,
}: ButtonGenericProps) {
  return (
    <TouchableOpacity onPress={handleBtn} activeOpacity={0.85} style={style}>
      {loading ? <ActivityIndicator color={loaderColor} /> : <>{children}</>}
    </TouchableOpacity>
  );
}

// ─── ButtonGradient ───────────────────────────────────────────────────────────

interface ButtonGradientProps {
  handleBtn: () => Promise<void> | void;
  children?: React.ReactNode;
  loading?: boolean;
  loaderColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function ButtonGradient({
  handleBtn,
  children,
  loading,
  loaderColor,
  style,
}: ButtonGradientProps) {
  return (
    <TouchableOpacity onPress={handleBtn} activeOpacity={0.85}>
      <LinearGradient colors={colorGradient} style={style}>
        {loading ? <ActivityIndicator color={loaderColor} /> : <>{children}</>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── ButtonBack ───────────────────────────────────────────────────────────

interface ButtonBackProps {
  handleBtn: () => Promise<void> | void;
  isArrowBack?: boolean;
}

export function ButtonBack({ handleBtn, isArrowBack = true }: ButtonBackProps) {
  return (
    <TouchableOpacity
      onPress={handleBtn}
      style={[
        styles.backBtn,
        { backgroundColor: isArrowBack ? "rgba(0,0,0,0.15)" : "transparent" },
      ]}
      activeOpacity={0.85}
    >
      <Ionicons
        name={isArrowBack ? "arrow-back" : "chevron-back"}
        size={isArrowBack ? 22 : 24}
        color={isArrowBack ? "#fff" : "000"}
      />
    </TouchableOpacity>
  );
}

// ─── ButtonSelectable ───────────────────────────────────────────────────────────

interface ButtonSelectableProps {
  handleBtn: () => Promise<void> | void;
  isSelected?: boolean;
  text: string;
}

export function ButtonSelectable({
  handleBtn,
  isSelected = false,
  text,
}: ButtonSelectableProps) {
  return (
    <TouchableOpacity
      onPress={handleBtn}
      style={[styles.btnSelected, isSelected && styles.btnSelectedActive]}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.btnSelectedText,
          isSelected && styles.btnSelectedTextActive,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
