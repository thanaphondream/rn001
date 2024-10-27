import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

const LockScreen = ({ route }) => {
  const { id, user, market_name } = route.params;
  console.log(id, user, market_name)
  const [locks, setLocks] = useState([]);
  const [zones, setZones] = useState([]);
  const [groupedLocks, setGroupedLocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLocks, setSelectedLocks] = useState([]);
  const [bookingDates, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [lockAvailability, setLockAvailability] = useState({});
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchLocksAndZones = async () => {
      try {
       const zoneRepost = await axios.get(`https://type001-qnan.vercel.app/api/zone/${id}`)
       setZones(zoneRepost.data)
        console.log(zoneRepost.data)
      } catch (error) {
        console.error('Failed to fetch locks and zones:', error);
        Alert.alert('Error', 'Failed to fetch locks and zones');
      } finally {
        setLoading(false);
      }
    };

    fetchLocksAndZones();
  }, [id]);



  const handleConfirm = (date) => {
    setSelectedDate(date);
    const formattedDate = format(date, 'yyyy-MM-dd');
    setBookingDate(formattedDate);
    setDatePickerVisibility(false);
  };

  
  const LockButton01 = (lock ) => {
    console.log(577777,bookingDates)

    if(lock.id){
      if(bookingDates){
        return(
          <View style= { styles.View02}>
             <Text style={styles.circle01}>{lock.lock_name}</Text>
          </View>
        )
      }
    }
   
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleSearch = (text) => {
    setSearchText(text)
  };

 

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
        {zones.map(zone=> (
          <View key={zone.id}>
              <Text>{zone.zone}</Text>
              {
                zone.Lock.map(m => (
                  <View>
                    {/* <Text>{m.lock_name}</Text> */}
                    { LockButton01(m) }
                  </View>
                ))
              }
          </View>
        ))}
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
