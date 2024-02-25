import React, {useState, useEffect, useRef, useCallback} from 'react'
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Dimensions, Modal} from 'react-native'
import Loading from '../../utils/Loading';
import MapView, {Marker, PROVIDER_LEAFLET} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HttpPost, HttpGet, HttpPatch, HttpPostSinBody } from '../../utils/httpApi';
import {url} from '../../utils/url'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalVentana from '../cuenta/ModalVentana';
import { color } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';


function Mapa(props){

  const { primerColor, segundoColor, region, tipo, confirmaPedido, conductorLocation, cambiaEstadoEntrega, ltsConducotresConexion, actualizaDireccion, finalizaEntrega, datosPedidoCliente } = props;
  const {navigation} = props

  //const { primerColor, segundoColor, region, tipo } = props.route.params
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [YOUR_GOOGLE_MAPS_API_KEY, setApiKey] = useState("AIzaSyC8nFlMFGcAT3At__bZzkAN2oScMgudn8k");
  const [objectLocation, setObjectLocation] = useState(null);
  const mapViewRef = useRef(null);
  const [duration, setDuration] = useState(null);
  const urlApi = url()
  const window = Dimensions.get('window');
  const { width, height } = window;
  const [regionActual, setRegionActual] = useState({
    latitude: region.latitude,
    longitude: region.longitude,
  })

  const [markerPosition, setMarkerPosition] = useState({ x: 0, y: 0 });
  const [direccion, setDireccion] = useState(null);
  const [modalVisible, setModalVisible] = useState(finalizaEntrega);
  const [datosPersona, setdatosPersona] = useState(undefined)


  const [cedula, setCedula] = useState("")
  const [unsubscribeFirebase, setUnsubscribeFirebase] = useState(null);

  const customMapStyle = [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
   
    // Agrega más reglas según las capas que deseas deshabilitar
  ];



  useEffect(() => {
    // Suscribirse a la ubicación del conductor cuando el componente se monta
    console.log("NO ENTRA CUANDO RETROCEDO Y REGRESO DE NUEVO ??????????????????????????????????????????????")
    const unsubscribe = obtenerUbicacionConductorFirebase(cedula, (objLocation) => {
      setUnsubscribeFirebase(unsubscribe);
      setObjectLocation(objLocation);
    });
    return () => {
      if (unsubscribeFirebase) {
        unsubscribeFirebase();
      }
    };
  }, [cedula]);


  useEffect(() => {

    if (userLocation && regionActual) {
      mapViewRef.current.fitToCoordinates([userLocation, regionActual], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
     
    }

    if (regionActual && objectLocation) {

      console.log('calculando distancias para finalizar>>>>>>>>>>>>>>>>>>>>>>>>>>>')

      if(tipo == 1){ // CLIENTE

        var distancia = calcularDistancia(objectLocation.latitude, objectLocation.longitude, regionActual.latitude, regionActual.longitude)
      }

      if(tipo == 2){ // TIPO CONDUCTOR

        var distancia = calcularDistancia(objectLocation.latitude, objectLocation.longitude, conductorLocation.latitude, conductorLocation.longitude)

      }

      console.log('distancias obtenida--->>>')
      console.log(distancia)
  
      if(distancia._j < 100){
        cambiaEstadoEntrega(cedula, datosPedidoCliente.idPedido)
      }
  
    }



  }, [objectLocation]);  // Solo re-renderiza cuando objectLocation cambia


  useEffect(() => {
    
    if(tipo == 1){ // CLIENTE
      
      if(confirmaPedido){

        //console.log(ltsConducotresConexion)

        setCedula("0102086154")

        const { latitude, longitude } = conductorLocation
        const latitudDouble = parseFloat(latitude);
        const longitudDouble = parseFloat(longitude);

        const newUserLocation = {
          latitude: latitudDouble , 
          longitude: longitudDouble,
        };

        setUserLocation(newUserLocation);   
    

      }
    }


    
    if(tipo == 2){ // TIPO CONDUCTOR

      obtenerDatosPersona()

      //console.log("locaton conducto-----------------------------------------------")
      //console.log(conductorLocation)

      //console.log("lregion actual-----------------------------------------------")
      //console.log(primerColor + " - " + segundoColor + " - " + region + " - " + tipo + " - " + confirmaPedido + " - " + conductorLocation + " - " + cambiaEstadoEntrega + " - " + ltsConducotresConexion + " - " + actualizaDireccion + " - " + finalizaEntrega)

      //console.log('OBJETO LOCATION CICLINDRO ********************>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
      //console.log(objectLocation)


      try {
          AsyncStorage.getItem('persona').then((data) => {
            if (data != null) {
              const login = JSON.parse(data);
              setCedula(login.persona.cedula)
            }
          });
        } catch (error) {
          console.log('erro recuepera user')
          console.log(error)
      }


      if(confirmaPedido){

        const { latitude, longitude } = conductorLocation
        const latitudDouble = parseFloat(latitude);
        const longitudDouble = parseFloat(longitude);

        const newUserLocation = {
          latitude: latitudDouble , 
          longitude: longitudDouble,
        };
        setUserLocation(newUserLocation);  
      }

      
  
    }


  }, [confirmaPedido, cambiaEstadoEntrega]);  // Solo re-renderiza cuando userLocation o region cambian



  useEffect(() => {
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion(regionActual, 0); // Ajusta la duración según tus necesidades

      setTimeout(() => {
        // Obtén la posición del marcador después de la animación
        const point = { x: width / 2, y: height / 2 }; // Puedes ajustar esto según tus necesidades

        const x = point.x - 6; // Ajusta según el tamaño del marcador
        const y = point.y - 144; // Ajusta según el tamaño del marcador

        setMarkerPosition({ x, y });
      }, 100); // Ajusta el tiempo de espera según tus necesidades
    }
  }, [regionActual]);


  const centerMapOnMarker = () => {
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion({
        latitude: regionActual.latitude,
        longitude: regionActual.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };


  const toRadians = async(degrees) => {
    return degrees * (Math.PI / 180);
  }

  const calcularDistancia = async(lat1, lon1, lat2, lon2) => {

    //console.log("qqqqqqqqq----------->>>>>>>")
    //console.log(lat1)
    //console.log(lon1)
    console.log(lat2)
    console.log(lon2)

    const R = 6371.0; // Radio de la Tierra en kilómetros

    const toRadians = (angle) => (angle * Math.PI) / 180.0;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance * 1000;

  }


  const obtenerDatosPersona = () =>{

    try {
      AsyncStorage.getItem('persona').then((data) => {
        if (data != null) {
          const login = JSON.parse(data);
          
          setdatosPersona(login)
        
        }
      });
    } catch (error) {
     
      console.log('erro recuepera user')
      console.log(error)
    }


  }



  const obtenerUbicacionConductorFirebase = async (identificacion) => {
    try {

        // Obtener referencia a la colección
        const conductorRef = firestore().collection('Conductor');

        // Crear una suscripción para escuchar cambios en tiempo real
        const unsubscribe = conductorRef
            .where('identificacion', '==', identificacion)
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // Manejar los cambios en el documento
                    const conductorExistente = doc.data();
                    //console.log('Conductor existente**************:');
                    //console.log(conductorExistente);
                    //console.log('11111111111111111111111111111111--->>>>>>>>>>>>>>')
                    // Accede a los campos específicos del conductorExistente
                    const { latitude, longitude, fecha, estado } = conductorExistente;

                    var obj = {
                      latitude: latitude,
                      longitude: longitude,
                
                    }
                    console.log('que se esta seteando---*********AAAAAAAXXXX>>>>>>>>>>>>>>')
                    //console.log(obj)
                    setObjectLocation(obj);

                });
            });

        // Puedes almacenar la función de desuscripción para dejar de escuchar cambios en algún momento
        // Por ejemplo, puedes almacenarla en un estado o en una variable de referencia.
        // En este ejemplo, la función se devuelve para que puedas almacenarla y usarla más tarde.
        return unsubscribe;

    } catch (error) {
        console.log("Error al obtener conductor de Firebase");
        console.error(error);
    }
  }

  
  const handleRegionChangeComplete = (region) => {
    // Actualiza las coordenadas del marcador solo si es necesario
    if (regionActual) {

      console.log("resulta")
      console.log(region)
      setRegionActual({
        latitude: region.latitude,
        longitude: region.longitude,
      });

      if(tipo == 1){
        obtenerDireccion(region.latitude,region.longitude, region)
      }

    }


  };




  const obtenerDireccion = async (latitude, longitude, region) => {
    try {

        console.log("peticiones cada 33333333")

        console.log(region)

        //setCargando(true);
    
        let intentos = 0;
        let direccionEncontrada = false;
    
        while (!direccionEncontrada && intentos < 3) {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${YOUR_GOOGLE_MAPS_API_KEY}`
          );
    
          const data = await response.json();
    
          if (data.status === 'OK') {
            setDireccion(data.results[0].formatted_address);
            direccionEncontrada = true;
            console.log("direccionnn")
            console.log(data.results[0].formatted_address)
            actualizaDireccion(data.results[0].formatted_address, region)
            //setCargando(false);
          } else {
            console.error('Error en la solicitud:', data.status);
            intentos++;
            // Espera un momento antes de intentar nuevamente (puedes ajustar el tiempo)
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
        //setCargando(false);
      } catch (error) {
        //setCargando(false);
        console.error('Error al procesar la solicitud:', error.message);
      }
  };

  const redirigirNuevoPedido = () =>{
    setModalVisible(false)

     navigation.navigate('ListadoEventos',{dataPerson: datosPersona.persona, estadoPedido: true})

  }





  return(

    <>

      {confirmaPedido == true ? (

        <View style={{ flex: 1 }}>

        <MapView
          style={{ flex: 1 }}
          ref={mapViewRef}
          showsMyLocationButton={true}
          customMapStyle={customMapStyle}
          initialRegion={{
            latitude: regionActual ? regionActual.latitude : 0,
            longitude: regionActual ? regionActual.longitude : 0,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          zoomControlEnabled={true}
          provider={PROVIDER_LEAFLET}
          loadingEnabled={false}
          
         
        >


        {region && (
          <Marker coordinate={{ latitude: regionActual.latitude, longitude: regionActual.longitude }} title="Usuario" />
        )}


        {userLocation && (
          <Marker coordinate={userLocation} title="Conductor" />

        )}

        {objectLocation && (
          
          <Marker
            coordinate={objectLocation}
            title="Objeto"
            image={require('../../assets/imagenes/gas.png')}
            style={{ width: 30, height: 30, resizeMode: 'contain' }} // Ajusta el tamaño según tus necesidades
          />

        )}

      

        {userLocation && regionActual && (
          <MapViewDirections
            origin={userLocation}
            destination={regionActual}
            apikey={YOUR_GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor="hotpink"
            optimizeWaypoints
            onStart={(params) => {
              //console.log(`Inicio de la dirección: ${JSON.stringify(params)}`);
            }}
            onReady={(result) => {
            
              const coordinates = result.coordinates;
              //console.log('Dirección lista:', coordinates);
              setDuration(result.duration); // Establecer la duración del viaje
              
              const animationDuration = result.duration * 5000; // Convertir segundos a milisegundos
              //animateObjectAlongRoute(coordinates, animationDuration); para graficar automaticamente los puntos 
              console.log("ENTRO EN EL DIBUJA DIRECIONNNNNN---->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
              console.log("OKKKKKKKKPPPPPPP")
              //const unsubscribe = obtenerUbicacionConductorFirebase(cedula);

            
            }}
            onError={(errorMessage) => {
              //console.log(`Error al obtener direcciones: ${errorMessage}`);
            }}
          />
        )}

      
        </MapView>
        <TouchableOpacity style={styles.button} onPress={centerMapOnMarker}>
            <FontAwesome5 name="plus" size={25} color="white" />
        </TouchableOpacity>


        {duration && (
          <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
            <Text style={{color: 'black'}}>Tiempo estimado: {duration.toFixed(2)} minutos</Text>
          </View>
        )}

        
       

        </View>


      ):(

        <View style={{ flex: 1 }}>


          <MapView
            style={{ flex: 1 }}
            ref={mapViewRef}
            showsMyLocationButton={true}
            customMapStyle={customMapStyle}
            initialRegion={{
              latitude: regionActual ? regionActual.latitude : 0,
              longitude: regionActual ? regionActual.longitude : 0,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            zoomControlEnabled={true}
            provider={PROVIDER_LEAFLET}
            loadingEnabled={false}
            onRegionChangeComplete={handleRegionChangeComplete}
           
          >

        

          {tipo == 1 && ltsConducotresConexion.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: parseFloat(marker.coordenadas.latitude), longitude: parseFloat(marker.coordenadas.longitude) }}
              title={marker.distribuidor}
              image={require('../../assets/imagenes/camion.png')}
              style={{width: 30, height: 30, resizeMode: 'contain'}}
            />
          ))}





          </MapView>

          {region && tipo == 1 &&  (
            <View style={[styles.markerFixed, { top: markerPosition.y, left: markerPosition.x }]}>
              <Image
                source={require('../../assets/imagenes/marcador.png')}
                style={styles.markerIcon}
              />
            </View>
          )}

        
          <TouchableOpacity style={styles.button} onPress={centerMapOnMarker}>
            <FontAwesome5 name="plus" size={25} color="white" />
          </TouchableOpacity>


          {finalizaEntrega == true && tipo == 2 && (
              <View style={{ position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: 'white', padding: 10, borderRadius: 0 }}>
               
               <Modal
                animationType="slide"
                transparent={true}
                visible={finalizaEntrega}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
      
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      
                      <Text style={{color: 'black'}}>INFORMACIÓN DE ENTREGA</Text>
      
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <FontAwesome5 name="mixer" size={20} color="#3498db" />
                      </TouchableOpacity>
      
                    </View>
      
                    <View style={{marginTop: 10}}>
                      <Text style={{color: 'black'}}> 
                         <Text style={{color: 'blue'}}>CLIENTE:</Text> {datosPedidoCliente.nombre}{"\n"}
                         <Text style={{color: 'blue'}}>DIRECCIÓN:</Text> {datosPedidoCliente.direccion}{"\n"}
                         <Text style={{color: 'blue'}}>NRO. CILINDROS:</Text> {datosPedidoCliente.cantidad}{"\n"}
                         <Text style={{color: 'blue'}}>TELEFONO:</Text> {datosPedidoCliente.telefono}
                      
                       </Text>
                    </View>
      
                    <View style={{marginTop: 10}}>
                      <TouchableOpacity
                          onPress={() => redirigirNuevoPedido()}
                          style={{ width: '100%', backgroundColor: primerColor, marginTop: '1%', borderRadius: 20, paddingVertical: '4%' }}>
                          <Text style={{ color: segundoColor, fontSize: 14, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>Continuar</Text>
                      </TouchableOpacity>
      
                    </View>
      
                  </View>
                  
                </View>
              </Modal>
              </View>
          )}


        </View>




          
      ) }

    
    </>
    
    



  )

  function animateObjectAlongRoute(coordinates, animationDuration) {
    let startTime;
    //console.log('timepo')
    //console.log(animationDuration)
  
    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }
  
      const elapsedTime = timestamp - startTime;
      const progress = elapsedTime / animationDuration;
  
      if (progress < 1) {
        const interpolatedLocation = interpolateLocation(coordinates, progress);
        setObjectLocation(interpolatedLocation);
        requestAnimationFrame(animate);
      }else{
         cambiaEstadoEntrega()
      }
    };
  
    requestAnimationFrame(animate);
  }


  function interpolateLocation(coordinates, progress) {
    const index = Math.floor(progress * (coordinates.length - 1));
    const start = coordinates[index];
    const end = coordinates[index + 1];
    const interpolatedLatitude = start.latitude + (end.latitude - start.latitude) * progress;
    const interpolatedLongitude = start.longitude + (end.longitude - start.longitude) * progress;

    return {
      latitude: interpolatedLatitude,
      longitude: interpolatedLongitude,
    };
  }

}


const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 380,
    right: 10,
    backgroundColor: '#CDCDCD',
    padding: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
  },
  markerFixed: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  markerIcon: {
    width: 12,
    height: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
});

export default Mapa

