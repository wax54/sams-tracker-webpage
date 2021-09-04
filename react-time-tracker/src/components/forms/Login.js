import './Login.css';

import React, {useState} from "react";
import {useDispatch} from 'react-redux';
// import { useHistory } from "react-router";
// import UserContext from "../UserContext";
import { authorizeUser} from "../../models/redux/actionCreators";
import SimpleForm from "./SimpleForm";
import { useHistory } from 'react-router';

const LoginForm = () => {
    const history = useHistory();
    const dispatch = useDispatch(); 
    const [errors, setErrors] = useState([]);

    const loginInputs = {
        username: "",
        password: ""
    }

    const login = async ({ username, password }, reset) => {
        const result = await dispatch(authorizeUser({ username, password }));
        if (result.status) {
            //caused a memory leak because the login form was usually gone by the time it updated
            //reset();
            // setErrors([]);
            history.push('/');
        } else {
            setErrors([result.errors]);
        }
    }

    return <SimpleForm 
        className="Login" 
        INITIAL_STATE={loginInputs} 
        onSubmit={login}
        submitText="Login"
        errors={errors}
    />
};
export default LoginForm