import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    Modal,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Button,
    KeyboardAvoidingView,
    Keyboard,
    BackHandler
  } from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


import Loading from '../../utils/Loading';
import ModalVentana from './ModalVentana';
import Mapa from '../mapa/Mapa';
import { HttpPost, HttpGet, HttpPatch, HttpPostSinBody } from '../../utils/httpApi';
import {url} from '../../utils/url'


  var { height, width } = Dimensions.get('window');

  const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
  };

  const porcentajeHeigt = (por) => {
    return (height * por) / 100;
  };


function Solicitar(props) {

    const {navigation} = props
    const screenHeight = Dimensions.get('screen').height;
    const {primerColor, segundoColor, region} = props.route.params
    const [modalVisible, setModalVisible] = useState(false);
    const [direccion, setDireccion] = useState(null);
    const [YOUR_GOOGLE_MAPS_API_KEY, setApiKey] = useState("AIzaSyC8nFlMFGcAT3At__bZzkAN2oScMgudn8k");
    const [cargando, setCargando] = useState(false)
    const [confirmaPedido, setconfirmaPedido] = useState(false);
    const [tipoUsuario, settipoUsuario] = useState(1)



    const [isOpen, setIsOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const sheetRef = useRef(null)
    const snapPoints = ["85%"]
    const urlApi = url()
    const [errorApi, seterrorApi] = useState(false);
    const [conductorLocation, setconductorLocation] = useState(null);
    const [finalizaEntrega, setfinalizaEntrega] = useState(false);
    const [number, setNumber] = useState(0);
    const [isVisibleLoading, setisVisibleLoading] = useState(false);
    const [ltsConducotresConexion, setltsConducotresConexion] = useState([])
    const [codigoPedido, setcodigoPedido] = useState("")
    const [mensajeError, setmensajeError] = useState("");
    const [erroDatosPedido, seterroDatosPedido] = useState(false)
    const [messageEror, setmessageEror] = useState("")

    const txtNombre = useRef()
    const txtApellido = useRef()
    const txtTelefono = useRef()
    const txtCedula = useRef()
    const [login, setLogin] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        cedula: "",
        tipoPersona: 1,
        codigoPedido: "",
        numeroCilindro: 0
    });
    const [datosConductor, setdatosConductor] = useState({
        nombre: "BERNARDO",
        apellido: "CUZCO",
        telefono: "",
    });
    const [puntosGrafica, setpuntosGrafica] = useState([])



    const handleSheetChanges = useCallback((index: number) => {


        try {
            AsyncStorage.getItem('persona').then((data) => {
              if (data != null) {
               
                const login = JSON.parse(data);
               
                if(login.persona.tipoPersona == 1){
                  
                    console.log('recupera persona lciente')
                    console.log(login.persona.nombre)

                    const datosRecuperado = {
                        nombre: login.persona.nombre,
                        apellido: login.persona.apellido,
                        telefono: login.persona.telefono,
                        cedula: login.persona.cedula,
                        tipoPersona: 1,
                        codigoPedido: "",
                        numeroCilindro: 0,
                    };

                    console.log("lleno datos")
                    console.log(datosRecuperado)
                    setLogin(datosRecuperado);

            
                    
                    /*setLogin((login) => {
                        return { ...login, nombre: login.persona.nombre };
                    });*/

                }
                
              
              }
            });
          } catch (error) {
            console.log('erro recuepera user')
            console.log(error)
        }
    
        sheetRef.current?.snapToIndex(index)
        setIsOpen(true)
        setfinalizaEntrega(false)
        generarCodigoPedido()


    }, []);

    useEffect(() => {

        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        

        const fetchData = async () => {

            obtenerDireccion();
            setIsOpen(true)
            obtenerUbicacionConductoresConectados()
            
    
            console.log("sissiisisis")
            console.log(urlApi)
    

        };

        fetchData();

        return () => {
            backHandler.remove();
        };

    }, []); 

    const onBackPress = () => {
       
        console.log("envia actaualzia")
        navigation.navigate('ScreenLogin', {tipoUsuario: tipoUsuario})
        return true;
    };

    

    const generarCodigoPedido = () =>{
        const timestamp = new Date().getTime(); 
        const codigoAleatorio = Math.random().toString(36).substr(2, 5); 

        const codigoUnico = `${timestamp}${codigoAleatorio}`;
        console.log('codigo')
        console.log(codigoUnico)
        setcodigoPedido(codigoUnico)
        setLogin((login) => {
            return { ...login, codigoPedido: codigoUnico };
        });
        
    }

    const obtenerDireccion = async () => {
        try {

            console.log("peticiones cada 33333333")
            setCargando(true);
        
            let intentos = 0;
            let direccionEncontrada = false;
        
            while (!direccionEncontrada && intentos < 3) {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${YOUR_GOOGLE_MAPS_API_KEY}`
              );
        
              const data = await response.json();
        
              if (data.status === 'OK') {
                setDireccion(data.results[0].formatted_address);
                direccionEncontrada = true;
                setCargando(false);
              } else {
                console.error('Error en la solicitud:', data.status);
                intentos++;
                // Espera un momento antes de intentar nuevamente (puedes ajustar el tiempo)
                await new Promise(resolve => setTimeout(resolve, 3000));
              }
            }
            setCargando(false);
          } catch (error) {
            setCargando(false);
            console.error('Error al procesar la solicitud:', error.message);
          }
    };


    const obtenerUbicacionConductor = async () =>{

        setisVisibleLoading(true)
        seterrorApi(false)

        let headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }


        try {
            AsyncStorage.getItem('persona').then(async(data) => {
                if (data != null) {

                    const login = JSON.parse(data);

                    console.log("cargando.......")
                    console.log(login)

                    var objetoEnviar = {


                        "pedidoCliente": {
                            "identificacion": login.persona.cedula,
                            "nombres_completos": login.persona.nombre +" "+ login.persona.apellido,
                            "correo_electronico": "correo@gmail.com",
                            "telefono": login.persona.telefono,
                            "direccion": direccion,
                            "referencia": direccion,
                            "codigoPedido": codigoPedido,
                            "cantidad": login.persona.numeroCilindro,
                            "latitude": region.latitude,
                            "longitude": region.longitude
                        }
                        
                    }
            
                    console.log("que esta pasando")
                    console.log(objetoEnviar)
            
                    await HttpPost(urlApi + 'solicitud_pedido/', headers, JSON.stringify(objetoEnviar), 5000).then(async ([data, status]) => {
                       
                        if(status == 200){
            
            
                            if(data.error){
            
                                console.log("tiene erorr ")
                                setisVisibleLoading(false)
                                seterrorApi(true)
                                setconfirmaPedido(false)
                                setmessageEror("LAMENTAMOS NO TENER UN CONDCUTOR EN TU SECTOR")
            
                            }else{
                                const resul = data.distribuidor_asignado.ruta_corta
                                const puntoDubuja = data.distribuidor_asignado.puntos_ruta.coordinates
            
                                console.log("resultado api:...................")
                                //console.log(puntoDubuja)
                                setpuntosGrafica(puntoDubuja)
                
                               
                
                                const locationConductor = {
                                    latitude: resul.latitude , 
                                    longitude: resul.longitude,
                                };
                
                                //console.log("nuevo dato")
                                //console.log(locationConductor)
                
                                setconductorLocation(locationConductor)
                                setconfirmaPedido(true)
                                sheetRef.current?.close();
                                setIsOpen(false)   
                                setisVisibleLoading(false)
                
                            }
            
                    
                        }
            
                      
            
                    }).catch((error) => {
                        
                        console.log("erro generar solicitud")
                        seterrorApi(true)
                        setconfirmaPedido(false)
                        setisVisibleLoading(false)
                        setmessageEror("ERROR AL REALIZAR PEDIDO GAS")
                    })
            
            
                    console.log("objeto")
                    console.log(objetoEnviar)
            
                }
            });
          } catch (error) {
           
            console.log('erro recuepera user')
            console.log(error)
        }


    
    }



    const obtenerUbicacionConductoresConectados = async () =>{

        seterrorApi(false)

        let headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    
        await HttpPostSinBody(urlApi + 'listar_posiciones/', headers,  5000).then(async ([data, status]) => {
           
           
            if(status == 200){
    
              //console.log(JSON.stringify(data));
              setltsConducotresConexion(data)
                
            }
          
    
        }).catch((error) => {
            
            console.log("error obterr puntos")
            seterrorApi(true)
            setmessageEror("ERROR AL OBTENER CONDCUCTORES DISPONIBLES")
            
        })
    
    
    }
    

    

 
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
        setIsOpen(false)   
        
    }, []);

    const aceptarPedido =  async () => {

        console.log("leggg")
        console.log(login)
        setisVisibleLoading(true)

        if (login.nombre == "" || login.apellido == "" ) {
            setisVisibleLoading(false)
            setmensajeError("Nombre o Apellido Vacios")
            seterroDatosPedido(true)
        }else if(login.telefono.length < 10){
            setisVisibleLoading(false)
            setmensajeError("Telefono Invalido")
            seterroDatosPedido(true)
        }else if(login.cedula.length < 10){
            
            setisVisibleLoading(false)
            setmensajeError("Cédula Incorrecta")
            seterroDatosPedido(true)
        }else if(number == 0){
            setisVisibleLoading(false)
            setmensajeError("Minimo tiene que pedir 1 Cilindro")
            seterroDatosPedido(true)
        }else{
            try {

                console.log("lllegagagga")
                seterroDatosPedido(false)
                await AsyncStorage.setItem('persona', JSON.stringify({
                  persona: login,
                }));
                setisVisibleLoading(false)
                obtenerUbicacionConductor()

              } catch (error) {
                setmensajeError("Error al realizar Pedido!!!")
                seterroDatosPedido(true)
                // Hubo un error al intentar almacenar los datos
                console.error("Error al almacenar en AsyncStorage:", error);
              }
        }

        
       

    };
    

    const realizaEntrega = () =>{

    }

    const terminaEntregaMapa = () => {
        console.log("recibe señal")
        setconfirmaPedido(false)
        setfinalizaEntrega(true)
        obtenerUbicacionConductoresConectados()

    };

    const handleTextChange = (text) => {
        // Validar que el texto sea un número antes de actualizar el estado
        const parsedNumber = parseFloat(text);
        if (!isNaN(parsedNumber)) {
            setNumber(parsedNumber);
            setLogin((login) => {
                return { ...login, numeroCilindro: parsedNumber };
            });
          
        }
    };
    

    const incrementNumber = () => {
        setNumber(number + 1);
        setLogin((login) => {
            return { ...login, numeroCilindro: number + 1 };
        });
        
      };
    
    const decrementNumber = () => {
        setNumber(Math.max(0, number - 1));
        setLogin((login) => {
            return { ...login, numeroCilindro: number - 1 };
        });
    };
    


    const loginError = (flag) => {

        if (flag) {
            return (
                <View
  
                    style={{ width: '100%', backgroundColor: "#ECDDDE", marginTop: '1%', position: 'absolute', top: 0, padding: 10 }}>
                    <Text style={{ color: "red", fontSize: 14, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>{mensajeError}</Text>
                </View>
            )
        }
    }


 
    return(

        <>
        <GestureHandlerRootView >

            {errorApi == true? (
                <View>
                    <ModalVentana isVisible={errorApi} text={messageEror} title="INFORMATIVO" primerColor={primerColor} segundoColor={segundoColor}/>
                </View>

            ):(
                <View>

                </View>
            )}

            {finalizaEntrega == true ? (
                <View>
                    <ModalVentana isVisible={finalizaEntrega} text="El Conductor Juan Alvarez esta cerca de tu domicilio, estar pendiente!!! " title="Entrega Finalizada" primerColor={primerColor} segundoColor={segundoColor}/>
                </View>
           
            ):(
                <View>

                </View>
            )}

            


            <SafeAreaView style={{ backgroundColor: 'white', height: '100%', width: '100%'}}>

                <Loading text="Buscrado Conducto....." isVisible={isVisibleLoading} color={segundoColor} />


                <View style={{ backgroundColor: primerColor, justifyContent: 'center', alignItems: 'center', height: porcentajeHeigt(17), borderBottomEndRadius: 20, borderBottomStartRadius: 20 }}>

                    <View style={{ flexDirection: 'row', height: porcentaje(13) }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 30 }}> BIENVENIDO</Text>
                    </View>

                    <View
                        
                        style={{ width: '80%', backgroundColor: segundoColor, borderRadius: 20, paddingVertical: '3%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'black', fontSize: 14, fontFamily: 'Poppins-Light', textAlign: 'center' }}>{direccion ? `Ubicación Actual: ${direccion}` : 'Cargando dirección...'}</Text>
                    </View>

                </View>

                <Mapa primerColor={primerColor} segundoColor={segundoColor} region={region} tipo={1} confirmaPedido={confirmaPedido} conductorLocation={conductorLocation} cambiaEstadoEntrega={terminaEntregaMapa} ltsConducotresConexion={ltsConducotresConexion} puntosGrafica={puntosGrafica}/>

                <BottomSheet
                            ref={sheetRef}
                            snapPoints={snapPoints}
                            enablePanDownToClose={true}
                            onClose={() => setIsOpen(false)}
                            index={isSheetOpen ? 0 : -1}
                        >
                            <BottomSheetView>

                                <View style={{marginLeft: 10, margin: '5%'}}>
                                    {erroDatosPedido == true ? (
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: '10%'}}>
                                            <Text style={{color: primerColor, fontWeight: 900}}>CONFIRMA TU PEDIDO!!!</Text>
                                        </View>

                                    ):(
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text style={{color: primerColor, fontWeight: 900}}>CONFIRMA TU PEDIDO!!!</Text>
                                        </View>
                                    )}

                                    <View style={{marginTop: '0%'}}>

                                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>


                                            <View style={{ width: '100%', marginTop: '2%', flexDirection: 'row', alignItems: 'center'}}>
                                                <TextInput
                                                    style={styles.inputRegistro}
                                                    onChangeText={value => {
                                                        console.log("ingreso")
                                                        console.log(value)
                                                        setLogin((login) => {
                                                            return { ...login, nombre: value };
                                                        });
                                                    }}
                                                    value={login.nombre}
                                                    placeholder="Nombre"
                                                    placeholderTextColor= "white"
                                                    borderColor="white"
                                                    borderRadius={30}
                                                    ref={txtNombre}
                                                    onSubmitEditing={() => {
                                                        Keyboard.dismiss()
                                                    }}
                                                />
                                                
                                            </View>

                                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', }}>
                                                <TextInput
                                                    style={styles.inputRegistro}
                                                    onChangeText={value => {
                                                        setLogin((login) => {
                                                            return { ...login, apellido: value };
                                                        });
                                                    }}
                                                    value={login.apellido}
                                                    placeholder="Apellido"
                                                    placeholderTextColor= "white"
                                                    borderColor="white"
                                                    borderRadius={30}
                                                    ref={txtApellido}
                                                    onSubmitEditing={() => {
                                                        Keyboard.dismiss()
                                                    }}
                                                />
                                                
                                            </View>

                                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', }}>
                                                <TextInput
                                                    style={styles.inputRegistro}
                                                    onChangeText={value => {
                                                        setLogin((login) => {
                                                            return { ...login, telefono: value };
                                                        });
                                                    }}
                                                    value={login.telefono}
                                                    keyboardType="numeric"
                                                    placeholder="Telefono"
                                                    placeholderTextColor= "white"
                                                    borderColor="white"
                                                    borderRadius={30}
                                                    ref={txtTelefono}
                                                    onSubmitEditing={() => {
                                                        Keyboard.dismiss()
                                                    }}
                                                />
                                                
                                            </View>

                                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', }}>
                                                <TextInput
                                                    style={styles.inputRegistro}
                                                    onChangeText={value => {
                                                        setLogin((login) => {
                                                            return { ...login, cedula: value };
                                                        });
                                                    }}
                                                    value={login.cedula}
                                                    keyboardType="numeric"
                                                    placeholder="Cédula"
                                                    placeholderTextColor= "white"
                                                    borderColor="white"
                                                    borderRadius={30}
                                                    ref={txtCedula}
                                                    onSubmitEditing={() => {
                                                        Keyboard.dismiss()
                                                    }}
                                                />
                                                
                                            </View>
                                        </View>

                                        <View style={{marginLeft: '2%'}}>

                                            <Text style={{color: 'black', fontWeight: 800}}> Dirección Destino: </Text>
                                            <Text style={{color: 'black'}}> {direccion ? `En: ${direccion}` : 'Cargando dirección...'}  </Text>

                                            <Text style={{color: 'black', fontWeight: 800, marginTop: '5%'}}> Código de Pedido: </Text>
                                            <Text style={{color: 'black'}}> {codigoPedido}  </Text>

                                            <Text style={{color: 'black', fontWeight: 800, marginTop: '5%'}}> Seleccione Número de Cilindros: </Text>
                                            <View style={styles.container}>
                                        
                                                <View style={styles.buttonContainer}>

                                                    <TextInput
                                                        style={styles.input}
                                                        keyboardType="numeric"
                                                        placeholder="Ingrese un número"
                                                        value={number.toString()}
                                                        onChangeText={handleTextChange}
                                                        placeholderTextColor={primerColor}
                                                        borderRadius={30}
                                                    />
                                                    <TouchableOpacity style={{backgroundColor: primerColor, padding: 5, height: '72%', marginLeft: '5%', marginRight: '2%'}} onPress={incrementNumber}>
                                                        <FontAwesome5 name="plus" size={25} color="#D8D8D8" />

                                                    </TouchableOpacity >

                                                    <TouchableOpacity style={{backgroundColor: primerColor, padding: 5, height: '72%'}} onPress={decrementNumber}>
                                                        <FontAwesome5 name="minus" size={25} color="#D8D8D8" />
                                                    </TouchableOpacity>
                                                    
                                                </View>
                                            </View>


                                        </View>

                                        
                                    </View>

                                  
                                        
                                    
                                </View>

                                <View style={{flexDirection: 'row'}}>

                                <TouchableOpacity
                                     style={{
                                        backgroundColor: primerColor,
                                        padding: 15,
                                        width: '45%',
                                        borderRadius: 20,
                                        left: '20%', 
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() => aceptarPedido()}>
                                    <Text style={{color: 'white', textAlign: 'center'}}>GENERAR PEDIDO</Text>
                                </TouchableOpacity>



                                <TouchableOpacity
                                     style={{
                                        backgroundColor: segundoColor,
                                        padding: 15,
                                        width: '45%',
                                        borderRadius: 20,
                                        left: '40%'
                                       
                                    }}
                                    onPress={() => handleClosePress()}>
                                    <Text style={{color: 'black', textAlign: 'center'}}>CANCELAR</Text>
                                </TouchableOpacity>


                                </View>

                                {loginError(erroDatosPedido)}      

                               
                               
                            </BottomSheetView>
                           
                </BottomSheet>

              
                    
                {isOpen == true ? (

                    <View>
                    </View>
                ):(
                    
                    <View style={{  justifyContent: 'flex-end', alignItems: 'center'}}>

                    
                        <View style={{height: porcentajeHeigt(6), backgroundColor: primerColor, width: '100%'}}>

                            {confirmaPedido == true ? (

                                <TouchableOpacity
                                    style={{backgroundColor: primerColor, padding: 10}}
                                    onPress={() => realizaEntrega}>
                                    <Text style={{color: 'white', textAlign: 'center'}}>REALIZANDO ENTREGA</Text>
                                </TouchableOpacity>


                            ):(

                                <TouchableOpacity
                                    style={{backgroundColor: primerColor, padding: 10}}
                                    onPress={() => handleSheetChanges(0)}>
                                    <Text style={{color: 'white', textAlign: 'center'}}>SOLICITAR GAS</Text>
                                </TouchableOpacity>
                            )}
                        

                        </View>
                    </View>

                )}
                


            </SafeAreaView>


        </GestureHandlerRootView>

        </>
      

    )

}



const styles = StyleSheet.create({


    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        
    },
    container: {
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
        color: 'black',
        width: '70%'
    },
    buttonContainer: {
        flexDirection: 'row',
        
    },
    inputRegistro: {
        height: 40,
        margin: 5,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#E5E5E5',
        width: '100%',
        color: 'black',
        fontSize: 12, 
        fontFamily: 'Poppins-Light'
       
    },
})

export default Solicitar

