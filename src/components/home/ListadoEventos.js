import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    StyleSheet,
    BackHandler,
    ScrollView,
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
import ModalVentana from '../cuenta/ModalVentana';
import firestore from '@react-native-firebase/firestore'


var { height, width } = Dimensions.get('window');



const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
};




function ListadoEventos(props) {

    const {navigation} = props
    const { primerColor, segundoColor, region, dataPerson, estadoPedido } = props.route.params
    const navigationRetrocede = useNavigation();

    const [confirmaPedido, setconfirmaPedido] = useState(true);
    const urlApi = url()
    const [errorApi, seterrorApi] = useState(false);
    const [estadoPedidos, setestadoPedido] = useState(estadoPedido ?? false);
    const [conductorLocation, setconductorLocation] = useState(null);
    const [finalizaEntrega, setfinalizaEntrega] = useState(false);
    const [tipoUsuario, settipoUsuario] = useState(2)
    const [isVisibleLoading, setisVisibleLoading] = useState(false);
    const [messageLoading, setisMessageLoading] = useState("");
    const [messageError, setisMessageError] = useState("");
    const [error, setisError] = useState(false);
    const [regionNueva, setRegionNueva] = useState({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [puntosGrafica, setpuntosGrafica] = useState([])
    const [regionActualizada, setRegionActualizada] = useState({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [datosPedidoCliente, setDatosPedidoCliente] = useState({
        idPedido: 0,
        nombre: '',
        direccion: '',
        cantidad: 0,
        telefono: ''
    });




    const [dataPedidos, setdataPedidos] = useState([]);



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

        //obtenerPedidos()

        console.log("ubicacio  actual conductor ------------>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>************")

        obtenerUbicacionActualCondcutor()
        obnerPedidoClientes()

        obtenerUbicacion();
        const intervalId = setInterval(obtenerUbicacion, 10000);
        return () => clearInterval(intervalId);

    }, []);


    /*useEffect(() => {

        console.log("******************************************************************************")
        
        obtenerUbicacionActualCondcutor()


    }, [estadoPedidos]);*/



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
          
            console.log('erorr ubucacion')
            console.log(error);
        }
    };




    const obtenerUbicacionActualCondcutor = async () => {
        console.log('EJECUTA SOLO CUANDO SE ESTA EN ESTA PANTALLA?------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
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

              setRegionActualizada({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
              

            } catch (error) {
              console.log('entra errr REGION ACTULAIZADAAAAAAAAAAAAAAAAAA')
              setisError(true)
              console.log(error);
            }
      
          } else {
            console.log('Permiso de ubicación no otorgado');
          }
        } catch (error) {
          
            console.log('erorr ubucacion')
            console.log(error);
        }
    };



    const onBackPress = () => {
       
        navigation.navigate('ScreenLogin', {tipoUsuario: tipoUsuario})
        return true;
    };
    
    const aceptarSolicitud = async () =>{

        await trazarRutaPedidosCliente();


    } 

    const recuperarNuevamentePedidos = async () =>{

        seterrorApi(false)
        obnerPedidoClientes()

    } 


    
    const terminaEntregaMapa = (cedula, idPedido) => {
        console.log("recibe señal  CONDUCTOR _----------------------------***************************************")
        console.log(idPedido)
        setconfirmaPedido(false)
        
    };

    const actualizaListaPedido = () => {
        console.log("ACTUALIZA----------------------------***************************************")
        obnerPedidoClientes()
    };



    const trazarRutaPedidosCliente = async () =>{
        navigation.navigate('MainMenuConductor', {confirmaPedido: true, region: regionActualizada, conductorLocation: conductorLocation, cambiaEstadoEntrega: terminaEntregaMapa(), datosPedidoCliente: datosPedidoCliente, actualizaListaPedido: actualizaListaPedido})
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
           
            //console.log("qqqqqqqqqqqqqq")
            //console.log(data)
           
            if(status == 200){
                console.log(data.estado)
                if(data.estado == "ok"){
                    console.log("verifica login")
                    console.log(data.estado)
                    guardarConductorFirebase(latitude, longitude)
                }else{

                }
            }

        }).catch((error) => {
            console.log("error al actualizarPosicionConductor")
            console.log(error)
        })

    }

    const obnerPedidoClientes = async () =>{

        setisVisibleLoading(true)
        setisMessageLoading("CARGANDO....")


        let headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }


        var objetoEnviar = {
            "identificacion": dataPerson.cedula,
        }


        await HttpPost(urlApi + 'obtener_pedidos_distribuidor/', headers, JSON.stringify(objetoEnviar), 5000).then(async ([data, status]) => {
           
            console.log("pedido clientes-->>>>>>>>>>>>>>>>>>")
            //console.log(data)

            if(status == 200){
                if(data.estado == "ok"){
                    setisVisibleLoading(false)
                    setdataPedidos(data.clientes)


                    if(data.clientes.length > 0){

                        const item = data.clientes[0];
                        elementoDibujar = item.ruta.coordinates[item.ruta.coordinates.length-1]
                        console.log("elemento dibujar----->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                        const locationConductor = {
                            latitude: elementoDibujar[1], 
                            longitude: elementoDibujar[0],
                        };
                        console.log(locationConductor)

                        setDatosPedidoCliente({
                            idPedido: item.idPedido,
                            nombre: item.nombre,
                            direccion: item.direccion,
                            cantidad: item.cantidad,
                            telefono: item.telefono
                        })
    
                        setconductorLocation(locationConductor)


                    }

                }
            }
           
            
        }).catch((error) => {
            console.log('eeror al recurprar pedidos----->>>>')
           console.log(error)
           seterrorApi(true)
           setisMessageError("Error al recueprar Pedidos")
           setisVisibleLoading(false)

        })




    }



    const obtenerPedidos = async () =>{

        setisVisibleLoading(true)
        setisMessageLoading("OBTENIENDO PEDIDOS PENDIENTES")


        try{
            const subcribe = await firestore().collection('Pedidos').onSnapshot(querySnapshot =>{
                const pedidos = []
                querySnapshot.forEach(documentSnapshot =>{
                    pedidos.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id
                    })
                })
                setdataPedidos(pedidos)

                setisVisibleLoading(false)


            })
    
        }catch(error){

            console.log("eror obtenr pediod")
            console.log(error)
        }

    }


    const guardarConductorFirebase = async (latitude, longitude) => {
        try {
            // Consultar si ya existe un conductor con el mismo número de cédula
            const querySnapshot = await firestore().collection('Conductor')
                .where('identificacion', '==', dataPerson.cedula)
                .get();
    
            if (querySnapshot.size > 0) {
                // Si ya existe un conductor con el mismo número de cédula, actualizar el documento existente
                const conductorExistente = querySnapshot.docs[0];
                await conductorExistente.ref.update({
                    latitude: latitude,
                    longitude: longitude,
                    fecha: new Date(),
                    estado: false
                });
            } else {
                // Si no existe, agregar un nuevo documento
                await firestore().collection('Conductor').add({
                    identificacion: dataPerson.cedula,
                    latitude: latitude,
                    longitude: longitude,
                    fecha: new Date(),
                    estado: false
                });
            }
    
        } catch (error) {
            console.log("Error al guardar/con actualizar en Firebase el conductor");
            console.error(error);
        }
    }
    


    const itemEvento = ({ item }) => {
        
        return (
            <View style={{}}>
                <View 
                    style={{ width: '100%', height: porcentaje(22), flexDirection: 'row', borderRadius: 10, backgroundColor: '#E1E1E1'}}>


                    <View style={{ width: porcentaje(50), height: porcentaje(25), justifyContent: 'center' }}>
                        <Image
                            source={require('../../assets/imagenes/avatar.png')}
                            indicatorProps={{
                                size: 20,
                                borderWidth: 0,
                                color: '#c4c4c4',
                                unfilledColor: '#c4c4c4',
                                borderRadius: '50%'
                            }}
                            style={{ width: porcentaje(45), height: porcentaje(10) }}
                            resizeMode="contain"
                        />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: 'black', fontSize: 8, fontFamily: 'Poppins-Light', width: '90%', textAlign: 'center' }}>{item.nombre}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: 'black', fontSize: 12, fontFamily: 'Poppins-SemiBold', width: '90%', textAlign: 'center' }}>Nro Gas: {item.cantidad}</Text>

                        
                    </View>

                    <View style={{ width: porcentaje(40), height: porcentaje(25), justifyContent: 'center' }}>
                        <Text style={{ color: 'black', fontSize: 10, fontFamily: 'Poppins-Light', textAlign: 'center' }}>{item.direccion}</Text>

                    </View>

                  

                </View>
                <Divider style={styles.divider} />

            </View>


        )
    }


    return (

        
        <View style={{ width: '100%' }}>

            <Loading text={messageLoading} isVisible={isVisibleLoading} color={primerColor} />


            {errorApi == true? (
                <View>
                    <ModalVentana isVisible={errorApi} text={messageError} title="INFORMATIVO" primerColor={primerColor} segundoColor={segundoColor}/>
                </View>
            ):(
                <View>
                </View>
            )}

           
            <FlatList
                    data={dataPedidos}
                    numColumns={1}
                    style={{}}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    renderItem={itemEvento}
                    onEndReached={info => {
                        console.log('pedor mas datos para cargar lista')
                    }}

            />
            

            {errorApi == true? (
                <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' }}>
                           <TouchableOpacity
                               style={{
                                   width: porcentaje(70), height: porcentaje(12),
                                   backgroundColor: primerColor,
                                   padding: 15,
                                   borderRadius: 10,
                                   justifyContent: 'center',
                                   alignItems: 'center',
                               }}
                               onPress={() => recuperarNuevamentePedidos()}>
                               <Text style={{color: 'white', textAlign: 'center'}}>CARGAR PEDIDO NUEVAMENTE</Text>
                           </TouchableOpacity>
           
                </View>
           
            ):(
                <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' }}>
                <TouchableOpacity
                    style={{
                        width: porcentaje(50), height: porcentaje(12),
                        backgroundColor: primerColor,
                        padding: 15,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => aceptarSolicitud()}>
                    <Text style={{color: 'white', textAlign: 'center'}}>VER RUTAS PEDIDOS</Text>
                </TouchableOpacity>

            </View>

            )}






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

