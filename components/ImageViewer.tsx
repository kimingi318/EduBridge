import { Image } from 'expo-image';
import { ImageSourcePropType } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

type Props = {
    imgSource: ImageSourcePropType;
    selectedImage? : string;
};

export default function ImageViewer({ imgSource,selectedImage }: Props) {
    const imageSource = selectedImage ? { uri: selectedImage}: imgSource
    return <Image source={imageSource} style={{ width: wp(24), height: hp(12),borderRadius:50,marginLeft:wp(2), marginVertical:hp(1)}}/>}