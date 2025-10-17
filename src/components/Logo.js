import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

export default function Logo() {



  return (<View style={{ alignItems: 'center' }} >



    <Image source={require('../assets/stl_logo.png')} style={styles.image} />
  </View>)
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    borderRadius: 100,

  },
})