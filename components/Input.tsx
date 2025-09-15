import { StyleSheet, TextInput } from "react-native";

type InputProps = {
  inputAccessoryViewID: string;
  placeHolder: string;
  secureTextEntry?: boolean;
  textContentType?: string;
  value?: string;
  setText?: (text: string) => void;
  customStyle?: object;
  canEdit?: boolean;
};
const Input: React.FC<InputProps> = ({
  inputAccessoryViewID,
  placeHolder,
  secureTextEntry,
  value,
  setText,
  customStyle,
  canEdit,
}) => {

  return (
    <TextInput
      style={[
        styles.textInput,
        customStyle,
        !canEdit && { backgroundColor: "#dbdbdb" },
      ]}
      inputAccessoryViewID={inputAccessoryViewID}
      onChangeText={setText}
      value={value ?? ""}
      placeholder={placeHolder}
      secureTextEntry={secureTextEntry}
      editable={canEdit}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    padding: 3,
    minHeight: 5,
    minWidth: 5,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "gray",
    color: "white",
    fontFamily: "PressStart2P",
    boxShadow: '#464646ff 0px 6px 3px',
    backgroundColor: '#5555557e'
  },
});

export default Input;
