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


export default function MainMenu(props){

    const {navigation} = props
    const { primerColor, segundoColor, region } = props.route.params
    const [colorLetra, setcolorLetra] = useState("#FFFFFF")

    


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
                //initialParams={{ primerColor: primerColor, segundoColor: segundoColor, region: region,  tipo: 1  }}
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
                            
                            <Text style={{marginRight: 6}}>
                                Pago 
                            </Text>
                            
                            <TouchableOpacity
                                style={{ marginRight: 16 }}
                                onPress={() => {
                                    // Lógica del botón de la derecha
                                    console.log('Botón de la derecha presionado');
                                }}
                            >
                                <FontAwesome5 name="paypal" size={25} color="#3498db" />
                            </TouchableOpacity>


                        </View>

                        

                    </View>
                )
                }}
                
            >
                {() => <Mapa primerColor={primerColor} segundoColor={segundoColor} region={region} tipo={1} />}
            </Tab.Screen>
            <Tab.Screen
                name="Beneficios"
                component={Beneficios}
                initialParams={{ primerColor: primerColor }}
                options={{
                headerShown: false,
                tabBarVisible: false,
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 0, width: width / 4, marginBottom: 0, backgroundColor: primerColor, height: '100%' }}>
                    <FontAwesome5 name="chart-line" size={25} color="#3498db" />
                    {focused ?
                        <Text style={{ color: segundoColor, fontSize: 12, fontFamily: 'Poppins-Light' }}>Dashboard</Text>
                        : <Text style={{ color: colorLetra, fontSize: 12, paddingBottom: 1, fontFamily: 'Poppins-Light' }}>Dashboard</Text>}
                    </View>
                )
                }}
            />
             <Tab.Screen
                name="Perfil"
                component={Perfil}
                initialParams={{ primerColor: primerColor, segundoColor: segundoColor }}
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
