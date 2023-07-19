const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');


const getUsers = async (req, res, next) => {

    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Could not fetch users, try again.', 500
        );
        return next(error);
    }
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid credentials, could not signup', 422)
        );
    }

    const { name, email, password } = req.body;

    let exisitingUser;
    try {
        exisitingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Sign Up failed.', 500
        );
        return next(error);
    }

    if (exisitingUser) {
        const error = new HttpError(
            'User already exists, please login instead', 422
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user', 500
        );
        return next(error);
    }

    const createdUser = new User({
        name, 
        email,
        password: hashedPassword,
        image: req.file.path,
        places: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Sign Up failed, try again', 500
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email }, 
            process.env.JWT_KEY, 
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Sign Up failed, try again', 500
        );
        return next(error);
    }

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {

    const { email, password } = req.body;


    let identifiedUser;
    try {
        identifiedUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Could not log in, try again.', 500
        );
        return next(error);
    }

    if (!identifiedUser) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.', 403
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, identifiedUser.password);
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check your credentials', 500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.', 403
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: identifiedUser.id, email: identifiedUser.email }, 
            process.env.JWT_KEY, 
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Log In failed, try again', 500
        );
        return next(error);
    }

    res.json({ userId: identifiedUser.id, email: identifiedUser.email, token: token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;