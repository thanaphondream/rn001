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
  const [groupedLocks, setGroupedLocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLocks, setSelectedLocks] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('');
  const [bookingDates, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [lockAvailability, setLockAvailability] = useState({});
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchLocksAndZones = async () => {
      try {
        const [locksResponse, zonesResponse] = await Promise.all([
          axios.get('https://f744-202-29-24-199.ngrok-free.app/api/look/', {
            headers: {
              Authorization: 'Token 3110b82b454bcd20ba4740bf00ef832aad02f9b9',
            },
          }),
          axios.get('https://f744-202-29-24-199.ngrok-free.app/api/zone/', {
            headers: {
              Authorization: 'Token 3110b82b454bcd20ba4740bf00ef832aad02f9b9',
            },
          }),
        ]);
        const filteredLocks = locksResponse.data.results.filter(lock => lock.markets_id === id);
        setLocks(filteredLocks);
        setZones(zonesResponse.data.results);

        const grouped = {};
        filteredLocks.forEach(lock => {
          const zone = zonesResponse.data.results.find(z => z.id === lock.zone)?.zone || 'Unknown';
          if (!grouped[zone]) {
            grouped[zone] = [];
          }
          grouped[zone].push(lock);
        });
        setGroupedLocks(grouped);
      } catch (error) {
        console.error('Failed to fetch locks and zones:', error);
        Alert.alert('Error', 'Failed to fetch locks and zones');
      } finally {
        setLoading(false);
      }
    };

    fetchLocksAndZones();
  }, [id]);

  useEffect(() => {
    if (locks.length > 0) {
      checkAllLocksAvailability(bookingDates); 
    }
  }, [locks, bookingDates]);

  const handleConfirm = (date) => {
    setSelectedDate(date);
    const formattedDate = format(date, 'yyyy-MM-dd');
    setBookingDate(formattedDate);
    setDatePickerVisibility(false);
  };

  const checkAllLocksAvailability = async (date) => {
    const availability = {};
    for (const lock of locks) {
      try {
        const response = await axios.get('https://f744-202-29-24-199.ngrok-free.app/api/booking/', {
          headers: {
            Authorization: 'Token 3110b82b454bcd20ba4740bf00ef832aad02f9b9',
          },
          params: {
            booking_date: date,
            lock: lock.id,
          },
        });

        const isBooked = response.data.results.some(item => item.booking_date === date && item.lock.includes(lock.id) && item.status === 'ชำระแล้ว');
        availability[lock.id] = !isBooked;
      } catch (error) {
        console.error(`Failed to check availability for lock ${lock.lock_name}:`, error);
      }
    }
    setLockAvailability(availability);
  };

  const toggleLockSelection = (lock) => {
    const isSelected = selectedLocks.some(selectedLock => selectedLock.id === lock.id);
    if (isSelected) {
      setSelectedLocks(selectedLocks.filter(selectedLock => selectedLock.id !== lock.id));
    } else {
      setSelectedLocks([...selectedLocks, lock]);
    }
  };

  const LockButton = ({ lock, zone }) => {
    const isAvailable = lockAvailability[lock.id];
    const isSelected = selectedLocks.some(selectedLock => selectedLock.id === lock.id);
    return (
      <TouchableOpacity
        style={[styles.lockButton, isAvailable ? styles.available : styles.unavailable, isSelected && styles.selected]}
        onPress={() => isAvailable && toggleLockSelection(lock)}
        disabled={!isAvailable}
      >
        <Text style={styles.lockButtonText}>{`ล็อก ${lock.lock_name}${zone}`}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const totalPrice = selectedLocks.reduce((total, lock) => total + parseFloat(lock.lock_price), 0);

  return (
    <View style={styles.container}>
      <View style={styles.View01}>
        <Text>รายการล็อก วันที่ </Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setDatePickerVisibility(true)}>
          <Image source={require('../imastall/9266d28493082cca887df22c79595185.png')} style={styles.image01} />
          <Text style={styles.datePickerButtonText}>{format(selectedDate, 'dd/MM/yyyy')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container01}>
        <TextInput
          style={styles.input}
          placeholder="ค้นหา..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <View style={styles.View04}>
        {Object.keys(groupedLocks).map(zone => (
          <View key={zone}>
            <View style={styles.View02}>
              <Text style={styles.zoneHeader}>{`โซน ${zone}`}</Text>
              <View style={styles.View03}><Text style={styles.circle01}></Text><Text> ว่าง  </Text><Text style={styles.circle02}></Text><Text> ไม่ว่าง </Text></View>
            </View>
            <View style={styles.lockGrid}>
              {groupedLocks[zone].map(lock => (
                <LockButton key={lock.id} lock={lock} zone={zone} />
              ))}
            </View>
          </View>
        ))}
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
          <View style={styles.bookingSummary}>
            <Text style={styles.Textbooking01}></Text>
            <Text style={styles.label}>{`ราคาสำหรับ ${selectedLocks.length} ล็อก: ${totalPrice} บาท`}</Text>
            {bookingStatus && <Text>สถานะการจอง: {bookingStatus}</Text>}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => selectedLocks.length > 0 && navigation.navigate('Booking', { lockIds: selectedLocks.map(lock => lock.id), id, user, bookingDates, market_name })}
            >
              <Text style={styles.button}>ถัดไป</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  View01: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '4%',
  },
  datePickerButton: {
    left: '2%',
    borderWidth: 0.4,
    flexDirection: 'row',
    borderRadius: 5,
    marginVertical: 1,
    alignItems: 'center',
    width: '34%',
    color: 'black',
  },
  image01: {
    width: '15%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  container01: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
    height: '7%',
    // borderWidth: 0.4,
  },
  input: {
    borderWidth: 1,
    paddingLeft: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    borderColor: '#cccccc',
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  View02: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  View03: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle01: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#faf0c8',
  },
  circle02: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f4edeb',
  },
  View04: {
    marginTop: 20,
    // borderWidth: 0.4,
    flex: 1,
    flexGrow: 1,
  },
  zoneHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  lockGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lockButton: {
    padding: 10,
    alignItems: 'center',
    width: '30%',
    margin: 5,
    borderRadius: 5,
  },
  available: {
    backgroundColor: '#faf0c8',
  },
  unavailable: {
    backgroundColor: '#f4edeb',
  },
  selected: {
    borderColor: 'blue',
    borderWidth: 2,
  },
  lockButtonText: {
    color: '#5c5b58',
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
