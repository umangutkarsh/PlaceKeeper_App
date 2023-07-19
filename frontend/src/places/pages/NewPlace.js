import React, { useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";
import './PlaceForm.css';


const NewPlace = () => {

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);

    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false);

    const history = useHistory();

    const placeSubmitHandler = async event => {
        event.preventDefault();
        
        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + '/places', 
                'POST',
                formData,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );
            // Redirect the user to a different page.
            history.push('/');
        } catch (err) {}
        
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && (
                    <div className="center">
                        <LoadingSpinner asOverlay />
                    </div>
                )}
                <div className="center">
                    <h2><b>
                        Add New Place
                    </b><span role="img" aria-label="Location"> 🚀</span></h2>
                </div>
                <hr />
                <div className="center">
                    <ImageUpload 
                        center="true" 
                        id="image" 
                        onInput={inputHandler} 
                        errorText="Please provide a valid image." 
                    />
                </div>
                <Input
                    id="title" 
                    element="input" 
                    type="text" 
                    label="Title" 
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler} 
                />
                <Input
                    id="description" 
                    element="textarea" 
                    label="Description" 
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler} 
                />
                <Input
                    id="address" 
                    element="input" 
                    label="Address" 
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler} 
                />
                <div className="center">
                    <Button type="submit" disabled={!formState.isValid}>
                        ADD PLACE
                    </Button>
                </div>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;