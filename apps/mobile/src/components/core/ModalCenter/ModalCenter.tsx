import React from "react";
import { Modal, View, Text } from "react-native";
import { tds } from "./ModalCenter.styled";
import { ButtonLink } from "../Button/Button";

export const ModalCenter = ({
  visible,
  onClose,
  children,
  handleBtnCancel,
  handleBtnApprove,
  title,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  handleBtnCancel?: () => void;
  handleBtnApprove?: () => void;
  title?: string;
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={tds.modalOverlay}>
        <View style={tds.modalCard}>
          <Text style={tds.modalTitle}>{title}</Text>
          {children}
          <View style={tds.modalActions}>
            {handleBtnCancel && (
              <ButtonLink
                style={[tds.modalCancelBtn]}
                text="Annulla"
                handleBtn={handleBtnCancel}
              />
            )}
            {handleBtnApprove && (
              <ButtonLink
                style={tds.modalRemoveBtn}
                text="Rimuovi"
                handleBtn={handleBtnApprove}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
