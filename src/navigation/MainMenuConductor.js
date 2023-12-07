import React, {useState} from 'react'
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

    const {navigation} = props
    const { primerColor, segundoColor, region } = props.route.params
    const [colorLetra, setcolorLetra] = useState("#FFFFFF")


    const verSolicitudes = () =>{
        console.log("cerar sesion")
        navigation.navigate("ListadoEventos")
    }

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
                    <FontAwesome5 name="home" size={25} color="#3498db" />
                    {focused ?
                        <Text style={{ color: segundoColor, fontSize: 12, fontFamily: 'Poppins-Light' }}>Eventos</Text>
                        : <Text style={{ color: colorLetra, fontSize: 12, paddingBottom: 1, fontFamily: 'Poppins-Light' }}>Eventos</Text>}
                    </View>
                ),
                headerRight: () => (

                    <View style={{flexDirection: 'row'}}>
                        
                        <View style={{flexDirection: 'row'}}>
                            
                            <TouchableOpacity onPress={verSolicitudes}>
                                <Text style={{marginRight: 16, color: '#D40B33'}}>
                                    Ver Solicitudes
                                </Text>

                            </TouchableOpacity>

                        </View>
                    </View>
                )
                }}
            >
                {() => <Mapa primerColor={primerColor} segundoColor={segundoColor} region={region} tipo={2} />}
             </Tab.Screen>
             <Tab.Screen
                name="Perfil"
                component={Perfil}
                initialParams={{ primerColor: primerColor }}
                options={{
                headerShown: false,
                tabBarVisible: false,
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 0, width: width / 4, marginBottom: 0, backgroundColor: primerColor, height: '100%' }}>
                    <FontAwesome5 name="user" size={25} color="#3498db" />
                    {focused ?
                        <Text style={{ color: segundoColor, fontSize: 12, fontFamily: 'Poppins-Light' }}>Perfil</Text>
                        : <Text style={{ color: colorLetra, fontSize: 12, paddingBottom: 1, fontFamily: 'Poppins-Light' }}>Perfil</Text>}
                    </View>
                )
                }}
            />
        </Tab.Navigator>

    )
}


