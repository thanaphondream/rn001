import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

const LockScreen = ({ route }) => {
  const { id, user, market_name } = route.params;
  const [locks, setLocks] = useState([]);
  const [zones, setZones] = useState([]);
  const [bookings, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookingDates, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
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
          headers: {
            Authorization: `Token your-token-here`,
          },
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
  };

  const renderLockButton = (lock, booking, booking1) => {
    const formattedDate = format(booking.booking_date, 'yyyy-MM-dd');
    const isAvailable = bookingDates !== formattedDate;
    if(booking1.id === lock.id) {
      if(isAvailable) {
        return (
          <View style={[styles.lockButton, styles.available]}>
            <Text style={styles.lockButtonText}>{lock.lock_name}</Text>
          </View>
        );
      }else{
        return (
          <View style={[styles.lockButton, styles.unavailable]}>
            <Text style={styles.lockButtonText}>{lock.lock_name}</Text>
          </View>
        );
      }
    
    }
    return (
      <View style={[styles.lockButton, styles.available]}>
        <Text style={styles.lockButtonText}>{lock.lock_name}</Text>
      </View>
    );
  };

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
              {zone.Lock.map((lock) =>
                bookings.map((booking) => booking.lock.map(booking1 => renderLockButton(lock, booking, booking1)))
              )}
            </View>
          </View>
        ))}
      </ScrollView>
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
    backgroundColor: '#DFF0D8',
    borderColor: '#A9DFBF',
  },
  unavailable: {
    backgroundColor: '#FADBD8',
    borderColor: '#F5B7B1',
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
});

export default LockScreen;
