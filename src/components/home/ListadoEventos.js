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
import { HttpPost, HttpGet, HttpPatch } from '../../utils/httpApi';
import {url} from '../../utils/url'


var { height, width } = Dimensions.get('window');



const porcentaje = (porcentaje) => {
    return (width * porcentaje) / 100;
};


function ListadoEventos(props) {

    const {navigation} = props
    const { primerColor, segundoColor, region } = props.route.params
    const navigationRetrocede = useNavigation();

    const [confirmaPedido, setconfirmaPedido] = useState(false);
    const urlApi = url()
    const [errorApi, seterrorApi] = useState(false);
    const [conductorLocation, setconductorLocation] = useState(true);
    const [finalizaEntrega, setfinalizaEntrega] = useState(false);


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

        /*const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleHardwareBack
          );
          return () => backHandler.remove();*/
        
      }, []);   

    const handleHardwareBack = () => {
        return true; 
    };

    const aceptarSolicitud = () =>{
        navigation.navigate('MainMenuConductor', {finalizaEntrega: finalizaEntrega, conductorLocation: conductorLocation})
    } 



    const obtenerUbicacionCliente = async () =>{


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
               
            }

          

        }).catch((error) => {
            
            console.log("error obterr puntos")
            seterrorApi(true)
        })


        console.log("objeto")
        console.log(objetoEnviar)
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