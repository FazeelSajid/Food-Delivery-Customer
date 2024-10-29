import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Colors } from '../../../constants'
import StackHeader from '../../../components/Header/StackHeader'
import { useDispatch, useSelector } from 'react-redux'
import CInput from '../../../components/TextInput/CInput'
import Feather from 'react-native-vector-icons/Feather';
import { fetchApis, showAlert } from '../../../utils/helpers'
import api from '../../../constants/api'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CButton from '../../../components/Buttons/CButton'
import Loader from '../../../components/Loader'
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { setPassword } from '../../../redux/AuthSlice'

const UpdatePassord = ({ navigation }) => {
    const dispatch = useDispatch();
    const { join_as_guest, password, customer_detail } = useSelector(store => store.store);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',

    });


    const ref_RBSheet = useRef();
    // console.log({ password });


    function validatePassword(password) {
        // Regular expression pattern to match passwords
        const passwordPattern =
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        // Test if the password matches the pattern
        return passwordPattern.test(password);
    }

    const validate = () => {
        // Check if all required fields are filled
        if (!oldPassword) {
            setFormError(prev => ({ ...prev, oldPassword: 'Old password required' }));
            return false;

        }
        if (!newPassword) {
            setFormError(prev => ({ ...prev, newPassword: 'New password required' }));
            return false;


        }
        if (!confirmPassword) {
            setFormError(prev => ({ ...prev, confirmPassword: 'Confirm password required' }));
            return false;
        }

        // Validate the new password pattern
        if (!validatePassword(newPassword)) {
            showAlert(
                'Your password must be at least 8 characters long and contain a combination of letters, numbers, and special characters.',
                'red',
                3
            );
            setFormError(prev => ({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
            return false;
        }

        // Check if newPassword and confirmPassword match
        if (newPassword !== confirmPassword) {
            showAlert('Password and confirm password do not match');
            setFormError(prev => ({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
            return false;
        }

        // Check if oldPassword matches the stored password
        if (oldPassword !== password) {  // Assuming `password` is the saved password variable
            showAlert('Old password is incorrect');
            setFormError(prev => ({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
            return false;
        }

        // All validations passed
        return true;
    };



    const handleUpdatePassword = () => {
        if (validate()) {
            const data = {
                email: customer_detail?.email,
                newPassword: newPassword,
            }
            console.log({ data });

            setLoading(true);
            fetch(api.update_password, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then(response => response.json())
                .then(async response => {
                    // console.log('response  :  ', response);
                    if (response?.status == false) {
                        showAlert(response?.message);
                    } else {
                        dispatch(setPassword(newPassword))
                        ref_RBSheet?.current?.open();
                    }
                })
                .catch(err => {
                    console.log('Error in Login :  ', err);
                    showAlert('Something went wrong');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <View style={styles.container} >
            <StackHeader title={'Update Password'} />

            <Loader loading={loading} />
            <View style={{ marginTop: hp(3), flex: 1 }} >

                <CInput
                    placeholder="Old Password"
                    value={oldPassword}
                    onChangeText={text => setOldPassword(text)}
                    secureTextEntry={!showOldPass}
                    rightContent={
                        <TouchableOpacity onPress={() => setShowOldPass(!showOldPass)}>
                            <Feather
                                name={!showOldPass ? 'eye' : 'eye-off'}
                                size={20}
                                color={'#39393999'}
                            />
                        </TouchableOpacity>
                    }
                    containerStyle={formError.oldPassword && { marginBottom: 5 }}
                />
                {
                    formError.oldPassword && <Text style={styles.errorText} >{formError.oldPassword}</Text>
                }
                <CInput
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={text => setNewPassword(text)}
                    secureTextEntry={!showNewPass}
                    rightContent={
                        <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
                            <Feather
                                name={!showNewPass ? 'eye' : 'eye-off'}
                                size={20}
                                color={'#39393999'}
                            />
                        </TouchableOpacity>
                    }
                    containerStyle={formError.newPassword && { marginBottom: 5 }}
                />

                {
                    formError.newPassword && <Text style={styles.errorText} >{formError.newPassword}</Text>
                }
                <CInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
                    secureTextEntry={!showConfirmPass}
                    rightContent={
                        <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                            <Feather
                                name={!showConfirmPass ? 'eye' : 'eye-off'}
                                size={20}
                                color={'#39393999'}
                            />
                        </TouchableOpacity>
                    }
                    containerStyle={formError.confirmPassword && { marginBottom: 5 }}
                />

                {
                    formError.confirmPassword && <Text style={styles.errorText} >{formError.confirmPassword}</Text>
                }

            </View>
            <View
                style={{
                    flex: 0.8,
                    paddingBottom: 30,
                    justifyContent: 'flex-end',
                }}>
                <CButton
                    title="Save"
                    width={wp(85)}
                    loading={loading}
                    onPress={() => {
                        Keyboard.dismiss();
                        // ref_RBSheet?.current?.open();
                        handleUpdatePassword()

                    }}
                />
            </View>

            <View>
                <RBSheetSuccess
                    refRBSheet={ref_RBSheet}
                    title={'Password Updated Successfully'}
                    btnText={'OK'}
                    onPress={() => {
                        ref_RBSheet?.current?.close();
                        navigation.goBack();
                    }}
                />
            </View>

        </View>
    )
}

export default UpdatePassord

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, backgroundColor: Colors.White
    },
    errorText: {
        color: 'red',
        fontSize: RFPercentage(1.5),
        marginBottom: wp(3),
        marginLeft: wp(8),
        // marginTop: 2
    }
})