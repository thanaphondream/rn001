import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Booking = ({ route }) => {
  const { lockIds,id, user, bookingDates, market_name } = route.params;
  // console.log('gddsssss', market_name)
  const navigation = useNavigation();
  const [locks, setLocks] = useState([]);
  const electricityFee = 50.00;
  const discount = 0.0;
  console.log("dd",lockIds)
  // const [ bookingsF, setBookingF ] = useState([])

  const [bookings, setBookings] = useState({
    booking_date: bookingDates,
    total_amount: 0,
    discount: discount,
    lock: lockIds,
    user: user,
    status: 'ยังไม่ชำระ',
    markets: id
  });

  useEffect(() => {
    const getLocks = async () => {
      try {
        const lockRequests = lockIds.map((lockId) =>
          axios.get(`https://f744-202-29-24-199.ngrok-free.app/api/lockzon/${lockId}/`, {
            headers: {
              Authorization: 'Token 3110b82b454bcd20ba4740bf00ef832aad02f9b9',
            },
          })
        );

        const lockResponses = await Promise.all(lockRequests);
        const lockData = lockResponses.map((response) => response.data);
        setLocks(lockData);
        console.log("Dd",locks)

        const totalLockPrice = lockData.reduce((sum, lock) => sum + parseFloat(lock.lock_price), 0);
        console.log(totalLockPrice)
        // const totalAmount = (totalLockPrice + electricityFee - discount).toFixed(2);
        const totalAmount = (totalLockPrice  - discount + 50).toFixed(2);
        console.log("ddss",lockData, totalAmount)

        setBookings((prevBookings) => ({
          ...prevBookings,
          total_amount: totalAmount/2 ,
        }));

        // const rs = await axios.get('https://f744-202-29-24-199.ngrok-free.app/api/booking/')
        // setBookingF(rs.data)
        // console.log(rs.data)
      } catch (err) {
        console.log('Error fetching lock data:', err);
      }
    };

    getLocks();
  }, [lockIds, electricityFee, discount]);

  const handleBooking = async () => {
    try {
      console.log(bookings)
      const response = await axios.post('https://f744-202-29-24-199.ngrok-free.app/api/bookings01/', bookings, {
        headers: {
          Authorization: 'Token 3110b82b454bcd20ba4740bf00ef832aad02f9b9',
        },
      });
      console.log(response.data);
      navigation.navigate('Payment', {booking: response.data.id, user, amount: response.data.total_amount}  );


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
        <Text style={styles.market}>{market_name}</Text>
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
  market: {
    backgroundColor: '#F8C100',
    fontSize: 22,
    borderRadius: 20,
    width: '35%',
    textAlign: 'center',
    right: 98,
    marginTop: 20
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
    marginBottom: 8,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 100
    // padding: 8,
  },
  lockContainer02: {
    marginBottom: 8,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 195

  },
  lockContainer03: {
    marginBottom: 8,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 185
  },
  lockContainer04: {
    marginBottom: 8,
    borderColor: '#ccc',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 155,

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
    display: 'flex',
    flexDirection: 'row',
    gap: 30
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FFB703',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: 175
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  button02: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F8C100',
    // backgroundColor: '#FFB703',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: 175
  },
  buttonText02: {
    color: '#F8C100',
    fontSize: 16,
  },

});

export default Booking;
