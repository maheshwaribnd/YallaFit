import { View, Animated, Dimensions } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { HEIGHT } from '../config/AppConst';

const Paginator = ({ data, scrollX }) => {
    const { width: screenWidth } = Dimensions.get('window');
    return (
        <View style={styles.container}>
            {data.map((_, i) => {
                const inputRange = [
                    (i - 1) * screenWidth,
                    i * screenWidth,
                    (i + 1) * screenWidth,
                ];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 10, 10],
                    extrapolate: 'clamp',
                });

                const dotHight = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 10, 10],
                    extrapolate: 'clamp',
                });

                const backgroundColor = scrollX.interpolate({
                    inputRange,
                    outputRange: ['#B0B0B0', '#51E3B7', '#B0B0B0'],
                    extrapolate: 'clamp',
                });

                // const opacity = scrollX.interpolate({
                //   outputRange: [0.3, 1, 0.3],
                //   extrapolate: 'clamp',
                // });

                return (
                    <Animated.View
                        style={[styles.dot, { width: dotWidth, height: dotHight, backgroundColor }]}
                        key={i.toString()}
                    />
                );
            })}
        </View>
    );
};

export default Paginator;

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: HEIGHT(2)
    },

    dot: {
        // width: 10,
        height: 7,
        borderRadius: 5,
        backgroundColor: 'gray',
        marginHorizontal: 5
    },
});