import React, {useState, useEffect} from 'react'
import { useRoute } from '@react-navigation/native';
import { View, Text, Dimensions, TouchableOpacity} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
var { height, width } = Dimensions.get('window');
import Home from '../components/home/Home';
import Perfil from '../components/cuenta/Perfil';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Beneficios from '../components/cuenta/Beneficios';
import Mapa from '../components/mapa/Mapa';

import { HttpPost, HttpGet, HttpPatch, HttpPostSinBody } from '../utils/httpApi';
import {url} from '../utils/url'


const Tab = createBottomTabNavigator();


export default function MainMenuConductor(props){

    const { route } = useRoute();
    const {navigation} = props
    const { primerColor, segundoColor, region, confirmaPedido, conductorLocation, cambiaEstadoEntrega, datosPedidoCliente } = props.route.params
    const [colorLetra, setcolorLetra] = useState("#FFFFFF")
    const [finalizaEntrega, setfinalizaEntrega] = useState(false);
    const [confirmaPedido2, setconfirmaPedido] = useState(confirmaPedido);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const urlApi = url()
    


    useEffect(() => {

    }, [props.route.params]);
 



    const actualizarEstadoPedidoEntregado = async (cedula, idPedido) =>{

        let headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }

        var objetoEnviar = {
            "identificacion": cedula,
            "id_pedido": idPedido
        }

        console.log("pedido  actualziar-->>>>>>>>>>>>>>>>>>")
        console.log(objetoEnviar)

        await HttpPost(urlApi + 'finalizar_pedido/', headers, JSON.stringify(objetoEnviar), 5000).then(async ([data, status]) => {
           
            console.log("response")
            console.log(data)
           
            if(status == 200){
                console.log(data.estado)
                if(data.estado == "ok"){
                    console.log('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM')
                    const actualizaListaPedido = props.route.params.actualizaListaPedido;
                    console.log(props.route.params)
                    if (typeof actualizaListaPedido === 'function') {
                        actualizaListaPedido();
                    }     
                }else{
                    //navigation.navigate('ListadoEventos',{estadoPedido: false})

                }
            }

        }).catch((error) => {
            console.log("error al actualizarEstadoPedidoEntregado")
            console.log(error)
        })

    }



    const verSolicitudes = () =>{
        console.log("cerar sesion")
        navigation.navigate("ListadoEventos")
    }

    
    const terminaEntregaMapa = (cedula, idPedido) => {
        console.log("recibe señal main menu ------------------------------------------------------------------------------------------------")
        console.log(cedula)
        setfinalizaEntrega(true)
        setconfirmaPedido(false)
        actualizarEstadoPedidoEntregado(cedula, idPedido)
    };




    return(
        <Tab.Navigator
            screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: { backgroundColor: primerColor, borderTopWidth: 3 }
            }}
            backBehavior="none"
        >
            <Tab.Screen
                name="Mapa"
                //initialParams={{ primerColor: primerColor, segundoColor: segundoColor, region: region, tipo: 2 }}
                options={{
                headerStyle: {
                    backgroundColor: primerColor,
                    borderBottomColor: primerColor
                },
                headerTitleStyle: {
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 14
                },
                headerTintColor: 'white',
                headerShown: true,
                tabBarVisible: false,
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 0, width: width / 4, marginBottom: 0, backgroundColor: primerColor, height: '100%' }}>
                    <FontAwesome5 name="car" size={25} color="#3498db" />
                    {focused ?
                        <Text style={{ color: segundoColor, fontSize: 12, fontFamily: 'Poppins-Light' }}>Entregas</Text>
                        : <Text style={{ color: colorLetra, fontSize: 12, paddingBottom: 1, fontFamily: 'Poppins-Light' }}>Entregas</Text>}
                    </View>
                ),
                headerRight: () => (

                    <View style={{flexDirection: 'row'}}>
                        
                        <View style={{flexDirection: 'row'}}>
                            
                            {finalizaEntrega == false ? (
                                <View onPress={verSolicitudes}>
                                    <Text style={{marginRight: 16, color: 'blue'}}>
                                       REALIZANDO ENTREGA
                                    </Text>

                                </View>

                            ):(

                                <TouchableOpacity onPress={verSolicitudes}>
                                    <Text style={{marginRight: 16, color: 'white'}}>
                                        Ver Solicitudes
                                    </Text>

                                </TouchableOpacity>

                            )}


                        </View>
                    </View>
                )
                }}
            >
                {() => <Mapa primerColor={primerColor} segundoColor={segundoColor} region={region} tipo={2} confirmaPedido={confirmaPedido2} conductorLocation={conductorLocation} cambiaEstadoEntrega={terminaEntregaMapa} finalizaEntrega={finalizaEntrega} navigation={navigation} datosPedidoCliente={datosPedidoCliente} />}
             </Tab.Screen>
        </Tab.Navigator>

    )
}



