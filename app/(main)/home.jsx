import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '../../assets/icons';
import Avatar from '../../components/Avatar';
import ScreenWrapper from '../../components/ScreenWrapper';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { hp, wp } from '../../helpers/common';
import { fetchPosts } from '../../services/postService';

import Loading from '../../components/Loading';
import PostCard from '../../components/PostCard';
import { supabase } from '../../lib/supabase';
import { getUserdata } from '../../services/userService';

import { useFocusEffect } from '@react-navigation/native';


let limit = 0;
const Home = () => {



const { refresh } = useLocalSearchParams();

useFocusEffect(
  useCallback(() => {
    if (refresh === 'true') {
      fetchPosts(); 
    }
  }, [refresh])
);


  const{user, setAuth} = useAuth();
  const router = useRouter();
  
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const handlePostEvent =async (payload) =>{
    console.log('payload:', payload);
    

     if(payload.eventType == 'INSERT' && payload?.new?.id){
       let newPost = {...payload.new};
       let res = await getUserdata(newPost.userId);

      newPost.postLikes = [];
      newPost.comments = [{count: 0}]; 
      newPost.user = res.success? res.data: {};
       setPosts(prevPosts=>[newPost, ...prevPosts]);
     } 

    if(payload.eventType=='DELETE' && payload.old.id){
      setPosts(prevPosts=>{
        let updatedPosts= prevPosts.filter(post=> post.id!=payload.old.id);
        return updatedPosts;
      })
    } 
  }


  useEffect(()=>{

     let postChannel= supabase
       .channel('posts')
       .on('postgres_changes', {event:'*', schema:'public', table:'posts'}, handlePostEvent)
       .subscribe();


    // getPosts();

       return ()=>{
         supabase.removeChannel(postChannel);
       }
  },[])

  const getPosts = async()=>{
    //call tha api here
    if(!hasMore) return null;
    limit = limit + 10;

    console.log('fetching posts: ',limit);
    
    let res = await fetchPosts(limit);
    if(res.success){
      if(posts.length == res.data.length) setHasMore(false);
      setPosts(res.data);
      }
    }
  
  
  return (
   <ScreenWrapper>
     <View style={styles.container}>
        {/*header */}
        <View style={styles.header}>
          <Text style={styles.title}>GrooveHub</Text>
          <View style={styles.icons}>
            <Pressable onPress={()=>router.push('courses')}>
              <Icon name="courses" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={()=>router.push('newPost')}>
              <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={()=>router.push('profile')}>
              <Avatar
                  uri={user?.image}
                  size={hp(4.3)}
                  rounded={theme.radius.sm}
                  style={{borderWidth: 2}}
              />
            </Pressable>
          </View>
        </View>

        <FlatList
        data={posts}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={item=> item.id.toString()}
        renderItem={({item}) => <PostCard
            item={item}
            currentUser={user}
            router={router}
            />
      } 
      onEndReached={()=>{
        getPosts();
        
      }}
      ListFooterComponent={hasMore? ( 
         <View style={{marginVertical: posts.length==0? 200: 30}}>
         <Loading />
        </View>
   ):(
     <View style={{marginVertical: 30}}>
       <Text style={styles.noPosts}>No more Posts</Text>
     </View>
   )}
      />
        
        </View>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
      flex: 1,
      //paddingHorizontal: wp(4)
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      marginHorizontal: wp(4)
  },
  title: {
      color: theme.colors.text,
      fontSize: hp(3.2),
      fontWeight: theme.fonts.bold
  },
  avatarImage: {
      height: hp(4.3),
      width: hp(4.3),
      borderRadius: theme.radius.sm,
      borderColor: theme.colors.gray,
      borderWidth: 3,
      borderCurve: 'continuous'
  },
  icons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap:18  
  },
noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text
},
pill: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight
},
pillText: {
    color: 'white',
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold
},
listStyle:{
  paddingTop:20,
  paddingHorizontal: wp(4)
}
});
