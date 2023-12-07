import React, { useEffect, useRef, useState } from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import { Input } from '@rneui/themed';
import FastImage from 'react-native-fast-image';

var { height, width } = Dimensions.get('window');

const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
};

const porcentajeHeigt = (por) => {
    return (height * por) / 100;
};


import Loading from '../../utils/Loading';


function Login(props){

    const {navigation} = props
    const { primerColor, segundoColor } = props.route.params
    const [login, setlogin] = useState({
        correo: "",
        contrasena: "",

    });
    const [isVisibleLoading, setisVisibleLoading] = useState(false);
    const [erroCorreo, seterroCorreo] = useState("");
    const [erroPass, seterroPass] = useState("");
    const [loginErrorSession, setloginErrorSession] = useState(false);
    const txtCorreo = useRef()
    const txtContrasena = useRef()


    const loginPress = () => {

        navigation.navigate('ListadoEventos')

    }

    
    const loginError = (flag) => {

      if (flag) {
          return (

              <View

                  style={{ width: '80%', backgroundColor: "#ECDDDE", marginTop: '10%', paddingVertical: '2%' }}>
                  <Text style={{ color: "red", fontSize: 14, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>Error de autenticación</Text>
              </View>
          )

      }
    }



    return(
      <SafeAreaView style={{ backgroundColor: 'white', height: '100%', width: '100%', alignItems: 'center' }}>
        <Loading text="Iniciando Sessión" isVisible={isVisibleLoading} color={segundoColor} />

        <ScrollView style={{ width: '100%' }}>

            <View style={{ width: '100%', alignItems: 'center' }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={{ flex: 1, alignContent: 'flex-start', justifyContent: 'flex-start', width: '100%', alignItems: 'center' }}
                >

                    <View style={{ width: '95%', marginTop: '15%', alignItems: 'center' }}>
                        <FastImage


                            source={require('../../assets/imagenes/logo.png')}
                            style={{ width: porcentaje(70), height: porcentaje(20) }}
                            resizeMode="contain"
                        />

                    </View>


                    <View style={{ width: '95%', marginTop: '20%', flexDirection: 'row', alignItems: 'center' }}>

                        <Input
                            placeholder={"Correo Electrónico"}
                            ref={txtCorreo}
                            keyboardType='email-address'

                            returnKeyType='next'
                            onSubmitEditing={() => {
                                txtContrasena.current.focus()
                            }}
                            onChangeText={value => {
                                setlogin((login) => {
                                    return { ...login, correo: value };
                                });
                            }}
                            blurOnSubmit={false}
                            inputStyle={{ fontSize: 12, fontFamily: 'Poppins-Light' }}
                            containerStyle={{ width: '100%', height: 25 }}
                            inputContainerStyle={styles.formInput}
                            errorStyle={{ fontSize: 10, fontFamily: 'Poppins-Light' }}
                            errorMessage={erroCorreo}
                        />
                    </View>

                    <View style={{ width: '95%', marginTop: '7%', flexDirection: 'row', alignItems: 'center' }}>

                        <Input
                            placeholder={"Contraseña"}
                            ref={txtContrasena}
                            keyboardType='default'
                            secureTextEntry={true}
                            returnKeyType='done'

                            onChangeText={value => {
                                setlogin((login) => {
                                    return { ...login, contrasena: value };
                                });
                            }}

                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                              }}
                            blurOnSubmit={false}
                            inputStyle={{ fontSize: 12, fontFamily: 'Poppins-Light' }}
                            containerStyle={{ width: '100%', height: 25 }}
                            inputContainerStyle={styles.formInput}
                            errorStyle={{ fontSize: 10, fontFamily: 'Poppins-Light' }}
                            errorMessage={erroPass}
                        />
                    </View>


                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("OlvidasteContrasena")}
                        style={{ width: '90%', marginTop: '5%', alignItems: 'center' }}>
                        <Text style={{ color: "#C4C4C4", fontSize: 12, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'left' }}>Olvidastes tu Contraseña ?</Text>
                    </TouchableOpacity>


                    {loginError(loginErrorSession)}

                    <TouchableOpacity
                        onPress={() => loginPress()}
                        style={{ width: '80%', backgroundColor: primerColor, marginTop: '20%', borderRadius: 20, paddingVertical: '4%' }}>
                        <Text style={{ color: segundoColor, fontSize: 14, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>Iniciar Sesión</Text>
                    </TouchableOpacity>

                </KeyboardAvoidingView>

            </View>
        </ScrollView>
      </SafeAreaView>

    )
}

export default Login

const styles = StyleSheet.create({

  formInput: {
      borderBottomWidth: 1,
      borderColor: '#F0F0F0',
      height: 25,
      backgroundColor: 'white',
      borderRadius: 1,
      paddingLeft: 8,
  },


})

