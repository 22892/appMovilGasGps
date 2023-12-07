import React, {useState, useEffect} from 'react';
import { View, Text, Dimensions, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, FlatList, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Button, CheckBox, Stack } from '@rneui/themed';
import ListadoEventos from './ListadoEventos';

const { height, width } = Dimensions.get('window');

const porcentaje = (porcentaje) => {
  return (width * porcentaje) / 100;
};

const porcentajeHeigt = (por) => {
  return (height * por) / 100;
};




function Home(props){

  const {navigation} = props
  const { dataEventos, primerColor, segundoColor } = props.route.params
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    // Simula una carga asíncrona
    setTimeout(() => {
      setModalVisible(true);
    }, 2000); // ajusta el tiempo según tus necesidades
  }, []);



  const listaEventoCarro = () => {
    if (dataEventos.length > 0) {
  
        return (
            <View style={{ width: '100%', backgroundColor: 'white' }}>
                <ListadoEventos dataEventos={dataEventos} />
  
            </View>
        )
    }
  
  }

  const aceptarEvento = () =>{

  }
  


  return (
    <SafeAreaView style={styles.container}>
     

      <View style={{ width: '100%', backgroundColor: '#F0F0F0' }}>

        {listaEventoCarro()}

      </View>

      <View style={styles.container2}>
       

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                
                <Text style={{color: 'black'}}>Notificación</Text>

                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <FontAwesome5 name="mixer" size={20} color="#3498db" />
                </TouchableOpacity>

              </View>

              <View style={{marginTop: 10}}>
                <Text style={{color: 'black'}}>Tiene un nuevo evento desea solicitarlo: </Text>
              </View>

              <View style={{marginTop: 10}}>
                <TouchableOpacity
                    onPress={() => aceptarEvento()}
                    style={{ width: '100%', backgroundColor: primerColor, marginTop: '1%', borderRadius: 20, paddingVertical: '4%' }}>
                    <Text style={{ color: segundoColor, fontSize: 14, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>Aceptar Notificación</Text>
                </TouchableOpacity>

              </View>

            </View>
            
          </View>
        </Modal>
      </View>

      

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D6D6D6',
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  container2: {
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

export default Home;
