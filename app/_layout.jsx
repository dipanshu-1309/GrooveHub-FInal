import { Stack, useRouter } from 'expo-router'

import { useEffect } from 'react'
import { LogBox } from 'react-native'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserdata } from '../services/userService'




 LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer', 'Warning: MemoizedTNodeRenderer','Warning: TRenderEngineProvider'])
const _layout = ()=> {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}

const MainLayout =() => {

const {setAuth, setUserData} = useAuth();
const router = useRouter();

useEffect(()=>{
supabase.auth.onAuthStateChange((_event, session) => {
console.log('session user ',session?.user?.id);


if (session){
  //set auth
  //move to home screen

setAuth(session?.user);
updateUserData(session?.user, session?.user?.email);
// console.log('auth user: ', session?.user?.email);

       router.replace('/home');
}else{
  // set auth null
  //move to welcome screen

   setAuth(null);
  router.replace('/welcome');
} 
    

 })
},[])

 const updateUserData = async (user, email) => {
    let res = await getUserdata(user?.id);

    
  if(res.success) setUserData(...res.data,email);
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }    

      }
    >
    <Stack.Screen
        name="(main)/postDetails"
        options={{
          presentation: 'modal'
        }}
        />
        </Stack>
  )
}

export default _layout

