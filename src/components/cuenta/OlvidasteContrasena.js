import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { Input } from '@rneui/themed'
//import { recuperarPassApi, tokenPrestaShop } from '../config/rest_config';
import Loading from '../../utils/Loading';



var { height, width } = Dimensions.get('window');
const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
};

const porcentajeHeigt = (por) => {
    return (height * por) / 100;
};

function OlvidasteContrasena(props) {

    const [createmsjError, setcreatemsjError] = useState("");
    const [showMjs, setshowMjs] = useState(false);
    const [isVisibleLoading, setisVisibleLoading] = useState(false);

    const { primerColor, segundoColor } = props.route.params
    const [erroCorreo, seterroCorreo] = useState("");
    const [colorErro, setcolorErro] = useState("#b1fec8");
    const [login, setlogin] = useState({
        correo: "",

    });

    const txtCorreo = useRef()




    useEffect(() => {






    }, []);

    const recuperarPass = () => {


    }

    const MsjRecuperacion = (flag) => {

        if (flag) {
            return (

                <View

                    style={{ width: '80%', backgroundColor: colorErro, marginTop: '10%', paddingVertical: '2%' }}>
                    <Text style={{ color: "black", fontSize: 10, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>{createmsjError}</Text>
                </View>
            )

        }

    }

    const Validatoremail = (value) => {
        let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        let email = value;

        if (regex.test(email)) {

            return true;
        } else {
            return false;
        }
    };

    return (

        <SafeAreaView style={{ backgroundColor: 'white', height: '100%', width: '100%', alignItems: 'center' }}>
            <Loading text="Recuperando Contraseña" isVisible={isVisibleLoading} color={segundoColor} />

            <ScrollView style={{ width: '100%' }}>

                <View style={{ width: '100%', alignItems: 'center' }}>


                    <View style={{ width: '90%', marginTop: '5%', alignItems: 'center' }}>
                        <Text style={{ color: "black", fontSize: 12, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>Por favor, introduzca la dirección de correo electrónico que utilizó para registrarse. Recibirá un enlace temporal para restablecer su contraseña.</Text>
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




                    {MsjRecuperacion(showMjs)}


                    <TouchableOpacity
                        onPress={() => recuperarPass()}
                        style={{ width: '80%', backgroundColor: primerColor, marginTop: '40%', borderRadius: 20, paddingVertical: '4%' }}>
                        <Text style={{ color: segundoColor, fontSize: 14, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>Restablecer Contraseña</Text>
                    </TouchableOpacity>



                </View>


            </ScrollView>
        </SafeAreaView>

    )

}

export default OlvidasteContrasena;

const styles = StyleSheet.create({

    formInput: {
        // width:'90%',
        borderBottomWidth: 1,
        borderColor: '#F0F0F0',
        height: 25,
        backgroundColor: 'white',
        borderRadius: 1,
        paddingLeft: 8,
        // shadowColor: "black",
        // shadowRadius: 2,
        // shadowOpacity: 0.7,
        // shadowOffset: {
        //   width: 2,
        //   height: 2
        // },
        // elevation: 3,
    },


})

