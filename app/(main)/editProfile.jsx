import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from '../../assets/icons';
import Header from '../../components/Header';
import ScreenWrapper from '../../components/ScreenWrapper';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { hp, wp } from '../../helpers/common';
import { getUserImageSrc, uploadFile } from '../../services/imageService';

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/input';
import { updateUser } from '../../services/userService';


const EditProfile = () => {

    const {user: currentUser, setUserData} = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [user, setUser] = useState({
      name: '',
      phoneNumber: '',
      image: null,
      bio: '',
      address: ''
    })
    
    useEffect(() => {

      console.log("currentUser", currentUser);
      console.log("currentUser.name", currentUser?.name);



    if (currentUser) {
      setUser({
        name: currentUser.name || '',
        phoneNumber: currentUser.phoneNumber || '',
        image: currentUser.image || null,
        address: currentUser.address || '',
        bio: currentUser.bio || '',
      });
    }
  }, [currentUser]);

      const OnPickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'] ,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
     });

      if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
      }
       
         const onSubmit = async () => {
           let userData = { ...user };
           const { name, phoneNumber, address, image, bio } = userData;

          if (!name || !phoneNumber || !address || !bio || !image)
            {
           Alert.alert('Profile', "Please fill all the fields");
             return;
          }

           setLoading(true);

              if (typeof image === 'object') {
                //upload img
               let imageRes = await uploadFile('profiles', image?.uri, true);
               if (imageRes.success) userData.image = imageRes.data;
               else userData.image = null;
                }
           //update user
           const res = await updateUser(currentUser?.id, userData);
           setLoading(false);

          if (res.success) {
            setUserData({ ...currentUser, ...userData });
            router.back();
               } else {
            Alert.alert("Error", "Failed to update profile.");
            }
          
           
        }

    let imageSource = user.image && typeof user.image == 'object'? user.image.uri : getUserImageSrc(user.image);


  
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Profile" showBackButton={true} />

          {/* form */}
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.cameraIcon} onPress={OnPickImage}>
                <Icon name="camera" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>

            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill your profile details
            </Text>

            <Input
              icon={<Icon name="user" />}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={(value) => setUser({ ...user, name: value })}
            />

            <Input
              icon={<Icon name="call" />}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={(value) =>
                setUser({ ...user, phoneNumber: value })
              }
            />

            <Input
              icon={<Icon name="location" />}
              placeholder="Enter your Address"
              value={user.address}
              onChangeText={(value) => setUser({ ...user, address: value })}
            />

            <Input
              placeholder="Enter your Bio"
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={(value) => setUser({ ...user, bio: value })}
            />

            <Button title="Update" loading={loading} onPress={onSubmit} />

          </View>
          </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  bio: {
    flexDirection: 'row',
    height: hp(15),
    alignItems: 'flex-start',
    paddingVertical: 15,
  },
});
