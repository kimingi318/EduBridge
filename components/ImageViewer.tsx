import { Image } from 'expo-image';
import { ImageSourcePropType } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

type Props = {
    imgSource: ImageSourcePropType;
    selectedImage? : string | null;
    localImage?: any;
};

export default function ImageViewer({ imgSource,selectedImage,localImage }: Props) {
    let imageSource = imgSource
    if(localImage){
        imageSource = { uri: localImage.uri};
    } else if ( selectedImage){
        imageSource = { uri: selectedImage};
    }
    
    return <Image source={imageSource} style={{ 
        width: wp(24), 
        height: hp(12),
        backgroundColor: "#fff",
        borderRadius:50,
        marginLeft:wp(2), 
        marginVertical:hp(1)}}/>}