import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectTheme } from '../redux/settings/settings.selectors'
import { colors } from '../lib/colors'

interface Placeholder {
    label: string
    value: null
    color: string
}

interface Item {
    label: string
    value: string | number
}

interface Props {
    items: Item[]
    placeholder: Placeholder
    value: string | number
    onValueChange: (type: string, value: string | number) => void
    theme: 'light' | 'dark'
    type: string
    textStyle: object
    label: string
}

const Dropdown: React.FC<Props> = ({ items, placeholder, value, onValueChange, theme, type, textStyle, label }) => {
    return <View style={stylesDark.container}>
        <Text style={textStyle}>{label}</Text>
        <RNPickerSelect
            Icon={() => { return <MaterialCommunityIcons name='arrow-down' size={25} color={colors[theme].txt} /> }}
            style={theme === 'dark' ? { ...stylesDark, iconContainer: { top: 10, right: 5 } } : { ...stylesLight, iconContainer: { top: 10, right: 5 } }}
            useNativeAndroidPickerStyle={false}
            placeholder={placeholder}
            items={items}
            value={value}
            onValueChange={(value) => {
                if (value !== null) onValueChange(type, value)
            }}
        />
    </View>
}

const stylesDark = StyleSheet.create({
    container: {
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputIOS: {
        textAlign: 'center',
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderWidth: 1.5,
        borderColor: 'white',
        borderRadius: 10,
        color: 'white',
        paddingRight: 30,
    },
    inputAndroid: {
        textAlign: 'center',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1.5,
        borderColor: 'white',
        borderRadius: 10,
        color: 'white',
        paddingRight: 30,
    },
})

const stylesLight = StyleSheet.create({
    container: {
        paddingBottom: 20
    },
    inputIOS: {
        textAlign: 'center',
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1.5,
        borderColor: 'black',
        borderRadius: 10,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        textAlign: 'center',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1.5,
        borderColor: 'black',
        borderRadius: 10,
        color: 'black',
        paddingRight: 30,
    },
})

const mapStateToProps = createStructuredSelector<any, any>({
    theme: selectTheme
})

export default connect(mapStateToProps)(Dropdown)