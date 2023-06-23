import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, Image, Pressable } from 'react-native';
import Constants from 'expo-constants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Extrapolate,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const Pulse = ({ delay = 0, repeat }) => {
  const animation = useSharedValue(0);
  useEffect(() => {
    animation.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.linear,
        }),
        repeat ? -1 : 1,
        false
      )
    );
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      animation.value,
      [0, 1],
      [0.6, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity: opacity,
      transform: [{ scale: animation.value }],
    };
  });
  return <Animated.View style={[styles.circle, animatedStyles]} />;
};
export default function PulseAnimation() {
  const [pulse, setPulse] = useState([1]);
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Pressable
          style={styles.innerCircle}
          onPress={() => {
            setPulse((prev) => [...prev, Math.random()]);
          }}>
          <View
          style={{width:80,height:80,backgroundColor:'#3742fa',borderRadius:80,
    zIndex: 100,}}
          />
        </Pressable>
        {pulse.map((item, index) => (
          <Pulse repeat={index === 0} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight ,
    backgroundColor: 'white',
    padding: 8,
    opacity:0.8
  },
  circle: {
    width: 300,
    borderRadius: 150,
    height: 300,
    position: 'absolute',
    borderColor: '#3742fa',
    borderWidth: 4,
    backgroundColor: '#3742fa',
  },
  innerCircle: {
    width: 80,
    borderRadius: 40,
    height: 80,
    zIndex: 100,
    position: 'absolute',
    backgroundColor: 'white',
  },
});
