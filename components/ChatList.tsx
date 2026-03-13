import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';
import ChatItem from './ChatItem';

export default function ChatList({ users,currentUser }: any) {
    const router = useRouter();
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={users}
                contentContainerStyle={{  paddingVertical: 25 }}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) =>
                    <ChatItem noBorder={index + 1 === users.length}
                        item={item}
                        currentUser ={currentUser}
                        router={router}
                        index={index} />
                }
            />
        </View>
    )
}


