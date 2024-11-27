import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import useAuth from '../router/Apps';

const Profile = ({ navigation, route }) => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [store, setStore] = useState([]);
  useEffect(() => {
    const Getuser = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        const rs = await axios.get(`https://type001-qnan.vercel.app/api/me`,{
          headers: {
            Authorization: `Token ${token}`
          }
        });
        // console.log("box us  er shoew", rs.data.username, token)
        setUsers(rs.data)
        // const rsS = await axios.get(`https://f744-202-29-24-199.ngrok-free.app/api/store/`);
        // setStore(rsS.data.results);
      } catch (err) {
        console.error(`เกิดข้อผิดพลาด ${err}`);
      }
    };

    Getuser();
  });

  const editprofileline = () => {
    navigation.replace('Editprofile', user);
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              logout()
              navigation.replace('Login')
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Image source={require('../imastall/0f287e8affb3fdda15b5f3d802848e18.jpg')} style={styles.imgprofile} />
      <View>
        <Text style={styles.username}>{users.username}</Text>
        <Text>{users.email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ข้อมูลโปรไฟล์</Text>
        <TouchableOpacity style={styles.updateButton} onPress={editprofileline}>
          <Text style={styles.updateButtonText}>แก้ไข</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container01}>
        <Image source={require('../assets/user.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={users.username}
          editable={false}
        />
      </View>
      <View style={styles.container01}>
        <Image source={require('../assets/email.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={users.email}
          editable={false}
        />
      </View>
      
      {store.map((s, index) => (
        <View key={index}>
          <View style={styles.infoContainer}>
          <Text style={styles.infoTitle01}>ข้อมูลร้านค้า</Text>
          </View>
          <View style={styles.container01}>
            <Image source={require('../imastall/d7afa9b2d4c06f1faeb844bc943d76d5.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={s.name_store} // Adjust this to match your store data
              editable={false}
              placeholder="ชื่อร้านค้า"
            />
          </View>
          <View style={styles.container01}>
            <Image source={require('../imastall/0baa72f2d1097c2ca308a1c63cd36d07.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={s.name_store} // Adjust this to match your store data
              editable={false}
              placeholder="หมวดหมู่ร้านค้า"
            />
          </View>
          <View style={styles.container02}>
            <Image source={require('../imastall/5045440118067e1725f4586e9f8f123c.png')} style={styles.icon} />
            <TextInput
              style={styles.input01}
              autoCapitalize="none"
              editable={false}
              multiline={true}
              value={s.details_store} // Adjust this to match your store data
              placeholder="รายละเอียดร้านค้า"
            />
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>ออกจากระบบ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  imgprofile: {
    width: 131,
    height: 131,
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFDBDB',
    borderRadius: 80,
    width: '80%',
    height: '7%',
    borderWidth: 0.2,
  },
  infoContainer: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 15,
    right: 110
  },
  infoTitle01: {
    fontSize: 15,
    right: 10
  },
  updateButton: {
    position: 'absolute',
    top: 26,
    left: 175,
    backgroundColor: '#F8C100',
    borderRadius: 100,
    height:25,
    width:50,
    alignItems: 'center',
    padding:2,


  },
  input: {
    height: 40,
    borderColor: 'gray',
    // borderWidth: 1,
    marginBottom: 16,
    borderRadius: 15,
    padding: 10,
    width: 300,
    color: '#F8C100'
  },
  input01: {
    height: 80,
    borderColor: 'gray',
    // borderWidth: 1,
    marginBottom: 16,
    borderRadius: 15,
    padding: 10,
    width: 300,
    color: '#F8C100'
  },
  container01: {
    borderWidth: 0.2,
    flexDirection: 'row',
    borderRadius: 5,
    height: 42,
    marginTop: 3
  },
  container02: {
    borderWidth: 0.2,
    flexDirection: 'row',
    borderRadius: 5,
    height: 90,
    marginTop: 3
  },
  updateButtonText: {
    color: '#000000',
    fontFamily:"Anuphan-Regular",
    marginHorizontal: 3,
    fontSize: 14,
  },
  // infoBox: {
  //   borderWidth: 1,
  //   borderColor: '#F4F4F4',
  //   borderRadius: 20,
  //   paddingHorizontal: 24,
  //   paddingBottom: 4,
  //   minHeight: 10,
  //   marginTop:25,
  //   borderColor: '#D9D9D9',
  // },
  // infoItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 10,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#F4F4F4',
  //   paddingVertical: 5,
  // },
  // info: {
  //   marginTop:14,

  // },
  // infoText: {
  //   marginTop:-10,
  //   height: 42,
  //   borderColor: '#ddd',
  //   borderRadius: 15,
  //   paddingHorizontal: 18,
  //   justifyContent: 'center',
  //   lineHeight: 45,
  //   fontSize:16,
  //   fontFamily:"Anuphan-Regular",
  //   // borderBottomWidth: 1,
  //   // borderBottomColor: '#ccc',
  //   // marginBottom: 10, 
    
  
  // },
  logoutButtonText: {
    color: '#BD0101',
    fontSize: 16,
    textAlign: 'center'
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 2,
    marginTop: 10,
    left: 5,
  },
  username: {
    textAlign: 'center'
  }
});

export default Profile;
