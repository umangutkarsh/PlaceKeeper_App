import React, { useContext, useState } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import './Auth.css';


const Auth = () => {

    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const switchModeHandler = () => {

        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        }

        else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false);
        }

        setIsLoginMode(prevMode => !prevMode);
    };


    const authSubmitHandler = async event => {
        event.preventDefault();

        console.log(formState.inputs);

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/login`, 
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.userId, responseData.token);
            } catch (err) {}
        }

        else {
            try {
                const formData = new FormData();
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/signup`, 
                    'POST',
                    formData
                );
                auth.login(responseData.userId, responseData.token);
            } catch (err) {}
        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && (
                    <div className="center">
                        <LoadingSpinner asOverlay />
                    </div>
                )}
                <div className="center">
                    <h2>{isLoginMode ? 'Login Required' : 'Sign-Up Required'}</h2>
                </div>
                <hr />
                <form>
                    {!isLoginMode && (
                        <Input 
                            id="name" 
                            element="input" 
                            type="text" 
                            label="Name" 
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your name"
                            onInput={inputHandler} 
                        />
                    )}
                    {!isLoginMode && (
                        <div className="center">
                            <ImageUpload 
                                center 
                                id="image" 
                                onInput={inputHandler} 
                                errorText="Please provide a valid image." 
                            />
                        </div>
                    )}
                    <Input 
                        id="email" 
                        element="input" 
                        type="email" 
                        label="E-mail" 
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address"
                        onInput={inputHandler} 
                    />
                    <Input 
                        id="password" 
                        element="input" 
                        type="password" 
                        label="Password" 
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password (at least 6 characters)"
                        onInput={inputHandler} 
                    />
                    <div className="center">
                        <Button type="submit" disabled={!formState.isValid} onClick={authSubmitHandler}>
                            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                        </Button>
                    </div>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLoginMode ? 'SIGN-UP MODE' : 'LOGIN MODE'}
                </Button>
            </Card>
        </React.Fragment>
    );
};

export default Auth;