const { tokenCreate } = require("../helpers/tokenHelper");
const userModel = require("../models/userModel");
const { successResponse, errorResponse } = require("../utility/response");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    try {
        const reqBody = req.body;
        const { email, password, confirmPassword } = req.body;
        const existUser = await userModel.findOne({ email: email });
        if (existUser) return successResponse(res, 409, "User already exists", existUser);

        if (password !== confirmPassword) return successResponse(res, 400, "Passwords do not match", null);

        const user = await userModel.create(reqBody);
        return successResponse(res, 201, "User created successfully", user);

    } catch (error) {
        return errorResponse(res, 500, "Something went wrong", error);
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) return errorResponse(res, 404, "User not found", null);
        let matchPassword = bcrypt.compareSync(password, user.password);
        console.log(matchPassword)
        if (!matchPassword) return errorResponse(res, 400, "Invalid credentials", null);
        const token = tokenCreate({ user }, process.env.JWT_KEY, "10d");
        return successResponse(res, 200, "Logged in successfully", { user, token });
    } catch (error) {
        console.log(error)
        errorResponse(res, 500, "Something went wrong", error);
    }
};

const userProfile = async (req, res) => {
    try {
        const id = req.headers._id;
        const filter = {
            _id: id,
        };
        const user = await userModel.findOne(filter);
        if (!user) return errorResponse(res, 404, "User not found", null);
        return successResponse(res, 200, "User profile fetched successfully", user);
    } catch (error) {
        errorResponse(res, 500, "Something went wrong", error);
    }
};

const updateProfile = async (req, res) => {
    const saltRounds = 10;

    try {
        const id = req.headers._id;
        const { password, img, number, name } = req.body;
        const filter = {
            _id: id,
        };
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const updateData = {
            password: hashedPassword,
            img: img,
            number: number,
            name: name,
        }
        const updatedUser = await userModel.findOneAndUpdate(filter, updateData, { new: true });
        if (!updatedUser) return errorResponse(res, 404, "User not found", null);
        return successResponse(res, 200, "User profile updated successfully", updatedUser);
    } catch (error) {
        errorResponse(res, 500, "Something went wrong", error);
    }

};


const deleteUser = async (req, res) => {
    try {
        const id = req.headers._id;
        const filter = {
            _id: id,
        };
        await userModel.deleteOne(filter);
        return successResponse(res, 200, "User deleted successfully", null);
    } catch (error) {
        errorResponse(res, 500, "Something went wrong", error);
    }
};




module.exports = {
    createUser,
    loginUser,
    userProfile,
    updateProfile,
    deleteUser
};