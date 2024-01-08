import React, {useState, useEffect, useRef} from 'react'
import { View, Text, Image, Button, StyleSheet, TouchableOpacity} from 'react-native'
import Loading from '../../utils/Loading';
import MapView, {Marker, PROVIDER_LEAFLET} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HttpPost, HttpGet, HttpPatch, HttpPostSinBody } from '../../utils/httpApi';
import {url} from '../../utils/url'


function Mapa(props){


  const { primerColor, segundoColor, region, tipo, confirmaPedido, conductorLocation, cambiaEstadoEntrega, ltsConducotresConexion } = props;

  //const { primerColor, segundoColor, region, tipo } = props.route.params
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [YOUR_GOOGLE_MAPS_API_KEY, setApiKey] = useState("AIzaSyC8nFlMFGcAT3At__bZzkAN2oScMgudn8k");
  const [objectLocation, setObjectLocation] = useState(null);
  const mapViewRef = useRef(null);
  const [duration, setDuration] = useState(null);
  const urlApi = url()


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

    if (userLocation && region) {
      mapViewRef.current.fitToCoordinates([userLocation, region], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
     
    }


  }, [objectLocation, region]);  // Solo re-renderiza cuando objectLocation cambia


  useEffect(() => {


    
    console.log("cunatas veces ingresa")
    console.log(confirmaPedido)
    console.log(tipo)
    
    if(tipo == 1){ // CLIENTE
      
      if(confirmaPedido){

        console.log("punrtss")
        console.log(ltsConducotresConexion)
       
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

      console.log("locaton")
      console.log(conductorLocation)

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



  const centerMapOnMarker = () => {
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };




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
            latitude: region ? region.latitude : 0,
            longitude: region ? region.longitude : 0,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          zoomControlEnabled={true}
          provider={PROVIDER_LEAFLET}
          loadingEnabled={false}
          
         
        >


        {region && (
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="Conductor" />
        )}


        {userLocation && (
          <Marker coordinate={userLocation} title="Usuario" />

        )}

        {objectLocation && (
          
          <Marker
            coordinate={objectLocation}
            title="Objeto"
            image={require('../../assets/imagenes/gas.png')}
            style={{ width: 30, height: 30, resizeMode: 'contain' }} // Ajusta el tamaño según tus necesidades
          />

        )}

      

        {userLocation && region && (
          <MapViewDirections
            origin={userLocation}
            destination={region}
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
              animateObjectAlongRoute(coordinates, animationDuration);
              //animateObjectAlongRoute(coordinates);
            
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
              latitude: region ? region.latitude : 0,
              longitude: region ? region.longitude : 0,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            zoomControlEnabled={true}
            provider={PROVIDER_LEAFLET}
            loadingEnabled={false}
           
           
          >

          {region && (
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="Ubicación Actual" />
          )}


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
          <TouchableOpacity style={styles.button} onPress={centerMapOnMarker}>
            <FontAwesome5 name="plus" size={25} color="white" />
          </TouchableOpacity>
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
});

export default Mapa

