const fs = require('fs'); 

const  { validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');


const getPlaceById = async (req, res, next) => {

    const placeId = req.params.pid; // { pid: 'p1' }
    
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            'Could not find the specified place, please try again.', 500
        );
        return next(error);
    }

    if (!place) {
        const error =  new HttpError(
            'Could not find a place for the provided id.', 404
        );
        return next(error);
    }
    res.json({ place: place.toObject( { getters: true } ) }); // { place } => { place: place }
};

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlacesByUserId = async (req, res, next) => {

    const userId = req.params.uid;

    let places;
    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        const error = new HttpError(
            'Could not find places for the specified user.', 500
        );
        return next(error);
    }

    if (!places || places.length === 0) {
        return next(
            new HttpError('Could not find a place for the provided user id.', 404)
        );
    }
    res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Could not create place, invalid inputs', 422)
        );
    }

    const { title, description, address } = req.body;
    // const title = req.body.title;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        image: req.file.path,
        location: coordinates,
        address,
        creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, try again.', 500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            'User does not exist for the provided id.', 404
        );
        return next(error);
    }
    console.log(user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Failed creating place', 500
        );
        return next(error);
    }

    res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Could not update place, invalid inputs', 422)
        );
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;


    let updatedPlace;
    try {
        updatedPlace = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            'Could not find the place to update.', 500
        );
        return next(error);
    }

    if (updatedPlace.creator.toString() !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to edit this place.', 401
        );
        return next(error);
    }

    updatedPlace.title = title;
    updatedPlace.description = description;
    
    try {
        await updatedPlace.save();
    } catch (err) {
        const error = new HttpError(
            'Could not update place.', 500
        );
        return next(error);
    }

    res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {

    const placeId = req.params.pid;
    
    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        const error = new HttpError(
            'Could not find the place to delete.', 500
        );
        return next(error);
    }

    if (!place) {
        const error = new HttpError(
            'Could not find place for this id', 404
        );
        return next(error);
    }

    if (place.creator.id !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this place.', 401
        );
        return next(error);
    }

    const imagePath = place.image;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Could not delete the place', 500
        );
        return next(error);
    }

    fs.unlink(imagePath, err => {
        console.log(err);
    });

    res.status(200).json({ message: 'Place deleted', place: place.toObject({ getters: true }) });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;