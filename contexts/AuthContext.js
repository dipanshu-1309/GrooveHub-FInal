// import { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({children}) => {

//   const [user,setUser] = useState(null);

//   // const setAuth = authUser => {
//   //   setUser(authUser);
//   // }


//   //this will flattenUser so you don't have to use  for example : currentUser.user_metadata?.name  instead you can directly use  currentUser.name
  
//     const setAuth = (authUser) => {
//     const flattenedUser = {
//       ...authUser,
//       ...authUser?.user_metadata, // this flattens metadata like name, bio, etc.
//     };
//     setUser(flattenedUser);
//   };
  
//   const setUserData = userData => {
//     setUser({...userData});
//   }

//   return (
//     <AuthContext.Provider value={{user, setAuth, setUserData}}>    
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext);  


import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getUserdata } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const setAuth = (authUser) => {
    const flattenedUser = {
      ...authUser,
      ...authUser?.user_metadata,
    };
    setUser(flattenedUser);
  };

  const setUserData = (userData) => {
    setUser({ ...userData });
  };

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔁 Auth change detected:', session?.user?.id);

      if (session?.user) {
        setAuth(session.user);
        const res = await getUserdata(session.user.id);
        if (res.success) {
          setUserData({ ...res.data, email: session.user.email });
        }
        router.replace('/home');
      } else {
        setAuth(null);
        router.replace('/welcome');
      }
    });

    // ✅ Cleanup on unmount to avoid "subscribe multiple times" warning
    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
