import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
interface loadingProps {
    size?: number;
}

const Loading: React.FC<loadingProps> = ({size}) => {
  return (
    <View style={{height: size, aspectRatio:1 }}>
        <LottieView style={{flex: 1}} source={require('../assets/animations/Loading animation blue.json')} autoPlay loop/>

    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})