import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    StyleSheet,
    BackHandler,
    Modal
} from 'react-native';
import { Image, Divider } from '@rneui/themed';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { HttpPost, HttpGet, HttpPatch } from '../../utils/httpApi';
import {url} from '../../utils/url'
import HeaderButton from '../../navigation/HeaderButton';
import Loading from '../../utils/Loading';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';


var { height, width } = Dimensions.get('window');



const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
};




function ListadoEventos(props) {

    const {navigation} = props
    const { primerColor, segundoColor, region, dataPerson } = props.route.params
    const navigationRetrocede = useNavigation();

    const [confirmaPedido, setconfirmaPedido] = useState(true);
    const urlApi = url()
    const [errorApi, seterrorApi] = useState(false);
    const [conductorLocation, setconductorLocation] = useState(null);
    const [finalizaEntrega, setfinalizaEntrega] = useState(false);
    const [tipoUsuario, settipoUsuario] = useState(2)
    const [isVisibleLoading, setisVisibleLoading] = useState(false);
    const [error, setisError] = useState(false);
    const [regionNueva, setRegionNueva] = useState({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });




    const [dataEventos, setdataEventos] = useState([
        {name: 'Pedro', lastname: 'Alvarez', zona: 'Cuenca' },
        {name: 'Pedro', lastname: 'Alvarez', zona: 'Cuenca'},
        {name: 'Pedro', lastname: 'Alvarez', zona: 'Cuenca'},
        {name: 'Pedro', lastname: 'Alvarez', zona: 'Cuenca'},
        {name: 'Pedro', lastname: 'Alvarez', zona: 'Cuenca'},
        {name: 'Pedro', lastname: 'Alvarez', zona: 'Cuenca'},
        {name: 'Pedro', lastname: 'Alvarez', zona: 'Cuenca'},
        {name: 'Pedro', lastname: 'Alvarez', zona: 'Cuenca'}


    ]);



    useEffect(() => {

        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

        const fetchData = async () => {
            // Cualquier otra lógica que dependa de obtenerUbicacionCliente() completándose
        };
        
        fetchData();

        return () => {
          backHandler.remove();
        };

        

    }, []);   

    useEffect(() => {

        console.log("persona loge")
        console.log(dataPerson)
        obtenerUbicacion();

        const intervalId = setInterval(obtenerUbicacion, 30000);
        return () => clearInterval(intervalId);

    }, []);



    const obtenerUbicacion = async () => {
        console.log('lista solicitud evento')
        console.log(dataPerson)
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

             // const latitude = Math.random() * 180 - 90;
              //const longitude = Math.random() * 360 - 180;

              console.log("coorrr")
              console.log(latitude)

              setRegionNueva({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
              
              console.log(regionNueva)

              actualizarPosicionConductor(latitude, longitude)


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



    const onBackPress = () => {
       
        navigation.navigate('ScreenLogin', {tipoUsuario: tipoUsuario})
        return true;
    };
    
    const aceptarSolicitud = async () =>{

        await obtenerUbicacionCliente();


    } 

    
    const terminaEntregaMapa = () => {
        console.log("recibe señal conduc")
        setconfirmaPedido(false)

    };



    const obtenerUbicacionCliente = async () =>{


        setisVisibleLoading(true)


        let headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }

        var objetoEnviar = {

            "punto_inicial": {
                "latitude": regionNueva.latitude,
                "longitude": regionNueva.longitude
            },
            "ruta_punto": 0
        }


        await HttpPost(urlApi + 'punto_distribuidor_ruta/', headers, JSON.stringify(objetoEnviar), 5000).then(async ([data, status]) => {
           
            if(status == 200){

                const resul = data.ruta_corta

                console.log("respuesta punto cercao")
                console.log(resul)

                const locationConductor = {
                    latitude: resul.latitude , 
                    longitude: resul.longitude,
                };

                setconductorLocation(locationConductor)
                setconfirmaPedido(true)
              

                const timeoutId = setTimeout(() => {
                  
                    setisVisibleLoading(false)
                    navigation.navigate('MainMenuConductor', {confirmaPedido: true, conductorLocation: locationConductor, cambiaEstadoEntrega: terminaEntregaMapa()})


                }, 3000);
              
                return () => {
                    clearTimeout(timeoutId);
                };

               
            }

          

        }).catch((error) => {
            
            console.log("error obterr puntos")
            seterrorApi(true)
            setisVisibleLoading(false)

        })


        console.log("objeto-------------------->>>>>>>>>>>>>>")
        console.log(objetoEnviar)
    }



    const actualizarPosicionConductor = async (latitude, longitude) =>{

        let headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }


        var objetoEnviar = {
            "identificacion": dataPerson.cedula,
            "coordenadas": {
                "latitude": latitude,
                "longitude": longitude
            }
        }

        console.log("urll")
        console.log(urlApi+'actualiza_posicion')
        console.log("objeto actualziar")
        console.log(objetoEnviar)

        await HttpPost(urlApi + 'actualiza_posicion/', headers, JSON.stringify(objetoEnviar), 5000).then(async ([data, status]) => {
           
            console.log("qqqqqqqqqqqqqq")
            console.log(data)
            if(status == 200){

                if(data.estado == "ok"){
                    console.log("verifica login")
                    console.log(data.estado)
                }
            }

        }).catch((error) => {
           console.log(error)
        })

    }



    const itemEvento = ({ item }) => {
        
        return (
            <TouchableOpacity onPress={aceptarSolicitud} style={{}}>
                <View 
                    style={{ width: '100%', height: porcentaje(22), flexDirection: 'row', borderRadius: 10, backgroundColor: '#E1E1E1'}}>

                    <View>

                    </View>

                    <View style={{ width: porcentaje(40), height: porcentaje(25), justifyContent: 'center' }}>
                        <Image
                            source={require('../../assets/imagenes/gps.jpg')}
                            indicatorProps={{
                                size: 20,
                                borderWidth: 0,
                                color: '#c4c4c4',
                                unfilledColor: '#c4c4c4',
                                borderRadius: '50%'
                            }}
                            style={{ width: porcentaje(35), height: porcentaje(10) }}
                            resizeMode="contain"
                        />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: 'black', fontSize: 10, fontFamily: 'Poppins-Light', width: '90%', textAlign: 'center' }}>{item.name}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: 'black', fontSize: 12, fontFamily: 'Poppins-SemiBold', width: '90%', textAlign: 'center' }}>{item.lastname}</Text>

                        
                    </View>

                    <View style={{ width: porcentaje(28), height: porcentaje(25), justifyContent: 'center' }}>
                        <Text style={{ color: 'black', fontSize: 10, fontFamily: 'Poppins-Light', textAlign: 'center' }}>{item.zona}</Text>

                    </View>
                    <View style={{ width: porcentaje(30), height: porcentaje(25), justifyContent: 'center' }}>

                        <FontAwesome5 name="check" size={20} color="#3498db" style={{textAlign: 'center'}} />
                    </View>
                   

                </View>
                <Divider style={styles.divider} />

            </TouchableOpacity>


        )
    }


    return (

        <View style={{ width: '100%' }}>

            <Loading text="Obteniendo Cliente" isVisible={isVisibleLoading} color={segundoColor} />


            <View style={{flexDirection: 'row'}}>
                <Text style={styles.colorCabecera}>
                    Cliente
                </Text>
                <Text style={styles.colorCabecera3}>
                    Destino
                </Text>
                <Text style={styles.colorCabecera2}>
                    Aceptar
                </Text>
                
            </View>
            <View>
                <FlatList
                    data={dataEventos}
                    numColumns={1}
                    style={{}}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 48 }}
                    renderItem={itemEvento}
                    onEndReached={info => {
                        console.log('pedor mas datos para cargar lista')
                    }}

                />
            </View>



        </View>
    )

}

const styles = StyleSheet.create({
    divider: {
        padding: 1,
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3',
        marginVertical: 16,
    },
    colorCabecera:{
        color: 'black',
        width: porcentaje(48),
        fontWeight: 'bold',
       textAlign: 'center'
    },
    colorCabecera2:{
        color: 'black',
        width: porcentaje(20),
        fontWeight: 'bold'
    },
    colorCabecera3:{
        color: 'black',
        width: porcentaje(30),
        fontWeight: 'bold'
    }
    
})

export default ListadoEventos;

