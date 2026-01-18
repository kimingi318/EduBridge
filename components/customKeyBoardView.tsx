import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

const ios = Platform.OS === 'ios';
interface customKeyBoardViewProps {
    children: React.ReactNode
}
const CustomKeyBoardView: React.FC<customKeyBoardViewProps> = ({ children }) => {
    return (
        <KeyboardAvoidingView
            behavior={ios ? 'padding' : 'height'}
            className='flex-1'
        >
            <ScrollView
            className='flex-1'
             bounces={false} 
             showsVerticalScrollIndicator={false}>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>

    )
}

export default CustomKeyBoardView

