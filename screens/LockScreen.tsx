import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

const LockScreen = ({ route }) => {
  const { id, userId, market_name } = route.params;
  console.log("user", userId)
  const [locks, setLocks] = useState([]);
  const [zones, setZones] = useState([]);
  const navigation = useNavigation()
  const [bookings, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingDates, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedLocks, setSelectedLocks] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchLocksAndZones = async () => {
      try {
        const zoneResponse = await axios.get(`https://type001-qnan.vercel.app/api/zone/${id}`);
        setZones(zoneResponse.data);
      } catch (error) {
        console.error('Failed to fetch locks and zones:', error);
        Alert.alert('Error', 'Failed to fetch locks and zones');
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      try {
        const bookingResponse = await axios.get('https://type001-qnan.vercel.app/api/bookings', {
          headers: { Authorization: `Token your-token-here` },
        });
        setBooking(bookingResponse.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    fetchLocksAndZones();
    fetchBookings();
  }, [id]);

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setBookingDate(format(date, 'yyyy-MM-dd'));
    setDatePickerVisibility(false);
  }

  const toggleLockSelection = (lock) => {
    const isSelected = selectedLocks.some(selectedLock => selectedLock.id === lock.id);
    if (isSelected) {
      setSelectedLocks(selectedLocks.filter(selectedLock => selectedLock.id !== lock.id));
    } else {
      setSelectedLocks([...selectedLocks, lock]);
    }
  };

  const totalPrice = selectedLocks.length * 100;
  const bookingStatus = ''; 

  const renderLockButton = (lock) => {
    const shownLockIds = new Set();
    bookings.forEach((booking) => {
      booking.lock.forEach((booking1) => {
        if (booking1.id === lock.id && bookingDates === format(booking.booking_date, 'yyyy-MM-dd')) {
          shownLockIds.add(lock.id);
        }
      });
    });

    const isAvailable = !shownLockIds.has(lock.id);

    return (
      <TouchableOpacity
        key={lock.id}
        style={[styles.lockButton, isAvailable ? styles.available : styles.unavailable]}
        onPress={() => isAvailable && toggleLockSelection(lock)}
        disabled={!isAvailable}
      >
        <Text style={styles.lockButtonText}>{lock.lock_name}</Text>
      </TouchableOpacity>
    );
  };

  const bookitLink = () => {
    if (selectedLocks.length > 0) {
      navigation.navigate('Booking', {
        lockIds: selectedLocks.map(lock => lock.id),
        id,
        userId,
        bookingDates,
        market_name,
      });
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>รายการล็อก วันที่ </Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setDatePickerVisibility(true)}>
          <Image source={require('../imastall/9266d28493082cca887df22c79595185.png')} style={styles.imageIcon} />
          <Text style={styles.datePickerButtonText}>{format(selectedDate, 'dd/MM/yyyy')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหา..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <ScrollView style={styles.zonesContainer}>
        {zones.map((zone) => (
          <View key={zone.id} style={styles.zone}>
            <Text style={styles.zoneHeader}>{zone.zone}</Text>
            <View style={styles.lockGrid}>
              {zone.Lock.map((lock) => renderLockButton(lock))}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bookingSummary}>
        <Text style={styles.label}>{`ราคาสำหรับ ${selectedLocks.length} ล็อก: ${totalPrice} บาท`}</Text>
        {bookingStatus && <Text>สถานะการจอง: {bookingStatus}</Text>}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => bookitLink()}
        >
          <Text >ดำเนินการต่อ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  imageIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  searchContainer: {
    marginVertical: 10,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    fontSize: 16,
  },
  zonesContainer: {
    flexGrow: 1,
  },
  zone: {
    marginBottom: 15,
  },
  zoneHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  lockGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lockButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  available: {
    backgroundColor: '#faf0c8',
    borderColor: '#faf0c8',
  },
  unavailable: {
    backgroundColor: '#f4edeb',
    borderColor: '#f4edeb',
  },
  lockButtonText: {
    fontSize: 14,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingSummary: {
    marginTop: 20,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#FFB703',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  button: {
    color: '#fff',
    fontSize: 16,
  },

  Textbooking01: {
    borderBottomColor: '#a8a8a8',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'right'
  },
});

export default LockScreen;
