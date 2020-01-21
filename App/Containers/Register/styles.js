import {StyleSheet} from 'react-native';
import { Helpers } from '../../Theme';

export default StyleSheet.create({
    headerContainer: {
        flex: 0.1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    pictureContainer: {
        flex: 0.275,
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 5,
        marginBottom: 10,
    },

    fieldsContainer: {
        flex: 0.45,
    },

    fieldsContentContainer: {
        flexGrow: 1,

    },

    buttonContainer: {
        flex: 0.175,
        ...Helpers.center,
        
    },
})