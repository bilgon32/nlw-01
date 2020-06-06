import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

interface IBGEUFResponse {
  id: number,
  sigla: string,
  nome: string,
}

interface IBGECityResponse {
  id: number,
  nome: string,
}

const Home = () => {
  const [uf, setUf] = useState<String>('0');
  const [city, setCity] = useState<String>('0');

  const [ufs, setUFs] = useState<IBGEUFResponse[]>([]);
  const [cities, setCities] = useState<IBGECityResponse[]>([]);

  const navigation = useNavigation();

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
        setUFs(response.data);
    })
  }, []);

  useEffect(() => {
    if(uf === "0") {
        return;
    }

    axios
        .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(response => {
          setCities(response.data);
        })

  }, [uf]);

  function handleNavigationToPoints() {
    navigation.navigate('Points', {
      uf,
      city
    });
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>

          <RNPickerSelect
            style={styles.picker}
            placeholder={{label: 'Selecione seu estado'}}
            onValueChange={(value) => setUf(value)}
            items={ufs.map(uf => {
              return {label: uf.nome, value: uf.sigla}
            })}
          />

          <RNPickerSelect
            placeholder={{label: 'Selecione sua cidade'}}
            onValueChange={(value) => setCity(value)}
            items={cities.map(city => {
              return {label: city.nome, value: city.nome}
            })}
          />



          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },

    picker: {
      backgroundColor: '#FFF',
      alignContent: 'center'
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;