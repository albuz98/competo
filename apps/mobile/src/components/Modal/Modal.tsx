import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Modal,
  Animated,
  PanResponder,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styles } from "./Modal.styled";

interface ModalViewerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  withKeyboardAvoid?: boolean;
  paddingTop?: number;
  paddingHorizontal?: number;
  paddingBottom?: number;
}

export interface ModalViewerRef {
  dismiss: () => void;
}

export const ModalViewer = forwardRef<ModalViewerRef, ModalViewerProps>(
  (
    {
      isOpen,
      onClose,
      children,
      withKeyboardAvoid = true,
      paddingTop = 24,
      paddingHorizontal = 24,
      paddingBottom = 40,
    },
    ref,
  ) => {
    const panY = useRef(new Animated.Value(600)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const dismissModal = () => {
      Animated.parallel([
        Animated.timing(panY, {
          toValue: 600,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose();
        panY.setValue(600);
        overlayOpacity.setValue(0);
      });
    };

    const modalPanResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, { dy }) => {
          if (dy > 0) panY.setValue(dy);
        },
        onPanResponderRelease: (_, { dy, vy }) => {
          if (dy > 60 || vy > 0.5) {
            dismissModal();
          } else {
            Animated.spring(panY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    ).current;

    useImperativeHandle(ref, () => ({ dismiss: dismissModal }));

    // Trigger animation quando isOpen cambia
    useEffect(() => {
      if (isOpen) {
        panY.setValue(600);
        overlayOpacity.setValue(0);
        Animated.parallel([
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 2,
          }),
          Animated.timing(overlayOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [isOpen, panY, overlayOpacity]);

    const animatedCard = (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateY: panY }],
            paddingTop,
            paddingHorizontal,
            paddingBottom,
          },
        ]}
        {...modalPanResponder.panHandlers}
      >
        <View style={styles.dragZone}>
          <View style={styles.modalHandle} />
        </View>
        {children}
      </Animated.View>
    );

    const content = withKeyboardAvoid ? (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View
          style={[styles.overlayBackground, { opacity: overlayOpacity }]}
          onTouchEnd={dismissModal}
        />
        {animatedCard}
      </KeyboardAvoidingView>
    ) : (
      <View style={styles.container}>
        <Animated.View
          style={[styles.overlayBackground, { opacity: overlayOpacity }]}
          onTouchEnd={dismissModal}
        />
        {animatedCard}
      </View>
    );

    return (
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={dismissModal}
      >
        {content}
      </Modal>
    );
  },
);
