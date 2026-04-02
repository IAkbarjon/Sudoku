import { Dimensions } from 'react-native'

let screenWidth = Dimensions.get('window').width
let screenHeight = Dimensions.get('window').height

const updateDimensions = ({ window }: any) => {
    screenWidth = window.width
    screenHeight = window.height
}

Dimensions.addEventListener('change', updateDimensions)

export { screenHeight, screenWidth }

