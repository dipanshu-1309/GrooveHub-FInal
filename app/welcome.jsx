import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'

const welcome = ()=> {

const router = useRouter();

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
        <View style={styles.container}>
          {/* welcome image*/}
        <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/welcome.png')}/>

          {/*title */}
          <View style={{ gap:20}}>
            <Text style={styles.title}>Hop On!</Text>
            <Text style={styles.punchline} >Step into the rhythm, share your story!</Text>
          </View>

          {/* footer*/}
          <View style={styles.footer}>
          <Button title='Getting Started'
          buttonStyle={{marginHorizontal: wp(3)}}
          onPress={()=>router.push('signup')}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>
              Already have an account
            </Text>
            <Pressable onPress={()=>router.push('login')}>
              <Text style={[styles.loginText,{color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>
                Login
              </Text>
            </Pressable>
          </View>
          </View>
        </View>
    </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingHorizontal: wp(4)
  },
  welcomeImage: {
    width: wp(100),    
    height: hp(40), 
    alignSelf: 'center'  
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: 'center',
    fontWeight:theme.fonts.extraBold
  },
  punchline: {
    textAlign: 'center',
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
    color: theme.colors.text
  },
  footer: {
    gap:30,
    width: '100%'
  },
  
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  loginText:{
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6)
  }
})