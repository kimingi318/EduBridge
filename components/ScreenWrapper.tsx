import { View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="flex-1"
      style={{
        paddingTop: insets.top + hp(1),
      }}
    >
      {children}
    </View>
  )
}

export default ScreenWrapper
