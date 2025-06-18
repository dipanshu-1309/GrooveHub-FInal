import { Video } from 'expo-av';
import { Image } from 'expo-image';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import Icon from '../assets/icons';
import { theme } from '../constants/theme';
import { hp, stripHtmlTags, wp } from '../helpers/common';
import { downloadFile, getSupabseFileUrl } from '../services/imageService';
import { createPostLike, removePostLike } from '../services/postService';
import Avatar from './Avatar';
import Loading from './Loading';

 const textStyle = {
   color: theme.colors.dark,
   fontSize: hp(1.75)
 };

 const tagsStyles = {
   div: textStyle,
   p: textStyle,
   ol: textStyle,
   h1: {
     color: theme.colors.dark
   },
   h4:{
       color: theme.colors.dark

  }
 }

 const PostCard = ({
   item,
   currentUser,
   router,
   hasShadow = true,
 }) => {
     const shadowStyles = {
       shadowOffset: {
         width:0,
         height:2
       },
       shadowOpacity: 0.06,
       shadowRadius: 6,
       elevation: 1
     }

      const [likes, setLikes] = useState([]);
      const[loading,setLoading]= useState(false);
      useEffect(()=>{
        setLikes(item?.postLikes);
       },[])
       
        const openPostDetails =() =>{
    router.push({pathname: 'postDetails', params: {postId: item?.id}})
      }

const onLike = async()=>{
  if(liked){
    //remove the like
        let updatedLikes = likes.filter(like=> like.userId!=currentUser?.id)
        setLikes([...updatedLikes])
        let res = await removePostLike(item?.id, currentUser?.id);
        console.log('removed like: ',res);
        if(!res.success){
          Alert.alert('Post', 'Something Went Wrong');
        }
  }
  else {
    //create the like
    let data= {
          userId: currentUser?.id,
          postId: item?.id
        }
        setLikes([...likes, data])
        let res = await createPostLike(data);
        console.log('Added like: ',res);
        if(!res.success){
          Alert.alert('Post', 'Something Went Wrong');
        }
  }
 
}

  const onShare= async()=>{
    let content = {message: stripHtmlTags(item?.body)};
    if(item?.file){
      //download the file then share the local uri
      setLoading(true);
      let url = await downloadFile(getSupabseFileUrl(item?.file).uri);
      setLoading(false);
      content.url = url; 
    }
    Share.share(content);
  }



   const createdAt= moment(item?.created_at).format('MMM D');
    const liked = likes.filter(like=> like.userId==currentUser?.id)
    [0]? true: false; 

  return (
  
     <View style={[styles.container, hasShadow && shadowStyles]}>

       <View style={styles.header}>
         {/*user info and post time */}
         <View style={styles.userInfo}>
         <Avatar
         size={hp(4.5)}
         uri={item?.user?.image}
         rounded={theme.radius.md} />
        <View style={{gap: 2}}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
         
         </View>
              <TouchableOpacity onPress={openPostDetails}>
           <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth ={3} colors={theme.colors.text} />
         </TouchableOpacity>
        </View>
           {/*post body & media*/}
        <View style={styles.content}>
           <View style={styles.postBody}>
           {
             item?.body && (
               <RenderHtml
                 contentWidth={wp(100)}
                 source={{html: item?.body}} 
                 tagsStyles={tagsStyles}
                 />
             )
           }
         </View>

          {/*post image */}
        {
          item?.file && item?.file?.includes('postImages') && (
            <Image
              source={getSupabseFileUrl(item?.file)}
              transition={100}
              style={styles.postMedia}
              contentFit='cover'
              />
          )
        }
        {/* post video */}
        {
          item?.file&& item?.file?.includes('postVideos') && (
            <Video
              style={[styles.postMedia, {height: hp(30)}]}
              source={getSupabseFileUrl(item?.file)}
              useNativeControls
              resizeMode='cover'
              isLooping
              />
          )
        }
          {/*like, comment, share */}
      <View style={styles.footer}>
      <View style={styles.footerButton}>
        <TouchableOpacity onPress={onLike}>
          <Icon name="heart" size={24} fill={liked? theme.colors.rose: 'transparent'} color={liked? theme.colors.rose : theme.colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.count}>
          {
            likes?.length
          }
        </Text>
      </View>

      <View style={styles.footerButton}>
        <TouchableOpacity onPress={openPostDetails}> 
          <Icon name="comment" size={24} color={ theme.colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.count}>
          {
            0
          }
        </Text>
      </View>

      <View style={styles.footerButton}>
          {
            loading? (
              <Loading size="small"/>
            ):(
                    <TouchableOpacity onPress={onShare}>
          <Icon name="share" size={24} color={theme.colors.textLight} />
        </TouchableOpacity>
        
            )
          }


  
      </View>


      </View>
        </View>
     </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl*1.1,
    borderCurve: 'continuous',
    padding: 10,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: '#000'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  postMedia: {
    height: hp(40),
    width: '100%',
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous'
  },
  footerButton:{
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8)
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  postBody: {
    marginLeft:5
  },
  content: {
    gap: 10,
    //marginBottom: 10,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
})