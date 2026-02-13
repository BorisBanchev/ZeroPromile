import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

export const Input = (props: TextInputProps) => {
  return <TextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
