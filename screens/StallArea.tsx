import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const StallArea = ({ route }) => {
  const  userId  = route.params
  const [market, setMarket] = useState([]);
  const navigation = useNavigation();
  const user = userId.user.id
  // console.log(user)

  useEffect(() => {
    const getMarket = async () => {
      try {
        const response = await axios.get(
          'https://f744-202-29-24-199.ngrok-free.app/api/markets/',
          {
            headers: {
              Authorization: 'Token 3110b82b454bcd20ba4740bf00ef832aad02f9b9',
            },
          }
        );
        setMarket(response.data.results);
      } catch (error) {
        console.error('Error fetching markets:', error);
      }
    };

    getMarket();
  }, []);

  const handlePress = (id, market_name) => {
    navigation.navigate('Lock', { id, user , market_name})
    // navigation.navigate('Lock', { market_name });
  };



  return (
   <View style={styles.stallv1}>
     <View style={styles.container}>
      <View style={styles.stallstart}>
        <Text style={styles.stallText}>ล็อกขายของ</Text>
      </View>
      <View style={styles.mutView}>
        <Image source={require('../imastall/bbfe9468989ef8935d3246f252e53e1c.png')} style={styles.imagemud} />
        <Text style={styles.mudtext}>จังหวัดขอนแก่น</Text>
      </View>
      <View style={styles.markestart}>
        {market && market.length > 0 ? (
          market.map((item) => (
            <TouchableOpacity key={item.id} style={styles.marketContainer} onPress={() => handlePress(item.id, item.market_name)}>
              <Image source={require('../imastall/530e9386a4eef5d0e8d3fdf62b92aaa4.png')} style={styles.image} />
              <Text style={styles.marketName}>{item.market_name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No markets available</Text>
        )}
      </View>
    </View>
   </View>
  );
};

const styles = StyleSheet.create({
  stallv1: {
    justifyContent: 'center',
  },
  stallstart: {
    paddingTop: '3%',
    marginBottom: '2%',
    width: '45%',
    right: '5%'
  },
  stallText: {
    fontSize: 25,
    fontWeight: 'bold',
    top: '10%',
  },
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: '2%',
  },
  markestart: {
    paddingTop: '3%',
    width: '95%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 4
  },
  marketContainer: {
    borderWidth: 0.4,
    borderRadius: 6,
    width: '30%',
    marginRight: '3%',
    marginBottom: '2%',
    justifyContent: 'flex-start',
  },
  marketName: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 100 / 110,
    resizeMode: 'cover',
    borderRadius: 5, 
  },
  imagemud: {
    width: '10%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  mudtext: {
    fontSize: 15,
    marginLeft: '2%',
  },
  mutView: {
    paddingTop: '3%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    width: '30%',
    padding: '2%',
    borderRadius: 8,
    margin: '5%',
    shadowColor: '#000',
    shadowRadius: 1,
    left: '10%',
    justifyContent: 'center',
  },
});

export default StallArea;
