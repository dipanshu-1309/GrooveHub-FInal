import { useRouter } from 'expo-router';
import { Button, Text } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';


const Index = () => {
  const router = useRouter();
  return (
   <ScreenWrapper>
    <Text>Index</Text>
    <Button title="welcome" onPress={()=> router.push('welcome')} />
   </ScreenWrapper>
  )
}

export default Index;
