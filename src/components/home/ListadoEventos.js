import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    StyleSheet,
    BackHandler
} from 'react-native';
import { Image, Divider } from '@rneui/themed';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';


var { height, width } = Dimensions.get('window');



const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
};


function ListadoEventos(props) {

    const {navigation} = props
    const { primerColor, segundoColor } = props.route.params
    const navigationRetrocede = useNavigation();

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

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleHardwareBack
          );
          return () => backHandler.remove();
        
      }, []);   

    const handleHardwareBack = () => {
        return true; 
    };

    const aceptarSolicitud = () =>{
        navigation.navigate('MainMenuConductor')
    } 


    const itemEvento = ({ item }) => {
        
        return (
            <View style={{}}>
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
                    <TouchableOpacity onPress={aceptarSolicitud} style={{ width: porcentaje(30), height: porcentaje(25), justifyContent: 'center' }}>

                        <FontAwesome5 name="check" size={20} color="#3498db" style={{textAlign: 'center'}} />
                    </TouchableOpacity>
                   

                </View>
                <Divider style={styles.divider} />

            </View>


        )
    }


    return (

        <View style={{ width: '100%' }}>
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