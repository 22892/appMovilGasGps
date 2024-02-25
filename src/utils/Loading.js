import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Overlay } from '@rneui/themed';

export default function Loading(props) {
  const { isVisible, text, color } = props;
  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor="rgba(241,241,241,.7)"
      overlayBackgroundColor="transparent"
      overlayStyle={{
        height: 100,
        width: 300,
        backgroundColor: '#fff',
        borderColor: color,

        borderRadius: 10,
      }}
      close>
      <View style={styles.view}>
        <ActivityIndicator size="large" color={color} />
        {text && <Text style={{
          color: color,
          textTransform: 'uppercase',
          marginTop: 10,
          fontFamily: 'Poppins-Light',
        }}>{text}</Text>}
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: 100,
    width: 200,
    backgroundColor: '#fff',
    borderColor: '#1b4f94',

    borderRadius: 10,
  },
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#1b4f94',
    textTransform: 'uppercase',
    marginTop: 10,
    fontFamily: 'Metropolis-Bold',
  },
});
