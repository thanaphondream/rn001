import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Button, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Payment = ({ route }) => {
    const [payments, setPayments] = useState({});
    const { userId, booking, amount } = route.params;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [remainingTime, setRemainingTime] = useState(30 * 60); // 30 minutes in seconds
    const navigation = useNavigation();
    const [data1, setData] = useState({
        status: 'ชำระแล้ว'
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    navigation.navigate('bootom'); 
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const postPayment = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log(token)
  
        if (!booking || !amount || !selectedDate) {
          console.error('Missing required fields');
          return;
        }
  
        const formData = new FormData();
        formData.append('bookingId', booking);
        formData.append('amount', 10.0);
        formData.append('status', 'pending');
        formData.append('date', format(selectedDate, 'yyyy-MM-dd'));
    
        if (selectedPhoto && selectedPhoto.uri) {
          formData.append('payment_image', {
            uri: selectedPhoto.uri,
            type: 'image/jpeg',
            name: 'photo.jpg',
          });
        } else {
          console.warn('No photo selected');
        }
    
        console.log('FormData:', formData);
    
        const rs = await axios.post(
          'https://type001-qnan.vercel.app/api/paymet',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
          }
        );
    
        setPayments(rs.data);
        console.log('Payment Response:', rs.data);
    
        const data1 = {
          status: 'ชำระแล้ว',
        };
    
        const rs1 = await axios.put(
          `https://type001-qnan.vercel.app/api/booking/updeat/status/${booking}/`,
          data1,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
    
        // Handle the response for the booking update
        setData(rs1.data.results);
        console.log('Booking Update Response:', rs1.data.results);
    
        // Navigate to the bottom tab after successful operations
        navigation.navigate('bootom');
      } catch (err) {
        // Improved error logging with details
        if (err.response) {
          console.error('Server Error:', err.response.data);
        } else if (err.request) {
          console.error('No response received:', err.request);
        } else {
          console.error('Error config:', err.message);
        }
      }
    };

    const selectPhotoTapped = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'We need permission to access your photos to proceed.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 1,
        });

        if (!result.cancelled) {
            const selectedPhoto = result.assets[0];
            if (selectedPhoto.fileSize <= 200 * 1024 * 1024) {
                setSelectedPhoto(selectedPhoto);
            }
        }
    };

    const handleConfirm = (date) => {
        setSelectedDate(date);
        setDatePickerVisibility(false);
    };

    const downloadImage = async () => {
        try {
            const imageUri = require('../imastall/61330463b9f097ac4b59973feea2b4b1.png');
            const { uri: imagePath } = Image.resolveAssetSource(imageUri);
            console.log(imageUri, imagePath);

            const uri = FileSystem.documentDirectory + 'downloaded_image.png';
            console.log(uri);

            const downloadResumable = FileSystem.createDownloadResumable(
                imagePath,
                uri,
                {},
                (downloadProgress) => {
                    const progress = (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100;
                    console.log(`Downloaded: ${progress.toFixed(2)}%`);
                }
            );

            const { uri: localUri } = await downloadResumable.downloadAsync();

            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'We need permission to access your photos to proceed.');
                return;
            }

            const asset = await MediaLibrary.createAssetAsync(localUri);
            await MediaLibrary.createAlbumAsync('Download', asset, false);

            Alert.alert('Download complete', 'Image saved to photo library');
        } catch (error) {
            console.error(error);
            Alert.alert('Download failed', 'There was an error downloading the image.');
        }
    };

    return (
        <View style={styles.mainContainer}>
          <ScrollView style={styles.container}>
            <Text style={styles.Text01}>ยอดชำระ</Text>
            <Text style={styles.Text02}>{amount}</Text>
            <View>
              <Text style={styles.textDate}>ชำระภายใน: {formatTime(remainingTime)}</Text>
            </View>
            <Image source={require('../imastall/61330463b9f097ac4b59973feea2b4b1.png')} style={styles.image01} />
            <TouchableOpacity onPress={downloadImage} style={styles.downloadContainer}>
              <Icon name="download" size={20} color="#000" />
              <Text style={styles.downtext}>บันทึก QR Code</Text>
            </TouchableOpacity>
            <View style={styles.Inputtext}>
              <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.lockContainer}>
                <Text>วันที่และเวลาโอน</Text>
                <View style={styles.lockContainer01}>
                  <Image source={require('../imastall/9266d28493082cca887df22c79595185.png')} style={styles.image02} />
                  <Text>{format(selectedDate, 'dd/MM/yyyy')}</Text>
                </View>
              </TouchableOpacity>
              <Text>จำนวนเงินที่โอน</Text>
              <View style={styles.lockContainer01}>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  value={amount}
                  editable={false}
                />
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => setDatePickerVisibility(false)}
              />
              <Text>หลักฐานในการโอน</Text>
              <View style={[styles.fieldSet2]}>
                <View style={styles.imagePreviewContainer}>
                  {selectedPhoto ? (
                    <TouchableOpacity onPress={selectPhotoTapped}>
                      <Image source={{ uri: selectedPhoto.uri }} style={styles.image} />
                      <Text style={styles.textupphotos4}>กดรูปภาพเพื่อเปลี่ยนรูปภาพ</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.uploadButton} onPress={selectPhotoTapped}>
                      <Text>+อัปโหลดรูปภาพ</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={postPayment}>
            <Text style={styles.buttonText}>ดำเนินการแจ้งชำระ</Text>
          </TouchableOpacity>
        </View>
      );
    };
    

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
      },
      container: {
        flex: 1,
        padding: 20,
      },
    Text01: {
      fontSize: 18,
      textAlign: 'center'
    },
    Text02: {
      fontSize: 60,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    Inputtext: {
        padding: 10,
        backgroundColor: '#F3F3F4',
    },
    image02: {
        width: 22,
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'cover',
        left: 7,
       
      },
    input:{
        // marginBottom: 16,
        // borderRadius: 15,
        // padding: 10,
        
    },
    image01: {
      width: '90%',
      height: 375, 
    },
    fieldSet2: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    textDate: {
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 18,
        padding: 12
    },
    lockContainer: {
        marginBottom: 8,
        // borderBottomColor: 'black',
        // borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        borderRadius: 4,
        flexDirection: 'row',
        gap: 8
    }, lockContainer01: {
        marginBottom: 8,
        // borderBottomColor: 'black',
        // borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        borderRadius: 4,
        flexDirection: 'row',
        gap: 10,
        backgroundColor: '#FFFFFF',
        padding: 2
    },
    imagePreviewContainer: {
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    downloadContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    downtext:{
        textAlign: 'center',
        left: 10,
        fontSize: 20
    },
    textupphotos4: {
        textAlign: 'center',
    },
    uploadButton: {
        alignItems: 'center',
    },
    detailsContainer: {
        padding: 20,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#FFB703',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        width: '90%',
        justifyContent: 'center',
        margin: 'auto',
      },
      buttonText: {
        color: '#000000',
        fontSize: 16,

      },
});

export default Payment;
