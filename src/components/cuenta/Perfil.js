import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';

var { height, width } = Dimensions.get('window');

const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
};

const porcentajeHeigt = (por) => {
    return (height * por) / 100;
};


function Perfil(props) {

  const {primerColor, segundoColor} = props.route.params

  const iniciarSession = () =>{

  }

  return(
    <SafeAreaView style={{ backgroundColor: 'white', height: '100%', width: '100%'}}>

      <View style={{ backgroundColor: primerColor, justifyContent: 'center', alignItems: 'center', height: porcentajeHeigt(27), borderBottomEndRadius: 20, borderBottomStartRadius: 20 }}>

        <View style={{ flexDirection: 'row', height: porcentaje(15), marginTop: '10%' }}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 40 }}> BIENVENIDO</Text>
        </View>

        <TouchableOpacity
          onPress={() => iniciarSession()}
          style={{ width: '80%', backgroundColor: segundoColor, marginTop: '4%', borderRadius: 20, paddingVertical: '4%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Poppins-Light', textAlign: 'center' }}>INICIAR SESIÓN</Text>
        </TouchableOpacity>

      </View>

      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>

        <TouchableOpacity
            onPress={() => iniciarSession()}
            style={{ width: '85%', backgroundColor: primerColor, marginTop: '4%', borderRadius: 20, paddingVertical: '4%', justifyContent: 'center', alignItems: 'center', marginBottom: '5%' }}>
            <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Poppins-Light', textAlign: 'center' }}>SOLICITAR GAS</Text>
        </TouchableOpacity>

        <View style={{height: porcentajeHeigt(7), backgroundColor: primerColor, width: '100%'}}>
          <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>Registrate para más </Text>
          <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>beneficios</Text>
        </View>

      </View>

    </SafeAreaView>
  )
}

export default Perfil