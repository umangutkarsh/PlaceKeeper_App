import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useParams } from 'react-router-dom';
import { useHttpClient } from "../../shared/hooks/http-hook";


const UserPlaces = () => {
    
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState();
    const userId = useParams().userId;
    
    useEffect(() => {
        const fetchPlaces = async () => {

            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
                );
                setLoadedPlaces(responseData.places);
            } catch (err) {}

        };
        fetchPlaces();
    }, [sendRequest, userId]);

    
    const placeDeletetedHandler = deletedPlaceId => {
        setLoadedPlaces(
            prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId)
        );
    };


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner asOverlay />
                </div>
            )}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletetedHandler} />}
        </React.Fragment>
    );
};

export default UserPlaces;