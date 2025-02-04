import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useState } from "react";
import { connect } from "react-redux";
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import axios from "axios";

const TYPE = {
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAIL: "LOGIN_FAIL",
    VERIFY_SUCCESS: "VERIFY_SUCCESS",
    VERIFY_FAIL: "VERIFY_FAIL",
    GET_USER_SUCCESS: "GET_USER_SUCCESS",
    GET_USER_FAIL: "GET_USER_FAIL",
    REFRESH_SUCCESS: "REFRESH_SUCCESS",
    REFRESH_FAIL: "REFRESH_FAIL",
    CHANGE_PASSWORD_SUCCESS: "CHANGE_PASSWORD_SUCCESS",
    CHANGE_PASSWORD_FAIL: "CHANGE_PASSWORD_FAIL",
    SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
    SIGNUP_FAIL: "SIGNUP_FAIL",
    ACTIVATE_ACCTOUNT_SUCCESS: "ACTIVATE_ACCTOUNT_SUCCESS",
    ACTIVATE_ACCTOUNT_FAIL: "ACTIVATE_ACCTOUNT_FAIL",
    RESET_SUCCESS: "RESET_SUCCESS",
    RESET_FAIL: "RESET_FAIL",
    SET_SUCCESS: "SET_SUCCESS",
    SET_FAIL: "SET_FAIL",
    LOGOUT: "LOGOUT",
    CLOSE_ALERT: "CLOSE_ALERT",
    GUEST_VIEW: "GUEST_VIEW"
}

export const resetPasswordConfirm = ( uid, token, new_password1, new_password2 ) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ uid, token, new_password1, new_password2 });
    try {
        await axios.post("http://localhost:8000/dj-rest-auth/password/reset/confirm/", body, config);
        dispatch ({
            type: TYPE.SET_SUCCESS
        });
    } catch (err) {
        dispatch ({
            type: TYPE.SET_FAIL
        });
    };
};

const ResetPasswordConfirm = ({ resetPasswordConfirm }) => {
    const [ status, setStatus ] = useState (false);
    const { uid, token } = useParams();
    const [ formData, setFormData ] = useState ({
        new_password1: "",
        new_password2: ""
    });
    const { new_password1, new_password2 } = formData;
    const handlingInput = (e) => setFormData({...formData, [e.target.name]: e.target.value});
    const handlingSubmit = (e) => {
        e.preventDefault();
        resetPasswordConfirm( uid, token, new_password1, new_password2);
        setStatus(true);
    }
    if (status) {
        return <Navigate to={"../login/"}></Navigate>
    }
    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Set Password
                </Typography>
                <form onSubmit={handlingSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="New Password"
                        type="password"
                        name="new_password1"
                        value={new_password1}
                        onChange={handlingInput}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Re New Password"
                        type="password"
                        name="new_password2"
                        value={new_password2}
                        onChange={handlingInput}
                        variant="outlined"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ mt: 2 }}
                    >
                        Set Password
                    </Button>
                </form>
            </Box>
        </Container>
    )
}

export default connect(null, { resetPasswordConfirm })(ResetPasswordConfirm);
