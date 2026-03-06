import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

const ios = Platform.OS === 'ios';
interface customKeyBoardViewProps {
    children: React.ReactNode
}
const CustomKeyBoardView: React.FC<customKeyBoardViewProps> = ({ children }) => {
    return (
        <KeyboardAvoidingView
            behavior={ios ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={ios ? 60 : 25}
        >
            <ScrollView
                className='flex-1'
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>

    )
}

export default CustomKeyBoardView

const styles = StyleSheet.create({
    scroll:{flexGrow:1},
    container:{flex:1}
})