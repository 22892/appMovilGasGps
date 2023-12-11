import React, { useCallback, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';


var { height, width } = Dimensions.get('window');

const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
};

const porcentajeHeigt = (por) => {
    return (height * por) / 100;
};


function Perfil(props) {

  const {primerColor, segundoColor, regresaPerfil} = props.route.params
  const [txtNombre, setNombre] = useState("")
  const [txtApellido, setApellido] = useState("")
  const [txtUsuario, setUsuario] = useState("")


  const iniciarSession = () =>{

  }

  useEffect(() => {
      

  }, []); 

  useFocusEffect(() => {
    console.log('La pantalla se volvió a enfocar');
    // Puedes realizar acciones adicionales cuando la pantalla se vuelve a enfocar
    return () => {
      console.log('La pantalla se desenfocó');
      // Puedes realizar acciones adicionales cuando la pantalla se desenfoca
      regresaPerfil()
    };
  });

  const updateUser = () =>{
    
  }


  return(
    <SafeAreaView style={{ backgroundColor: '#E1E1E1', height: '100%', width: '100%'}}>

      <View style={{ backgroundColor: primerColor, justifyContent: 'center', alignItems: 'center', height: porcentajeHeigt(27), borderBottomEndRadius: 20, borderBottomStartRadius: 20 }}>

        <View style={{ width: '30%', alignItems: 'center', backgroundColor: 'white', padding: '5%', borderRadius: porcentaje(20) }}>
          <FastImage
            source={require('../../assets/imagenes/avatar.png')}
            style={{ width: porcentaje(70), height: porcentaje(20) }}
            resizeMode="contain"
          />
        </View>

      </View>

      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: '15%' }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setNombre}
                            value={txtNombre}
                            placeholder="Pedro Jose"
                            placeholderTextColor= {segundoColor}
                            borderColor="white"
                            borderRadius={30}
                        />
                        
        </View>

        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setApellido}
                            value={txtApellido}
                            placeholder="Alvarez Carpio"
                            placeholderTextColor= {segundoColor}
                            borderColor="white"
                            borderRadius={30}
                        />
                        
        </View>
       
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setUsuario}
                            value={txtUsuario}
                            placeholder="pedro123"
                            placeholderTextColor= {segundoColor}
                            borderColor="white"
                            borderRadius={30}
                        />
                        
        </View>

        <View style={{flex: 1, alignItems: 'center',justifyContent: 'flex-end', padding: 10}}>

          <TouchableOpacity
            onPress={() => updateUser()}
            style={{ width: '80%', backgroundColor: primerColor, borderRadius: 20, paddingVertical: '4%' }}>
            <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>Actualizar Datos</Text>
          </TouchableOpacity>

        </View>

      

    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  input: {
      height: 50,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      backgroundColor: 'white',
      width: '90%',
      color: 'black',
      fontSize: 12, 
      fontFamily: 'Poppins-Light'
     
  },
});

export default Perfil