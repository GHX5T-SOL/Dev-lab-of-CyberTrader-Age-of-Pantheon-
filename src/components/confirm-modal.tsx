import { Modal, Pressable, View } from "react-native";
import CyberText from "@/components/cyber-text";
import { terminalColors } from "@/theme/terminal";

interface ConfirmModalProps {
  visible: boolean;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  visible,
  message,
  confirmLabel = "CONFIRM",
  cancelLabel = "CANCEL",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: terminalColors.modalBackdrop,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 300,
            borderWidth: 1,
            borderColor: terminalColors.cyan,
            backgroundColor: terminalColors.panel,
            padding: 20,
          }}
        >
          <CyberText size={14} style={{ marginBottom: 16, lineHeight: 20 }}>
            {message}
          </CyberText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Pressable onPress={onConfirm}>
              <CyberText tone="green" size={14}>
                [Y] {confirmLabel}
              </CyberText>
            </Pressable>
            <CyberText size={14} style={{ color: terminalColors.border }}>
              |
            </CyberText>
            <Pressable onPress={onCancel}>
              <CyberText tone="red" size={14}>
                [N] {cancelLabel}
              </CyberText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export { ConfirmModal };
