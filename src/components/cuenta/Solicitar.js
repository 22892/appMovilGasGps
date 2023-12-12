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
    AsyncStorage,
    TextInput,
    Button
  } from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler';


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

    const screenHeight = Dimensions.get('screen').height;
    const {primerColor, segundoColor, region} = props.route.params
    const [modalVisible, setModalVisible] = useState(false);
    const [direccion, setDireccion] = useState(null);
    const [YOUR_GOOGLE_MAPS_API_KEY, setApiKey] = useState("AIzaSyC8nFlMFGcAT3At__bZzkAN2oScMgudn8k");
    const [cargando, setCargando] = useState(false)
    const [confirmaPedido, setconfirmaPedido] = useState(false);


    const [isOpen, setIsOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const sheetRef = useRef(null)
    const snapPoints = ["83%"]
    const urlApi = url()
    const [errorApi, seterrorApi] = useState(false);
    const [conductorLocation, setconductorLocation] = useState(null);
    const [finalizaEntrega, setfinalizaEntrega] = useState(false);
    const [number, setNumber] = useState(0);
    const [isVisibleLoading, setisVisibleLoading] = useState(false);


    const [txtNombre, setNombre] = useState("")
    const [txtApellido, setApellido] = useState("")
    const [txtTelefono, setTelefono] = useState("")
    const [txtCedula, setCedula] = useState("")
    


    const handleSheetChanges = useCallback((index: number) => {
    
        sheetRef.current?.snapToIndex(index)
        setIsOpen(true)
        setfinalizaEntrega(false)

    }, []);

    useEffect(() => {
        obtenerDireccion();
        setIsOpen(true)

        console.log("sissiisisis")
        console.log(urlApi)

    }, []); 
    


    const obtenerDireccion = async () => {
        try {
            setCargando(true)
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${YOUR_GOOGLE_MAPS_API_KEY}`
            );
  
            const data = await response.json();
  
            if (data.status === 'OK') {
                setDireccion(data.results[0].formatted_address);
                setCargando(false)
            } else {
                console.error('Error en la solicitud:', data.status);
            }
        } catch (error) {
          console.error('Error al procesar la solicitud:', error.message);
        }
    };


    const obtenerUbicacionConductor = async () =>{

        setisVisibleLoading(true)

        let headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }

        var objetoEnviar = {

            "punto_inicial": {
                "latitude": region.latitude,
                "longitude": region.longitude
            },
            "destinos": [
                {
                    "id": 37,
                    "latitude": "-2.8839208303706068",
                    "longitude": "-78.96712219887928"
                },
                {
                    "id": 38,
                    "latitude": "-2.887371135042596",
                    "longitude": "-78.95708000832752"
                },
                {
                    "id": 39,
                    "latitude": "-2.8966719040980005",
                    "longitude": "-78.97340929681019"
                },
                {
                    "id": 40,
                    "latitude": "-2.8876711610407457",
                    "longitude": "-78.97756135636524"
                }
            ]
        }


        await HttpPost(urlApi + 'punto_cercano/', headers, JSON.stringify(objetoEnviar), 5000).then(async ([data, status]) => {
           
            if(status == 200){

                const resul = data.ruta_corta

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

          

        }).catch((error) => {
            
            console.log("error obterr puntos")
            seterrorApi(true)
            setconfirmaPedido(false)
            setisVisibleLoading(false)
        })


        console.log("objeto")
        console.log(objetoEnviar)
    }





    

 
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
        setIsOpen(false)   
        
    }, []);

    const aceptarPedido = useCallback(() => {
        
        obtenerUbicacionConductor()

    }, []);
    

    const realizaEntrega = () =>{

    }

    const terminaEntregaMapa = () => {
        console.log("recibe señal")
        setconfirmaPedido(false)
        setfinalizaEntrega(true)


    };

    const handleTextChange = (text) => {
        // Validar que el texto sea un número antes de actualizar el estado
        const parsedNumber = parseFloat(text);
        if (!isNaN(parsedNumber)) {
          setNumber(parsedNumber);
        }
    };
    

    const incrementNumber = () => {
        setNumber(number + 1);
      };
    
    const decrementNumber = () => {
        setNumber(Math.max(0, number - 1));
    };
    
 
    return(

        <>
        <GestureHandlerRootView >

            {errorApi == true? (
                <View>
                    <ModalVentana isVisible={errorApi} text="Error Server " title="ERROR" primerColor={primerColor} segundoColor={segundoColor}/>
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

                <Mapa primerColor={primerColor} segundoColor={segundoColor} region={region} tipo={1} confirmaPedido={confirmaPedido} conductorLocation={conductorLocation} cambiaEstadoEntrega={terminaEntregaMapa}/>

                <BottomSheet
                            ref={sheetRef}
                            snapPoints={snapPoints}
                            enablePanDownToClose={true}
                            onClose={() => setIsOpen(false)}
                            index={isSheetOpen ? 0 : -1}
                        >
                            <BottomSheetView>

                                <View style={{marginLeft: 10, margin: '5%'}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    
                                        <Text style={{color: primerColor, fontWeight: 900}}>CONFIRMA TU PEDIDO!!!</Text>

                                    </View>

                                    <View style={{marginTop: '0%'}}>

                                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>


                                            <View style={{ width: '100%', marginTop: '2%', flexDirection: 'row', alignItems: 'center'}}>
                                                <TextInput
                                                    style={styles.inputRegistro}
                                                    onChangeText={setNombre}
                                                    value={txtNombre}
                                                    placeholder="Nombre"
                                                    placeholderTextColor= "white"
                                                    borderColor="white"
                                                    borderRadius={30}
                                                />
                                                
                                            </View>

                                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', }}>
                                                <TextInput
                                                    style={styles.inputRegistro}
                                                    onChangeText={setApellido}
                                                    value={txtApellido}
                                                    placeholder="Apellido"
                                                    placeholderTextColor= "white"
                                                    borderColor="white"
                                                    borderRadius={30}
                                                />
                                                
                                            </View>

                                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', }}>
                                                <TextInput
                                                    style={styles.inputRegistro}
                                                    onChangeText={setTelefono}
                                                    value={txtTelefono}
                                                    keyboardType="numeric"
                                                    placeholder="Telefono"
                                                    placeholderTextColor= "white"
                                                    borderColor="white"
                                                    borderRadius={30}
                                                />
                                                
                                            </View>

                                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', }}>
                                                <TextInput
                                                    style={styles.inputRegistro}
                                                    onChangeText={setCedula}
                                                    keyboardType="numeric"
                                                    value={txtCedula}
                                                    placeholder="Cédula"
                                                    placeholderTextColor= "white"
                                                    borderColor="white"
                                                    borderRadius={30}
                                                />
                                                
                                            </View>
                                        </View>

                                        <View style={{marginLeft: '2%'}}>

                                            <Text style={{color: 'black', fontWeight: 800}}> Dirección Destino: </Text>
                                            <Text style={{color: 'black'}}> {direccion ? `En: ${direccion}` : 'Cargando dirección...'}  </Text>

                                            <Text style={{color: 'black', fontWeight: 800, marginTop: '5%'}}> Código de Pedido: </Text>
                                            <Text style={{color: 'black'}}> HGDBHSS678  </Text>

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

