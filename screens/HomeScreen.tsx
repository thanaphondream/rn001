import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation, route }) => {
  const userId = route.params;
  // const storeId = route.params;
  // console.log("dd",storeId)
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [store, setStore] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  console.log(user)

  const getUser = async () => {
    try {
      const response = await axios.get(`https://f744-202-29-24-199.ngrok-free.app/api/userupdate/${userId.user.id}/`);
      setUser(response.data);
      console.log("dd", response.data.username);

      const rs = await axios.get('https://f744-202-29-24-199.ngrok-free.app/api/bookinguser/');
      setBookings(rs.data.results);

      const rsS = await axios.get(`https://f744-202-29-24-199.ngrok-free.app/api/store/`);
      setStore(rsS.data.results);
      console.log(rsS.data.results)
    } catch (err) {
      setError('Failed to fetch user data');
      console.error(err);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getUser();
    setRefreshing(false);
  };

  // Separate bookings based on status
  const pendingBookings = bookings.filter(bk => bk.status === "ยังไม่ชำระ");
  const completedBookings = bookings.filter(bk => bk.status === "ชำระแล้ว");

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View>
          <Image source={require('../imastall/a420b687c0217bfd449bfeb8014ccc8e.jpg')} style={styles.img} />
        </View>

        {user && (
          <View style={styles.profile}>
            <Image source={require('../imastall/0f287e8affb3fdda15b5f3d802848e18.jpg')} style={styles.imgprofile} />
            <Text style={styles.userInfoText}>{user.username}xxxxxx</Text>
          </View>
        )}

        <Text style={styles.poin}>คะแนน: 55</Text>
        <View style={styles.addres}>
  {store && store.length > 0 ? (
    <>
      {store.map((stores) => (
        <View key={stores.id}>
          <View style={styles.Store}>
            <Text style={styles.Text04}>{stores.name_store}</Text>
            <Text style={styles.Text05}>{stores.type_store}</Text>
          </View>
          <Text style={styles.Text06}>{stores.details_store}</Text>
        </View>
      ))}
    </>
  ) : (
    <Text style={styles.noData}>ยังไม่มีข้อมูลในตลาด</Text>
  )}
</View>
        <Text style={styles.Text011}>รายการที่ต้องชำระ</Text>
        <View style={styles.bookingView01}>
          <View style={styles.bookingview02}>
            {pendingBookings.length > 0 ? (
              pendingBookings.map(bk => (
                <View style={styles.bookingview03} key={bk.id}>
                  <View style={styles.bookingview04}>
                    <Text>{bk.markets.market_name}</Text>
                    <Text>ยอดชำระ: {bk.total_amount}฿</Text>
                    <Text style={styles.Text03}>{bk.status}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text>คุณยังไม่ทำรายการ</Text>
            )}
          </View>
        </View>

        <View style={styles.bookingView01}>
          <Text style={styles.Text01}>ประวัติทำรายการ</Text>
          <View style={styles.bookingview02}>
            {completedBookings.length > 0 ? (
              completedBookings.map(bk => (
                <View style={styles.bookingview03} key={bk.id}>
                  <View style={styles.bookingview04}>
                    <Text>{bk.markets.market_name}</Text>
                    <Text>ยอดชำระ: {bk.total_amount}฿</Text>
                    <Text style={styles.Text02}>{bk.status}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingTop: '1%',
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  img: {
    width: 500,
    height: 150,
    marginBottom: 16,
    borderRadius: 50,
  },
  imgprofile: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  profile: {
    marginTop: -140,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontWeight: 'bold',
    right: 74
  },
  poin: {
    backgroundColor: '#FFFFFF',
    width: '22%',
    borderRadius: 8,
    textAlign: 'center',
    right: 60,
    marginTop: -20

  },
  noData: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginVertical: 10,
  },
  Store: {
    flexDirection: 'row',
    left: 20
  },
  bookingView01: {
    right: '1%',
    fontWeight: 'bold',
  },
  bookingview02:{
    padding: 20,
  },
  bookingview03:{
    padding: 1,
    borderWidth: 0.2,
    width: 340,
    height: 75,
    borderRadius: 4,
    margin: 5,
  },
  bookingview04: {
    left: "5%"
  },
  addres: {
    marginTop: 21,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    height: 100,
    width: 365,
  },
  Text01: {
    fontSize: 20,
    fontWeight: 'bold',
    left: '7%'
    
  },
  Text011: {
    fontSize: 20,
    fontWeight: 'bold',
    right:'24%'
  },
  Text02: {
    backgroundColor: '#CEFFDF',
    color: '#288109',
    width: '20%',
    borderRadius: 20,
    textAlign: 'center',
    left: '70%'
  },
  Text03: {
    backgroundColor: '#FFF4CE',
    color: '#F8C100',
    width: '22%',
    borderRadius: 20,
    textAlign: 'center',
    left: '70%'
  },
  Text04:{
    fontSize: 25,
    fontWeight: 'bold',
    
  },
  Text05:{
    fontSize: 15,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    width: '20%',
    textAlign: 'center',
    padding: 5,
    left: 20,
    height: 30,
    marginTop: 5
  },
  Text06: {
    left: 10,
    padding: 10
  },
  userInfo: {
    marginBottom: 16,
  },
  userInfoText: {
    fontSize: 18,
    marginBottom: 8,
    left: 10
    
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default HomeScreen;
