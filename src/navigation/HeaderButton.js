import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Text, FlatList, Modal, View, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Divider } from '@rneui/themed';
import Perfil from '../components/cuenta/Perfil';

import { useNavigation } from '@react-navigation/native';

const HeaderButton = ({ onPress, title, dropdownVisible, primerColor, segundoColor }) => {

    

    useEffect(() => {

       
        
    }, []);   


    const navigation = useNavigation();
    const [isDropdownVisible, setDropdownVisible] = useState(dropdownVisible);  
    
    const cambio = () =>{
        setDropdownVisible(true)
    }

    const onClose = () =>{
        setDropdownVisible(false)
    }

    const dropdownOptions = [
        { codigo: 1, title: 'PERFIL', icono: 'user' },
        { codigo: 2, title: 'HISTORIAL', icono: 'file-excel' },
        // Agrega más opciones según sea necesario
    ];
    
    const regresaPerfil = () =>{
        console.log('recibo perfil')
        setDropdownVisible(false)
    }
    


    const handleDropdownClose = (item) => {
        console.log(item.codigo)

        if(item.codigo == 1){

            console.log(navigation)
           
            navigation.navigate('Perfil', {primerColor: primerColor, segundoColor: segundoColor, regresaPerfil: regresaPerfil})

        }
    };
    

  return (
    <TouchableOpacity onPress={cambio} style={{ marginRight: 10 }}>
        <FontAwesome5 name="bars" size={25} color="#D8D8D8" />
        {isDropdownVisible && (
       <Modal
       transparent
       animationType="slide"
       visible={isDropdownVisible} // Puedes manejar la visibilidad del modal con un estado
     >
       <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
         <View style={{ backgroundColor: '#CACACA', padding: 20 }}>
           <FlatList
             data={dropdownOptions}
             keyExtractor={(item) => item.title}
             renderItem={({ item }) => (

               <TouchableOpacity onPress={() => handleDropdownClose(item)} style={{ paddingVertical: 10 }}>

                    <View style={{flexDirection: 'row'}}>
                        <FontAwesome5 name={item.icono} size={25} color="#6B9EAA" />

                        <Text style={{marginLeft: '5%', color: 'black'}}>{item.title}</Text>

                    </View>
                    <Divider style={styles.divider} />

               </TouchableOpacity>
               

             )}
           />
           <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
             <Text style={{ color: 'red' }}>CERRAR</Text>
           </TouchableOpacity>
         </View>
       </View>
     </Modal>
        )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

    divider: {
      flex: 1,
      height: 1,
      backgroundColor: 'gray',
      marginVertical: 16,
    }
  })
  

export default HeaderButton;