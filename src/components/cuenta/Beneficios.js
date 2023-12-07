import React, {useState} from 'react'
import { View, ScrollView, StyleSheet, Image, SafeAreaView} from 'react-native';
import { Text, Card, Button, Icon, Divider } from '@rneui/themed';
import { PieChart } from "react-native-gifted-charts";

function Beneficios(props){

  const { primerColor, segundoColor } = props.route.params

  const [cliente, setCliente] = useState({
    cli_nombre: "Pedro Julian",
    cli_apellido: "Alvarez Rodriguez",
    cli_correo: "pedro@gmail.com",
  });

  const pieData = [
    {value: 54, color: '#177AD5', text: '54'},
    {value: 40, color: '#79D2DE', text: '30'},
  ];

  const renderLegend = (text, color) => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <View
          style={{
            height: 18,
            width: 18,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || 'white',
          }}
        />
        <Text style={{color: 'white', fontSize: 16}}>{text || ''}</Text>
      </View>
    );
  };


  return(
    <SafeAreaView style={{flex: 1, backgroundColor: '#E3E3E3', height: '100%', width: '100%', marginTop: '5%'}}>
      <ScrollView>
        <View >

          <Card containerStyle={styles.containerCard} >
            <Card.Title>Resumen</Card.Title>
            <Card.Divider />
            <View style={styles.dividerContainer1}>
              <Text style={styles.title}>Información Personal</Text>
              <Divider style={styles.divider} />
            </View>
            <View style={{paddingLeft: 10}}>
              <Text>
                Nombres: {cliente.cli_nombre}
              </Text>
              <Text>
                Apellido: {cliente.cli_apellido}
              </Text>
              <Text>
                Correo: {cliente.cli_correo}
              </Text>
            </View>
            <View style={styles.dividerContainer}>
              <Text style={styles.title}>Metodo Pago</Text>
              <Divider style={styles.divider} />
            </View>
            <View>
            <View style={{paddingLeft: 10}}>
              <Text>
                Tarjeta: GDSHDDS67676HCDH
              </Text>
            </View>

            </View>
          </Card>

          <Card containerStyle={styles.containerCard} >
            <Card.Title>Puntos Acumulados</Card.Title>
            <Card.Divider />
            <View style={{
             
              marginHorizontal: 30,
              borderRadius: 10,
              paddingVertical: 20,
              backgroundColor: '#E3E3E3',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              
              <Text
                style={{
                  color: 'black',
                  fontSize: 22,
                  fontWeight: 'bold',
                  marginBottom: 12,
                }}>
                Porcentajes
              </Text>

              <PieChart
                strokeColor="white"
                strokeWidth={4}
                donut
                data={[
                  {value: 30, color: 'rgb(84,219,234)'},
                  {value: 40, color: 'lightgreen'},
                  {value: 20, color: 'orange'},
                ]}
                innerCircleColor="#414141"
                innerCircleBorderWidth={4}
                innerCircleBorderColor={'white'}
                showValuesAsLabels={true}
                showText
                textSize={18}
                showTextBackground={true}
                centerLabelComponent={() => {
                  return (
                    <View>
                      <Text style={{color: 'white', fontSize: 36}}>90</Text>
                      <Text style={{color: 'white', fontSize: 18}}>Total</Text>
                    </View>
                  );
                }}
              />

              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginTop: 20,
                }}>
                {renderLegend('Pagos', 'rgb(84,219,234)')}
                {renderLegend('Servicio', 'lightgreen')}
                {renderLegend('Uso', 'orange')}
              </View>

            </View>
          </Card>

        </View>
        
      </ScrollView>
      

    </SafeAreaView>
  )

}

const styles = StyleSheet.create({

  containerCard: {
    borderRadius: 20,
    elevation: 10,
    overflow: 'hidden'
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  dividerContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 16,
  },
  title: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
})

export default Beneficios