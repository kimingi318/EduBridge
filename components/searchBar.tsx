import { darkTheme, lightTheme } from "@/utils/colors";
import { Ionicons } from '@expo/vector-icons';
import { TextInput, View, useColorScheme } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const SearchBar = () => {
    const scheme = useColorScheme();
    const theme = scheme === "dark" ? darkTheme : lightTheme; 
  return (

     <View  className="mt-6 rounded-full flex-row items-center px-4"
     style={{height: hp(6), width: wp(100),backgroundColor: theme.card}}>
              <Ionicons name="search" size={20} color={theme.text} />
              <TextInput
                placeholder="Search classes, lecturers, rooms..."
                placeholderTextColor={theme.subText}
                className="flex-1 ml-2 "
                style={{fontSize: hp(2),color: theme.text}}
                onChangeText={()=>{}}
              />
              <Ionicons name="mic-outline" size={20} color={theme.text} />
    </View>

  )
}

export default SearchBar
