import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useRef, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from '../assets/icons'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Input from '../components/input'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import { supabase } from '../lib/supabase'

const Login=()=> {
  const router = useRouter();
  const emailRef= useRef("");
  const nameRef= useRef("");
  const passwordRef = useRef("")
  const[loading,setLoading] = useState(false)

  const onSubmit = async () =>{
    if(!emailRef.current || !passwordRef.current){
      Alert.alert('Login,',"please fill all the fields!");
      return;
    }

    let name = nameRef.current.trim(); 
    let email = emailRef.current.trim();  
    let password = passwordRef.current.trim();
    
    setLoading(true);
     const {data: {session}, error} = await supabase.auth.signUp({
       email,
       password,
       options :{
          data: {
            name
          }
       }
     });

     setLoading(false);

     console.log('session: ', session);
     console.log('error: ',error);
     if(error){
      Alert.alert('Sign up',error.message)
     }
    
    
  }

  
  return (
       <ScreenWrapper bg="white">
    <StatusBar style="dark" />
    <View style={styles.container}>
      <BackButton router={router}/> 

      {/* welcome text */}
      <View>
      <Text style={styles.welcomeText}>Let's</Text>
      <Text style={styles.welcomeText}>Get Started</Text>
      </View>
      {/*form*/}
      <View style={styles.form}>
      <Text style={{fontSize: hp(1.5), color: theme.colors.text}}>
        Please fill the details to create an account
        </Text>
        <Input  
            icon={<Icon name="user" size={26} strokeWidth={1.6}/>}
            placeholder="Enter your Name"
            onChangeText={value=>{nameRef.current = value}}
            />
        <Input  
            icon={<Icon name="mail" size={26} strokeWidth={1.6}/>}
            placeholder="Enter your email"
            onChangeText={value=>{emailRef.current = value}}
            />
        <Input  
            icon={<Icon name="lock" size={26} strokeWidth={1.6}/>}
            placeholder="Enter Your Password"
            secureTextEntry
            onChangeText={value=>{passwordRef.current = value}}
            />      
        {/*Button*/}   
        <Button title='Sign up' loading={loading} onPress={onSubmit} />
      </View>

      {/*footer*/}

      <View style={styles.footer}>
       <Text style={styles.footerText}> Already Have an account!
       </Text>
       <Pressable onPress={()=>router.push('login')}>
        <Text style={[styles.footerText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>Login</Text>
       </Pressable>
      </View>
    </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
container: {
    flex:1,
    gap:45,
    paddingHorizontal: wp(5),
},
welcomeText:{
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color:theme.colors.text,
},
form: {
    gap: 25,
},
forgotPassword:{
    textAlign:'right',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
},
footer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap:5
},
footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6)
}
})
