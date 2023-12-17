import React, { useEffect, useRef, useState, useContext } from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
    TextInput
} from 'react-native';
import { Input } from '@rneui/themed';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../../utils/context';
import Loading from '../../utils/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';


var { height, width } = Dimensions.get('window');

const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
};

const porcentajeHeigt = (por) => {
    return (height * por) / 100;
};


function Login(props){

    const {navigation} = props
    const { primerColor, segundoColor } = props.route.params
   
    const [isVisibleLoading, setisVisibleLoading] = useState(false);
    const [isValidacionCedula, setisValidacionCedula] = useState(false);
    const [isValidacionContrasena, setisValidacionContrasena] = useState(false);
    const [mensajeError, setmensajeError] = useState("");
    
    const [loginErrorSession, setloginErrorSession] = useState(false);

    const txtRefCedula = useRef()
    const txtRefContrasena = useRef()
    const [login, setlogin] = useState({
        cedula: "",
        contrasena: "",
        tipoPersona: 2
    });
   
    const [showPassword, setShowPassword] = useState(false);

    

    const loginPress = async () => {

       

        setisVisibleLoading(true)

        if (login.cedula == "" || login.cedula.length < 10) {
            setisVisibleLoading(false)
            setmensajeError("Cédula Incorecta")
            setloginErrorSession(true)
        }else if(login.contrasena == "" || login.contrasena.length < 6){
            setisVisibleLoading(false)
            setmensajeError("Contraseña Minimo 6 caracteres")
            setloginErrorSession(true)
        }else{

            try {
                console.log("lllegagagga")
                setloginErrorSession(false)
                await AsyncStorage.setItem('persona', JSON.stringify({
                  persona: login,
                }));
                setisVisibleLoading(false)
                navigation.navigate('ListadoEventos',{dataPerson: login})

              } catch (error) {
                setmensajeError("Usuario o Contraseña Incorrectos!!!")
                setloginErrorSession(true)
                // Hubo un error al intentar almacenar los datos
                console.error("Error al almacenar en AsyncStorage:", error);
              }
          

        }

    }

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };


    
    const loginError = (flag) => {

      if (flag) {
          return (

              <View

                  style={{ width: '80%', backgroundColor: "#ECDDDE", marginTop: '10%', paddingVertical: '2%' }}>
                  <Text style={{ color: "red", fontSize: 14, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>{mensajeError}</Text>
              </View>
          )

      }
    }




    return(

        <SafeAreaView style={{ backgroundColor: segundoColor, flex: 1 }}>
            <Loading text="Iniciando Sessión" isVisible={isVisibleLoading} color={segundoColor} />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={{ flex: 1, alignItems: 'center' }}
                >

                    <View style={{ width: '95%', marginTop: '23%', alignItems: 'center' }}>
                    <FastImage
                        source={require('../../assets/imagenes/logo.png')}
                        style={{ width: porcentaje(70), height: porcentaje(20) }}
                        resizeMode="contain"
                    />
                    </View>

                    <View style={{ width: '100%', textAlign: 'center', alignItems: 'center', marginTop: '8%' }}>
                    <Text style={{ color: primerColor, fontSize: 40, fontWeight: '900' }}>RAPIGAS</Text>
                    </View>

                    <View>
                    <Text style={{ color: primerColor, fontSize: 25 }}>DELIVERY GAS</Text>
                    </View>

                </KeyboardAvoidingView>
                </View>

              
               <View style={{height: porcentajeHeigt(40)}}>

                
                    {/* primer viwe*/ }
                    <View style={{ backgroundColor: primerColor, top: porcentajeHeigt(20), justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: porcentajeHeigt(25), overflow: 'hidden' }}>
                    
                
                    
                    </View>

                    {/* segundo  viwe*/ }
                    <View style={{backgroundColor: 'white', height: porcentajeHeigt(35), position: 'absolute', top: 0, left: '10%', right: '10%', borderRadius: 20}}>
                        
                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>


                            <View style={{ width: '90%', marginTop: '10%', flexDirection: 'row', alignItems: 'center'}}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={value => {
                                        setlogin((login) => {
                                            return { ...login, cedula: value };
                                        });
                                    }}
                                    placeholder="Cédula"
                                    placeholderTextColor= "#9C9C9C"
                                    borderColor="white"
                                    borderRadius={30}
                                    keyboardType="numeric"
                                    ref={txtRefCedula}
                                />
                                
                            </View>

                            <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', }}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={value => {
                                        setlogin((login) => {
                                            return { ...login, contrasena: value };
                                        });
                                    }}
                                    placeholder="Contraseña"
                                    placeholderTextColor= "#9C9C9C"
                                    borderColor="white"
                                    borderRadius={30}
                                    ref={txtRefContrasena}
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={handleTogglePasswordVisibility}
                                    style={{ position: 'absolute', right: '13%' }} // Ajusta según tus necesidades
                                >
                                    <FontAwesome5 name={showPassword ? 'eye' : 'eye-slash'} size={25} color="#D8D8D8" />
                                </TouchableOpacity>
                                
                            </View>


                            <TouchableOpacity
                                onPress={() => loginPress()}
                                style={{ width: '80%', backgroundColor: primerColor, marginTop: '8%', borderRadius: 20, paddingVertical: '4%' }}>
                                <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>LOGIN</Text>
                            </TouchableOpacity>

                            {loginError(loginErrorSession)}

                        </View>


                    </View>



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
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#F0F0F0',
    width: '90%',
    color: 'black',
    fontSize: 12, 
    fontFamily: 'Poppins-Light',
   
   
},


})

