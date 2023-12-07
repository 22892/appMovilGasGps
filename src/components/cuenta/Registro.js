import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput
} from 'react-native';
import { Input } from '@rneui/themed';
import Loading from '../../utils/Loading';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';



var { height, width } = Dimensions.get('window');
const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
};

const porcentajeHeigt = (por) => {
    return (height * por) / 100;
};
function Registro(props){

    const [txtNombre, setNombre] = useState("")
    const [txtApellido, setApellido] = useState("")
    const [txtUsuario, setUsuario] = useState("")
    const [txtPass, setPass] = useState("")
    const [txtRetryPass, setRetryPass] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showRetryPassword, setShowRetryPassword] = useState(false);

    
    const [createError, setcreateError] = useState(false);
    const [createmsjError, setcreatemsjError] = useState("");
    const { primerColor, segundoColor } = props.route.params
    const [isVisibleLoading, setisVisibleLoading] = useState(false);
    const [cliente, setCliente] = useState({
      cli_nombre: "",
      cli_apellido: "",
      cli_correo: "",
      cli_contrasena: "",
      cli_retry_contrasena: "",

    });


    const Validatoremail = (value) => {
      let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      let email = value;

      if (regex.test(email)) {

          return true;
      } else {
          return false;
      }
    };


    const createUser = () => {

      setisVisibleLoading(true)

      setTimeout(() => {
        setisVisibleLoading(false)

      }, 2000);


    }


    const CreateError = (flag) => {

      if (flag) {
          return (

              <View

                  style={{ width: '80%', backgroundColor: "#ECDDDE", marginTop: '10%', paddingVertical: '2%' }}>
                  <Text style={{ color: "red", fontSize: 10, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>{createmsjError}</Text>
              </View>
          )

      }

  }


    const handleRegistration = () => {
      // Lógica para manejar el registro
      console.log('Registrando:', { name, email, password });
      // Puedes agregar lógica adicional aquí, como realizar una llamada a la API para registrar al usuario
      
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleTogglePasswordVisibility2 = () => {
        setShowRetryPassword((prevShowPassword) => !prevShowPassword);
    };

    

    return(


        <SafeAreaView style={{ backgroundColor: '#F4F4F4', height: '100%', width: '100%'}}>

            <ScrollView>

                <Loading text="Creando Usuario" isVisible={isVisibleLoading} color={segundoColor} />

                <View style={{ backgroundColor: primerColor, justifyContent: 'center', alignItems: 'center', height: porcentajeHeigt(19), borderBottomEndRadius: 20, borderBottomStartRadius: 20 }}>

                    <View style={{ flexDirection: 'row', height: porcentaje(15), marginTop: '5%' }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 40 }}> BIENVENIDO</Text>
                    </View>

                    <View>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 40 }}> CREA TU CUENTA</Text>
                    </View>

                </View>

                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>


                    <View style={{ width: '90%', marginTop: '10%', flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setNombre}
                            value={txtNombre}
                            placeholder="Nombre"
                            placeholderTextColor= {segundoColor}
                            borderColor="white"
                            borderRadius={30}
                        />
                        
                    </View>

                    <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setApellido}
                            value={txtApellido}
                            placeholder="Apellido"
                            placeholderTextColor= {segundoColor}
                            borderColor="white"
                            borderRadius={30}
                        />
                        
                    </View>

                    <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setUsuario}
                            value={txtUsuario}
                            placeholder="Usuario"
                            placeholderTextColor= {segundoColor}
                            borderColor="white"
                            borderRadius={30}
                        />
                        
                    </View>

                    <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPass}
                            value={txtPass}
                            placeholder="Contraseña"
                            placeholderTextColor= {segundoColor}
                            borderColor="white"
                            borderRadius={30}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            onPress={handleTogglePasswordVisibility}
                            style={{ position: 'absolute', right: '13%' }} // Ajusta según tus necesidades
                        >
                            <FontAwesome5 name={showPassword ? 'eye' : 'eye-slash'} size={25} color="#D8D8D8" />
                        </TouchableOpacity>
                        
                    </View>

                    <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setRetryPass}
                            value={txtRetryPass}
                            placeholder="Repetir Contraseña"
                            placeholderTextColor= {segundoColor}
                            borderColor="white"
                            borderRadius={30}
                            secureTextEntry={!showRetryPassword}
                        />
                        <TouchableOpacity
                            onPress={handleTogglePasswordVisibility2}
                            style={{ position: 'absolute', right: '13%' }} // Ajusta según tus necesidades
                        >
                            <FontAwesome5 name={showRetryPassword ? 'eye' : 'eye-slash'} size={25} color="#D8D8D8" />
                        </TouchableOpacity>
                       
                        
                    </View>


                    {CreateError(createError)}

                    <TouchableOpacity
                        onPress={() => createUser()}
                        style={{ width: '80%', backgroundColor: primerColor, marginTop: '15%', borderRadius: 20, paddingVertical: '4%' }}>
                        <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>Crear Cuenta</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>


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

export default Registro;