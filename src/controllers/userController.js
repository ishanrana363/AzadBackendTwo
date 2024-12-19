const userModel = require("../models/userModel");
const { successResponse, errorResponse } = require("../utility/response");

const createUser = async (req, res) => {
    try {
        const reqBody = req.body;
        const {email,password,confirmPassword} = req.body;
        const existUser = await userModel.findOne({email : email});
        if(existUser)return successResponse(res,409,"User already exists",existUser);
        
        if(password!== confirmPassword) return successResponse(res,400,"Passwords do not match",null);

        const user = await userModel.create(reqBody);
        return successResponse(res,201,"User created successfully",user);

    } catch (error) {
        return errorResponse(res,500,"Something went wrong",error);
    }
};


module.exports = {
    createUser,
};