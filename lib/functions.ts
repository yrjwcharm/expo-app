import Toast from 'react-native-tiny-toast'

export const showToast = (text: string) => {
    Toast.show(text, {
        position: -100,
        containerStyle: {
            borderRadius: 20,
            backgroundColor: '#EEEEEE',
        },
        textStyle: {
            color: 'black'
        }
    })
}