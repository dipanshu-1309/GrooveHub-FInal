import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

  const [user,setUser] = useState(null);

  // const setAuth = authUser => {
  //   setUser(authUser);
  // }


  //this will flattenUser so you don't have to use  for example : currentUser.user_metadata?.name  instead you can directly use  currentUser.name
  
    const setAuth = (authUser) => {
    const flattenedUser = {
      ...authUser,
      ...authUser?.user_metadata, // this flattens metadata like name, bio, etc.
    };
    setUser(flattenedUser);
  };
  
  const setUserData = userData => {
    setUser({...userData});
  }

  return (
    <AuthContext.Provider value={{user, setAuth, setUserData}}>    
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);  