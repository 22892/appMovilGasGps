import React, {useState} from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


function ModalVentana(props) {

    const { isVisible, text, color, title, primerColor, segundoColor } = props;
    const [modalVisible, setModalVisible] = useState(isVisible);

    const aceptarEvento = () =>{
      setModalVisible(false)
    }
  

    return (

        <View style={styles.container}>
       

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                
                <Text style={{color: 'black'}}>{title}</Text>

                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <FontAwesome5 name="mixer" size={20} color="#3498db" />
                </TouchableOpacity>

              </View>

              <View style={{marginTop: 10}}>
                <Text style={{color: 'black'}}> {text} </Text>
              </View>

              <View style={{marginTop: 10}}>
                <TouchableOpacity
                    onPress={() => aceptarEvento()}
                    style={{ width: '100%', backgroundColor: primerColor, marginTop: '1%', borderRadius: 20, paddingVertical: '4%' }}>
                    <Text style={{ color: segundoColor, fontSize: 14, fontFamily: 'Poppins-Light', width: '100%', textAlign: 'center' }}>Aceptar</Text>
                </TouchableOpacity>

              </View>

            </View>
            
          </View>
        </Modal>
      </View>

       
    )
}

const styles = StyleSheet.create({

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
})

export default ModalVentana