import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Booking = ({ route }) => {
  const { lockIds,id, userId, bookingDates, market_name } = route.params;
  console.log('gddsssss',lockIds,id, userId, bookingDates, market_name )
  const navigation = useNavigation();
  const [locks, setLocks] = useState([]);
  const electricityFee = 50.00;
  const discount = 0.0;
  console.log("dd",lockIds)

  const [bookings, setBookings] = useState({
    booking_date: bookingDates,
    total_amount: 0,
    discount: 11,
    lockIds: lockIds,
    userId: userId,
    status: 'ยังไม่ชำระ',
    marketId: id
  });

  useEffect(() => {
    const getLocks = async () => {
      try {
        const lockRequests = lockIds.map((lockId) =>
          axios.get(`https://type001-qnan.vercel.app/api/locks/${lockId}`)
        );
        const lockResponses = await Promise.all(lockRequests);
        const lockData = lockResponses.map((response) => response.data);
        // console.log("jjjjjjjj",lockResponses.map((l)=> l.data),lockData)
        setLocks(lockData);
  
        const totalLockPrice = lockData.reduce((sum, lock) => {
          return lock && lock.lock_price ? sum + parseFloat(lock.lock_price) : sum;
        }, 0);
  
        const totalAmount = (totalLockPrice - discount + electricityFee).toFixed(2);
        setBookings((prevBookings) => ({
          ...prevBookings,
          total_amount: totalAmount / 2,
        }));
      } catch (err) {
        console.log('Error fetching lock data:', err);
      }
    };
  
    getLocks();
  }, [lockIds, electricityFee, discount]);

  const handleBooking = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const response = await axios.post('https://type001-qnan.vercel.app/api/booking/', bookings,{
        headers: {
          Authorization: `Token ${token}`
        }
      });
      // console.log("Bokk",response.data.bookings.id);
      
      navigation.navigate('Payment', {booking: response.data.bookings.id, userId, amount: response.data.bookings.total_amount}  );


    } catch (err) {
      console.log(err);
    }
  };
  const Details = () => {
    return(
      <View>
          <Text style={styles.detailsText}>ล็อกประจำวัน    {bookingDates}</Text>
          <Text style={styles.detailsText}>จังหวัดขอนแก่น</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={ styles.marketView}>
        <Text style={styles.market}>{market_name}</Text>
        </View>
        <Text style={styles.header}>รายการจอง</Text>
        <View style={styles.conbooking}>
        {locks.map((lock, index) => (
            <View key={index} style={styles.lockContainer}>
              <Text style={styles.lockText}>โซน {lock.zone.zone} ล็อกที่ {lock.zone.zone}{lock.lock_name} </Text>
              <Text style={styles.lockText}> {lock.lock_price}฿</Text>
            </View>
          ))}
          <View style={styles.lockContainer02}>
          <Text style={styles.feeText}>ค่าไฟ</Text>
          <Text style={styles.feeText}>{electricityFee}฿</Text>
          </View>
          <View style={styles.lockContainer03}>
          <Text style={styles.discountText}>ส่วนลด</Text>
          <Text style={styles.discountText}>{discount}฿</Text>
          </View>
          <View style={styles.lockContainer04}>
          <Text style={styles.totalText}>ยอดชำระ</Text>
          <Text style={styles.totalText}>{bookings.total_amount}฿</Text>
          </View>
        </View>
        <View style={styles.conbooking01}>
        <Text style={styles.detailsText01} onPress={Details}>รายละเอียดเพิ่มเติม</Text>
        {Details()}
        </View>
      </ScrollView>
      <Text style={styles.Textbooking01}></Text>
      <Text style={styles.Textbooking}>ยอดชำระ มัดจำจอง: {bookings.total_amount}฿</Text>
      <View style={styles.Viewbutton02}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button02}>
        <Text style={styles.buttonText02}>แก้ไขข้อมูล</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBooking} style={styles.button}>
        <Text style={styles.buttonText}>ยืนยันข้อมูล</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
   marketView: {
    width: 'auto',
    textAlign: 'center',
    right: 2,
    marginRight: "auto",
    left: '10%'
   },
  market: {
    backgroundColor: '#F8C100',
    fontSize: 22,
    borderRadius: 20,
    marginTop: 20,
    paddingHorizontal: 15
  },
  conbooking: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    padding: 16,
    marginBottom: 16,
    width: '90%',
  },
  header: {
    fontSize: 17,
    right: 120,
    marginTop: 20
  },
  lockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  lockContainer02: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',

  },
  lockContainer03: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  lockContainer04: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: 'black',
    borderColor: '#ccc',

  },
  Text01: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: -20
  },
  lockText: {
    fontSize: 18,
  },
  feeText: {
    fontSize: 18,
    marginBottom: 8,
  },
  conbooking01: {
    right: 70
  },

  discountText: {
    fontSize: 18,
    marginBottom: 8,
  },
  totalText: {
    fontSize: 18,
    color: '#F8C100',
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 4,
  },
  detailsText01: {
    fontWeight: 'bold',
  },
  Textbooking: {
    textAlign: 'right',
    fontSize: 16,
    marginVertical: 10,
  },
  Textbooking01: {
    borderBottomColor: '#a8a8a8',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  Viewbutton02: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    marginTop: 20, 
  },
  button: {
    backgroundColor: '#FFB703',
    paddingVertical: 15, 
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1, 
    marginHorizontal: 5, 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  button02: {
    borderWidth: 1,
    borderColor: '#F8C100',
    paddingVertical: 15, 
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flex: 1, 
    marginHorizontal: 5, 
  },
  buttonText02: {
    color: '#F8C100',
    fontSize: 16,
  },
});

export default Booking;
