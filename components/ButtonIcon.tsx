import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface Styles {
    iconContainer: object
    icon: object
}

interface Props {
    styles: Styles,
    icon: string
    onPress: () => void
}

const ButtonIcon: React.FC<Props> = ({ styles, icon, onPress }) => {
    return <TouchableOpacity onPress={onPress}>
        <View style={styles.iconContainer}>
            <MaterialCommunityIcons
                name={icon}
                size={30}
                style={styles.icon} />
        </View>
    </TouchableOpacity>
}

export default ButtonIcon