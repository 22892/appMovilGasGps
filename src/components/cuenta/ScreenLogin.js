import React,{ useEffect,useRef, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    StatusBar
  } from 'react-native';
import NavigationDrawer from '../../navigation/NavigationDrawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';


  var { height, width } = Dimensions.get('window');
  const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
  };

  const porcentajeHeigt = (por) => {
    return (height * por) / 100;
  };

function ScreenLogin(props) {

  const { primerColor, segundoColor, tipoUsuario } = props.route.params
  const screenHeight = Dimensions.get('screen').height;
  const [logeoPersonaConductor, setlogeoPersonaConductor] = useState(false)
  const [logeoPersonaCliente, setlogeoPersonaCliente] = useState(false)
  const [datosPersona, setdatosPersona] = useState(undefined)
  const [datosRecuperados, setDatosRecuperados] = useState(false);

 

  useFocusEffect(
    React.useCallback(() => {
      console.log("recibo tipo usuriao--");
      console.log(tipoUsuario);
  
      if (tipoUsuario === 1) {
        setlogeoPersonaCliente(true);
      }
  
      if (tipoUsuario === 2 && !datosRecuperados) {
        setlogeoPersonaConductor(true)
        obtenerDatosPersona();
        setDatosRecuperados(true);
      }
    }, [tipoUsuario, datosRecuperados])
  );


  const obtenerDatosPersona = () =>{

    try {
      AsyncStorage.getItem('persona').then((data) => {
        if (data != null) {
          const login = JSON.parse(data);
          console.log(login)
          setdatosPersona(login)
        
        }
      });
    } catch (error) {
     
      console.log('erro recuepera user')
      console.log(error)
    }


  }


    return (
        

        <ImageBackground source={require('../../assets/imagenes/fondoScream.jpg')} style={{flex: 1, width:'100%', height:screenHeight,position:'absolute',top:0,alignItems: 'center'}}>
            <StatusBar translucent backgroundColor="transparent" />


            {logeoPersonaConductor == true ? (

              <View style={{width:'80%',backgroundColor:'#80808080',marginTop:porcentajeHeigt(5),borderRadius:20,paddingVertical:'20%', borderRadius: 40}}>
   
                <View style={{ width: '95%', alignItems: 'center' }}>
                  <FastImage
                    source={require('../../assets/imagenes/logo.png')}
                    style={{ width: porcentaje(70), height: porcentaje(20) }}
                    resizeMode="contain"
                  />
                </View>

                <View style={{ width: '100%', textAlign: 'center', alignItems: 'center', marginTop: '8%' }}>
                  <Text style={{ color: primerColor, fontSize: 40, fontWeight: '900' }}>RAPIGAS</Text>
                </View>

                <View style={{ width: '100%', textAlign: 'center', alignItems: 'center'}}>
                  <Text style={{ color: primerColor, fontSize: 25 }}>DELIVERY GAS</Text>
                </View>
              </View>

            ):(

              <TouchableOpacity 
                onPress={() =>props.navigation.navigate("Solicitar")}
                style={{width:'80%',backgroundColor:'white',marginTop:porcentajeHeigt(40),borderRadius:20,paddingVertical:'4%'}}>
                    <Text style={{ color:'black', fontSize: 14,fontFamily:'Poppins-Light',width:'100%',textAlign:'center'}}>Solicita tu Gas</Text>
              </TouchableOpacity>

          
            )}


            {logeoPersonaConductor == true ? (

               <View style={{width:'80%',marginTop:porcentajeHeigt(15)}}>
                <Text style={{ color:'white', fontSize: 18,fontFamily:'Poppins-SemiBold',width:'100%',textAlign:'center'}}>BIENVENIDO</Text>
                <Text style={{ color:'white', fontSize: 20,fontFamily:'Poppins-SemiBold',width:'100%',textAlign:'center'}}>JOSE ALVAREZ</Text>

              </View>

            ):(

              <TouchableOpacity 
                onPress={() =>props.navigation.navigate("Registro")}
                style={{width:'80%',backgroundColor:'white',marginTop:porcentajeHeigt(5),borderRadius:20,paddingVertical:'4%'}}>
                    <Text style={{ color:'black', fontSize: 14,fontFamily:'Poppins-Light',width:'100%',textAlign:'center'}}>Registrate Para más Beneficios</Text>
              </TouchableOpacity>

              )}


            {logeoPersonaConductor == true ? (

              <TouchableOpacity 
                onPress={() =>props.navigation.navigate("ListadoEventos",{dataPerson: datosPersona.persona})}
                style={{width:'80%',marginTop:porcentajeHeigt(5)}}>
                <Text style={{ color:primerColor, fontSize: 14,fontFamily:'Poppins-SemiBold',width:'100%',textAlign:'center'}}>VER PEDIDOS CONDUCTOR</Text>
              </TouchableOpacity>

            ):(
              <TouchableOpacity 
                onPress={() =>props.navigation.navigate("Login")}
                style={{width:'80%',marginTop:porcentajeHeigt(5)}}>
                <Text style={{ color:'white', fontSize: 14,fontFamily:'Poppins-SemiBold',width:'100%',textAlign:'center'}}>INICIAR SESIÓN CONDUCTOR</Text>
              </TouchableOpacity>

            )}


            <View style={{width:'80%',bottom:porcentajeHeigt(12),position:'absolute'}}>
                <Text style={{ color:'white', fontSize: 10,fontFamily:'Poppins-Light',width:'100%',textAlign:'center'}}>Al iniciar sesión, acepta terminos y politicas de privacidad</Text>
            </View>
            
        </ImageBackground>
        
    )

}

export default ScreenLogin;
