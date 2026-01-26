import { Image } from 'expo-image';
import { ImageSourcePropType } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

type Props = {
    imgSource: ImageSourcePropType;
    selectedImage? : string;
};

export default function ImageViewer({ imgSource,selectedImage }: Props) {
    const imageSource = selectedImage ? { uri: selectedImage}: imgSource
    return <Image source={imageSource} style={{ width: wp("26%"), height: wp("26%"),borderRadius:50}}/>}