import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, TextInput } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { set } from 'date-fns';

const Editprofile = ({ navigation, route }) => {
  const user = route.params;
  const [username, setUsername] = useState(user.user.username);
  const [email, setEmail] = useState(user.user.email);
  const [store, setStore] = useState({
    name_store: "",
    type_store: "",
    details_store: ""
  });
  const [storeId, setStoreId] = useState([]); 

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://f744-202-29-24-199.ngrok-free.app/api/store/');

        await Promise.all(storeId.map(async (m) => {
          console.log(m)
        }))

        setStoreId(response.data.results)
        console.log("ddaa",storeId)

        storeId.forEach(m => {
          console.log('Store ID:', m.id, user.user.id);
          const existingStore = m.find(storeItem => storeItem.id === m.id);

          console.log(`Store found:`, existingStore);
        });

      } catch (error) {
        console.log(`Error fetching store data: ${error}`);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      let storeIdToReturn = null; // Variable to hold the ID of the newly created store, if any
  
      const storeData = {
        name_store: store.name_store,
        type_store: store.type_store,
        details_store: store.details_store,
        user: user.user.id
      };
  
      await Promise.all(storeId.map(async (m) => {
        console.log('Store ID:', m.id);
  
        if (m.id) {
          await axios.put(`https://f744-202-29-24-199.ngrok-free.app/api/storeput/${m.id}/`, storeData, {
            headers: {
              Authorization: 'Token 3110b82b454bcd20ba4740bf00ef832aad02f9b9',
            }
          });
        } else {
          console.log('ddaa111')
           const storeResponse = await axios.post('https://f744-202-29-24-199.ngrok-free.app/api/storeput/', storeData, {
        headers: {
          Authorization: 'Token 3110b82b454bcd20ba4740bf00ef832aad02f9b9',
        }
      });
      // setStoreId(storeResponse.data);
      
          
        }
      }));

      // const storeResponse = await axios.post('https://f744-202-29-24-199.ngrok-free.app/api/storeput/', storeData, {
      //   headers: {
      //     Authorization: 'Token 3110b82b454bcd20ba4740bf00ef832aad02f9b9',
      //   }
      // });
      // setStoreId(storeResponse.data);
      
      // Update user profile
      await axios.put(`https://f744-202-29-24-199.ngrok-free.app/api/userupdate/${user.user.id}/`, {
        username,
        email,
      }, {
        headers: {
          Authorization: 'Token 3110b82b454bcd20ba4740bf00ef832aad02f9b9',
        }
      });
  
      navigation.replace("bootom", { ...user, storeId: storeIdToReturn });
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
        <View style={styles.container}>
          <Image source={require('../imastall/0f287e8affb3fdda15b5f3d802848e18.jpg')} style={styles.imgprofile} />
          <View>
            <Text style={styles.username}>{username}</Text>
            <Text>{email}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>ข้อมูลโปรไฟล์</Text>
          </View>

          <View style={styles.container01}>
            <Image source={require('../assets/user.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="ชื่อโปรไฟล์"
            />
            {username.length > 0 && (
              <TouchableOpacity onPress={() => setUsername('')} style={styles.clearButton}>
                <MaterialIcons name="cancel" size={20} color="gray" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.container01}>
            <Image source={require('../assets/email.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="อีเมล"
            />
            {email.length > 0 && (
              <TouchableOpacity onPress={() => setEmail('')} style={styles.clearButton}>
                <MaterialIcons name="cancel" size={20} color="gray" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>ข้อมูลร้านค้า</Text>
          </View>
          <View style={styles.container01}>
            <Image source={require('../imastall/d7afa9b2d4c06f1faeb844bc943d76d5.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={store.name_store}
              onChangeText={(text) => setStore({ ...store, name_store: text })}
              placeholder="ชื่อร้านค้า"
            />
          </View>

          <View style={styles.container01}>
            <Image source={require('../imastall/0baa72f2d1097c2ca308a1c63cd36d07.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={store.type_store}
              onChangeText={(text) => setStore({ ...store, type_store: text })}
              placeholder="หมวดหมู่ร้านค้า"
            />
          </View>

          <View style={styles.container02}>
            <Image source={require('../imastall/5045440118067e1725f4586e9f8f123c.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={store.details_store}
              onChangeText={(text) => setStore({ ...store, details_store: text })}
              placeholder="รายละเอียดร้านค้า"
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>
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


  },clearButton: {
    padding: 10
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
    // fontFamily:"Anuphan-Regular",
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
  },nextButton: {
    marginTop: 20,
    backgroundColor: '#FFB703',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  }, button: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FFB703',
    padding: 16,
    borderRadius: 20,
    width: '85%'
  },
  saveButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
});

export default Editprofile;
