import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
interface GradientButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}
const GradientButton: React.FC<GradientButtonProps> = ({ title, onPress, style }) => {
  return (
    <View  style={[styles.shadow ]} >
      <TouchableOpacity onPress={onPress} >
        <LinearGradient
          colors={['#1158D8', '#07285E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.text}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 20, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 10, // for Android shadow
    borderRadius: 20,
    // backgroundColor: '#000',
  },
});


export default GradientButton;