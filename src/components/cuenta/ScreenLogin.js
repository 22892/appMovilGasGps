import React,{ useEffect,useRef } from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    StatusBar
  } from 'react-native';
import NavigationDrawer from '../../navigation/NavigationDrawer';


  var { height, width } = Dimensions.get('window');
  const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
  };

  const porcentajeHeigt = (por) => {
    return (height * por) / 100;
  };

function ScreenLogin(props) {

  
    const screenHeight = Dimensions.get('screen').height;

    useEffect(() => {

     
 

    }, []);


    return (
        

        <ImageBackground source={require('../../assets/imagenes/fondoScream.jpg')} style={{flex: 1, width:'100%', height:screenHeight,position:'absolute',top:0,alignItems: 'center'}}>
            <StatusBar translucent backgroundColor="transparent" />

            <TouchableOpacity 
                onPress={() =>props.navigation.navigate("Solicitar")}
                style={{width:'80%',backgroundColor:'white',marginTop:porcentajeHeigt(40),borderRadius:20,paddingVertical:'4%'}}>
                    <Text style={{ color:'black', fontSize: 14,fontFamily:'Poppins-Light',width:'100%',textAlign:'center'}}>Solicita tu Gas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() =>props.navigation.navigate("Registro")}
                style={{width:'80%',backgroundColor:'white',marginTop:porcentajeHeigt(5),borderRadius:20,paddingVertical:'4%'}}>
                    <Text style={{ color:'black', fontSize: 14,fontFamily:'Poppins-Light',width:'100%',textAlign:'center'}}>Registrate Para más Beneficios</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() =>props.navigation.navigate("Login")}
                style={{width:'80%',marginTop:porcentajeHeigt(5)}}>
                <Text style={{ color:'white', fontSize: 14,fontFamily:'Poppins-SemiBold',width:'100%',textAlign:'center'}}>Iniciar Sessión</Text>
            </TouchableOpacity>

            

            <View style={{width:'80%',bottom:porcentajeHeigt(12),position:'absolute'}}>
                <Text style={{ color:'white', fontSize: 10,fontFamily:'Poppins-Light',width:'100%',textAlign:'center'}}>Al iniciar sesión, acepta terminos y politicas de privacidad</Text>
            </View>




            
        </ImageBackground>
        
    )

}

export default ScreenLogin;
