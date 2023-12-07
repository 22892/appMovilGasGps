import { createDrawerNavigator } from '@react-navigation/drawer'
import React, {useState, useEffect, useMemo} from 'react'
import { View, Text, Dimensions, SafeAreaView, Platform} from 'react-native'


import Solicitar from '../components/cuenta/Solicitar'

const Drawer = createDrawerNavigator()


function NavigationDrawer(props){

    const {navigation} = props

    const [primerColor, setprimerColor] = useState("#F80C25");
    const [segundoColor, setsegundoColor] = useState("#CECECE");


    return (

        <>
        
        <SafeAreaView style={{ flex: 0, backgroundColor: primerColor }} />
            <Drawer.Navigator
                initialRouteName={"Solicitar"}
            >
                <Drawer.Screen
                    name="Solicitar"
                    component={Solicitar}
                    initialParams={{ primerColor: primerColor, segundoColor: segundoColor }}
                    options={{
                        headerShown: true,
                        title: 'PEDIR GAS',
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
                    }}}
                />
            </Drawer.Navigator>
        </>
            
    ) 


}

export default NavigationDrawer