const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
    }
}, { timestamps: true, versionKey: false });

/**
 * @desc Pre-save hook to hash the password before saving the user document
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Method to compare provided password with the stored hashed password
 */
userSchema.methods.comparePassword = async function (inputPassword) {
    try {
        return await bcrypt.compare(inputPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const userModel = model("users", userSchema);

module.exports = userModel;
