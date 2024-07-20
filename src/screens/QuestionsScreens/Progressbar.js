import {StyleSheet, View, Text, Dimensions} from 'react-native';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import colors from '../../config/color.json';
import React from 'react';
import {HEIGHT, NotoSans_Medium} from '../../config/AppConst';

const Progressbar = ({progress, selectedComponent, selectedOption}) => {
  const barWidth = Dimensions.get('screen').width - 27;
  const barHeight = HEIGHT(4);
  const progressCustomStyles = {
    backgroundColor: colors.AuroraGreen,
    borderRadius: 16,
    borderColor: '#E6E6E6',
  };

  return (
    <View style={{marginTop: HEIGHT(2)}}>
      <View style={progress ? styles.ProgressbarClrChange : styles.Progressbar}>
        <ProgressBarAnimated
          width={barWidth}
          height={barHeight}
          color={selectedOption === 0.2 ? '#E6E6E6' : colors.AuroraGreen}
          {...progressCustomStyles}
          value={progress}
          backgroundColorOnComplete={colors.AuroraGreen}
        />
        <Text
          style={{
            position: 'absolute',
            end: 12,
            fontSize: 16,
            fontFamily: NotoSans_Medium,
            color: colors.Black,
          }}>
          {selectedComponent}/5
        </Text>
      </View>
    </View>
  );
};

export default Progressbar;

const styles = StyleSheet.create({
  Progressbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    borderColor: '#E6E6E6',
    height: HEIGHT(4),
    borderRadius: 16,
  },

  ProgressbarClrChange: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    borderColor: '#E6E6E6',
    height: HEIGHT(4),
    borderRadius: 16,
  },
});
