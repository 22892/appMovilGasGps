import React, {useState, useEffect, useMemo} from 'react'
import { View, Text, Dimensions, StatusBar, ImageBackground, SafeAreaView, Platform, TouchableOpacity, BackHandler, Alert} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../utils/context';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';


import Home from '../components/home/Home'
import Perfil from '../components/cuenta/Perfil'
import MainMenu from './MainMenu'
import ScreenLogin from '../components/cuenta/ScreenLogin';
import Registro from '../components/cuenta/Registro';
import Login from '../components/cuenta/Login';
import OlvidasteContrasena from '../components/cuenta/OlvidasteContrasena';
import Beneficios from '../components/cuenta/Beneficios';
import Mapa from '../components/mapa/Mapa';
import ModalVentana from '../components/cuenta/ModalVentana';
import Solicitar from '../components/cuenta/Solicitar';
import MainMenuConductor from './MainMenuConductor';
import ListadoEventos from '../components/home/ListadoEventos';

const Stack = createNativeStackNavigator()



function Navigation(props){

    const {navigation} = props

    const [primerColor, setprimerColor] = useState("#F80C25");
    const [segundoColor, setsegundoColor] = useState("#CECECE");
    


    const screenHeight = Dimensions.get('screen').height;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setisError] = useState(false);


    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    

    const authContext = useMemo(() => {

        console.log('esto se ejcuta ')

    }, []);

    const backAction = () => {
        Alert.alert('Salir de la aplicación', '¿Seguro que quieres salir?', [
          {
            text: 'Cancelar',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Salir',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
    };

    useEffect(() => {

        obtenerUbicacion();
        setTimeout(() => {
            setIsLoading(false);
        }, 6000); 

    }, []);

    const cerrar = () =>{
        backAction();
    }

    const obtenerUbicacion = async () => {
        console.log('entrarar')
        try {
          let permiso;
          if (Platform.OS === 'android') {
            permiso = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
          } else if (Platform.OS === 'ios') {
            permiso = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          }
    
          if (permiso === 'granted') {
            // Obtener ubicación aquí
            try {
              const position = await new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(resolve, reject, {
                  enableHighAccuracy: true,
                  timeout: 20000,
                  maximumAge: 1000,
                });
              });
              const { latitude, longitude } = position.coords;
              setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
              
              console.log(region.latitude)
            } catch (error) {
              console.log('entra errr')
              setisError(true)
              console.log(error);
            }
      
          } else {
            console.log('Permiso de ubicación no otorgado');
          }
        } catch (error) {
          
          console.log(error);
        }
    };
    


    if (isLoading) {

    

            return (
                <>
               
                <ImageBackground source={require('../assets/imagenes/gps.jpg')} style={{ flex: 1, width: '100%', height: screenHeight, position: 'absolute', top: 0, alignItems: 'center' }}>
    
                <StatusBar translucent backgroundColor="transparent" />
                </ImageBackground>
    
                </>
                
            );
    

        

    }


    return(

        <>
           

                <>
                <SafeAreaView style={{ flex: 0, backgroundColor: primerColor }} />
                <Stack.Navigator
                    initialRouteName={"ScreenLogin"}
                >
                    <Stack.Screen
                        name="MainMenu"
                        component={MainMenu}
                        initialParams={{ primerColor: primerColor, segundoColor: segundoColor, region: region}}
                        options={{ headerShown: false, title: 'sadas', headerBackTitleVisible: false }}
    
                    />

                    <Stack.Screen
                        name="MainMenuConductor"
                        component={MainMenuConductor}
                        initialParams={{ primerColor: primerColor, segundoColor: segundoColor, region: region}}
                        options={{ headerShown: false, title: 'sadas', headerBackTitleVisible: false }}
    
                    />

                    <Stack.Screen
                        name="ListadoEventos"
                        component={ListadoEventos}
                        initialParams={{ primerColor: primerColor, segundoColor: segundoColor, region: region}}
                        options={{
                            headerShown: true,
                            title: 'Listado Solicitudes',
                            headerTintColor: 'white',
                            headerBackTitleVisible: false,
                            headerTitleAlign: 'center',
                            headerTitleStyle: {
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 14
                            },
                            headerStyle: {
                                backgroundColor: primerColor,
                                borderBottomColor: primerColor
                            },
                            headerLeft: () => (
                                <TouchableOpacity onPress={cerrar}>
                                  <Text style={{ color: 'red' }}>{'Cerrar'}</Text>
                                </TouchableOpacity>
                            ),
                            
                        }}
    
                    />
    
    
                    <Stack.Screen
                        name="ScreenLogin"
                        component={ScreenLogin}
                        initialParams={{ primerColor: primerColor }}
                        options={{ headerShown: false, title: 'sadas', headerBackTitleVisible: false }}
    
                    />
    
                    <Stack.Screen
                        name="Registro"
                        component={Registro}
                        initialParams={{ primerColor: primerColor, segundoColor: segundoColor }}
                        options={{
                            headerShown: true,
                            title: 'Registro',
                            headerTintColor: 'white',
                            headerBackTitleVisible: false,
                            headerTitleAlign: 'center',
                            headerTitleStyle: {
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 14
                            },
                            headerStyle: {
                                backgroundColor: primerColor,
                                borderBottomColor: primerColor
                            }
                        }}
                    />

                    <Stack.Screen
                        name="Solicitar"
                        component={Solicitar}
                        initialParams={{ primerColor: primerColor, segundoColor: segundoColor, region: region }}
                        options={{
                            headerShown: true,
                            title: '',
                            headerTintColor: 'white',
                            headerBackTitleVisible: false,
                            headerTitleAlign: 'center',
                            headerTitleStyle: {
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 14
                            },
                            headerStyle: {
                                backgroundColor: primerColor,
                                borderBottomColor: primerColor
                            }
                        }}
                    />
    

    
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        initialParams={{ primerColor: primerColor, segundoColor: segundoColor }}
                        options={{
                            headerShown: true,
                            title: 'Iniciar Sesión',
                            headerTintColor: 'white',
                            headerBackTitleVisible: false,
                            headerTitleAlign: 'center',
                            headerTitleStyle: {
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 14
                            },
                            headerStyle: {
                                backgroundColor: primerColor,
                                borderBottomColor: primerColor
                            }
                        }}
                    />
    
                    <Stack.Screen
                    
                        name="OlvidasteContrasena"
                        component={OlvidasteContrasena}
                        initialParams={{ primerColor: primerColor, segundoColor: segundoColor }}
                        options={{
                            headerShown: true,
                            title: 'Olvidaste tu Contraseña ?',
                            headerTintColor: 'white',
                            headerBackTitleVisible: false,
                            headerTitleAlign: 'center',
                            headerTitleStyle: {
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 14
                            },
                            headerStyle: {
                                backgroundColor: primerColor,
                                borderBottomColor: primerColor
                            }
                        }}
                    />
    
                    <Stack.Screen
                    
                        name="Beneficios"
                        component={Beneficios}
                        initialParams={{ primerColor: primerColor, segundoColor: segundoColor }}
                        options={{
                            headerShown: true,
                            title: 'Dashboard',
                            headerTintColor: 'white',
                            headerBackTitleVisible: false,
                            headerTitleAlign: 'center',
                            headerTitleStyle: {
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 14
                            },
                            headerStyle: {
                                backgroundColor: primerColor,
                                borderBottomColor: primerColor
                            }
                        }}
                    />
    
                    <Stack.Screen
                        name="Mapa"
                        component={Mapa}
                        //initialParams={{ primerColor: primerColor, segundoColor: segundoColor }}
                        options={{ headerShown: false, title: 'sadas', headerBackTitleVisible: false }}
    
                    />
    
                </Stack.Navigator>
    
                </>



    


        </>

    )
}

export default Navigation