 import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabaseUrl } from '../constants';
import { supabase } from '../lib/supabase';
//import * as ImagePicker from 'expo-image-picker';


export const getUserImageSrc = imagePath => {
  if(imagePath){
    return getSupabseFileUrl(imagePath);
  } else {
    return require('../assets/images/defaultUser.jpg');
  }
}

 export const getSupabseFileUrl = filePath => {
   if(filePath){
    return {uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`}
  }
  return null;
  }

  export const downloadFile = async(url)=>{
    try{
        const {uri} = await FileSystem.downloadAsync(url, getLocalFilePath(url))
        return uri;
    }catch(error){
      return null;
    }
  }

  export const getLocalFilePath = filePath =>{
    let fileName = filePath.split('/').pop();
    return `${FileSystem.documentDirectory}${fileName}`;
  }



export const uploadFile = async(folderName, fileUri, isImage=true)=> {
   try{
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64});
      
    let imageData= decode(fileBase64); //array buffer
    let{data,error} = await supabase
     .storage 
     .from('uploads')
     .upload(fileName, imageData, {
       cacheControl: '3600',
       upsert: false,
       contentType: isImage? 'image/*': 'video/*'
    });
    if (error){
     console.log('filer upload error: ', error);
        return {success: false, msg: 'Could not upload media'};
     }

    return {success: true, data: data.path}
   }catch(error){
    console.log('filer upload error: ', error);
    return {success: false, msg: 'Could not upload media'};
    
  }
 }

export const getFilePath = (folderName, isImage) => {
  return `/${folderName}/${(new Date()).getTime()}${isImage? '.png': '.mp4' }`;
  //profile/979878689.png or
  //images/1232432.png
}