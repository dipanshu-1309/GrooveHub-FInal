import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Avatar from '../../components/Avatar'
import Header from '../../components/Header'
import RichTextEditor from '../../components/RichTextEditor'
import ScreenWrapper from '../../components/ScreenWrapper'
import { theme } from '../../constants/theme'
import { useAuth } from '../../contexts/AuthContext'
import { hp, wp } from '../../helpers/common'


const NewPost =()=> {

  const {user} = useAuth();
  const bodyRef = useRef("")
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Create Post" />
          <ScrollView contentContainerStyle={{gap: 20}}>
            {/*avatar */}
            <View style={styles.header}>
              <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}/> 
            

            <View style={{gap:2}}>
                <Text style={styles.username}>
                  {
                    user && user.name
                  }

                </Text>
                <Text style={styles.publicText}>
                    Public
                </Text>
              </View>
            </View>

            <View style={styles.textEditor}>
                <RichTextEditor eeditorRef={editorRef} onChange={body=> bodyRef.current = body}
                />
            </View>

          </ScrollView>
        </View>
        </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  username:{
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  container: {
    flex:1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:15
  },
  file: {
    height: hp(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous'
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'rgba(255,0,0,0.6)'
  }
})