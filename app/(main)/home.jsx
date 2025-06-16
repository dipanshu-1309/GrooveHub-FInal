import { Alert, Button, Text } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const Home = () => {

  const{user, setAuth} = useAuth();
  console.log('userrrrrrr: ',user);
  
const onLogout = async ()=>{
    //setAuth(null);
    const {error} = await supabase.auth.signOut();
    if(error){
      Alert.alert('Sign out', "Error signing out!")
    }
  }

  
  return (
    <ScreenWrapper>
      <Text>Home</Text>
      <Button title="logout" onPress={onLogout} />
    </ScreenWrapper>
  )
}

export default Home
