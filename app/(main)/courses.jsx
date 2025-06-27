import { StyleSheet, Text, View } from 'react-native'
import Header from '../../components/Header'
import ScreenWrapper from '../../components/ScreenWrapper'
import { wp } from '../../helpers/common'


const Courses = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Courses" />
        <View style={styles.contentWrapper}>
          <Text style={styles.textStyle}>Coming Soon...</Text>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Courses

const styles = StyleSheet.create({
  container: {
      flex:1,
      marginBottom: 30,
      paddingHorizontal: wp(4),
      gap: 15,
    },
    contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: wp(8),
    fontWeight: 'bold',
    textAlign: 'center',
  },
})