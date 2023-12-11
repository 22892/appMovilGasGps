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

const Tab = createBottomTabNavigator();


export default function MainMenuConductor(props){

    const { route } = useRoute();
    const {navigation} = props
    const { primerColor, segundoColor, region, confirmaPedido, conductorLocation, cambiaEstadoEntrega } = props.route.params
    const [colorLetra, setcolorLetra] = useState("#FFFFFF")
    const [finalizaEntrega, setfinalizaEntrega] = useState(false);
    const [confirmaPedido2, setconfirmaPedido] = useState(confirmaPedido);

    
    useEffect(() => {

    }, []);   
 

    const verSolicitudes = () =>{
        console.log("cerar sesion")
        navigation.navigate("ListadoEventos")
    }

    
    const terminaEntregaMapa = () => {
        console.log("recibe señal main menu")
        setfinalizaEntrega(true)
        setconfirmaPedido(false)
        
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
                {() => <Mapa primerColor={primerColor} segundoColor={segundoColor} region={region} tipo={2} confirmaPedido={confirmaPedido2} conductorLocation={conductorLocation} cambiaEstadoEntrega={terminaEntregaMapa} />}
             </Tab.Screen>
        </Tab.Navigator>

    )
}



