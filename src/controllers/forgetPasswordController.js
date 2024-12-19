
const SendEmailUtility = require("../helpers/emailHelper");
const otpModel = require("../models/otpModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    const otpCode = Math.floor(1000 + Math.random() * 9000); // Generate 6-digit OTP
    const emailSubject = "Otp code";
    const emailText = `Your OTP code is ${otpCode}`;

    try {
        const user = await userModel.find({ email: email });

        if (user) {
            // Send OTP email
            await SendEmailUtility(email, emailText, emailSubject);

            // Update or insert OTP in the database
            await otpModel.findOneAndUpdate(
                { email: email },
                { $set: { otp: otpCode, status: 0 } },
                { upsert: true }
            );

            return res.status(200).json({
                status: "success",
                msg: "6-digit OTP has been sent successfully"
            });
        } else {
            return res.status(404).json({
                status: "fail",
                msg: "User not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: "Something went wrong"
        });
    }
}

exports.verifyOtp = async (req, res) => {
    let email = req.body.email;
    let status = 0;
    let otpCode = req.body.otp;
    let statusUpdate = 1;
    try {
        let result = await otpModel.findOne({ email: email, otp: otpCode, status: status });
        if (result) {
            await otpModel.findOneAndUpdate({ email: email, otp: otpCode, status: status }, { status: statusUpdate });
            return res.status(200).json({
                status: "success",
                msg: "Otp verification successfully",
            })
        } else {
            return res.status(404).json({
                status: "fail",
                msg: "Otp not found"
            })
        }
    } catch (e) {
        res.status(500).json({
            status: "fail",
            msg: "Something went wrong"
        })
    }
};


exports.resetPassword = async (req, res) => {
    const { password, email, otp } = req.body;

    const statusUpdate = 0; 
    const otpCode = 0; 
    const saltRounds = 10; 

    try {
        // 1️⃣ Validate input data
        if (!email || !password || !otp) {
            return res.status(400).json({
                status: "fail",
                msg: "Email, password, and OTP are required"
            });
        }

        // 2️⃣ Check if OTP is valid
        let otpData = await otpModel.findOne({ email: email, otp: otp });
        if (!otpData) {
            return res.status(404).json({
                status: "fail",
                msg: "Invalid OTP or OTP has expired"
            });
        }

        // 3️⃣ Hash the new password
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4️⃣ Update the user's password
        const update = { password: hashedPassword };
        const userUpdateResult = await userModel.updateOne({ email: email }, { $set: update });

        if (userUpdateResult.modifiedCount === 0) {
            return res.status(400).json({
                status: "fail",
                msg: "Failed to update the password. User not found or no change made."
            });
        }

        // 5️⃣ Invalidate the OTP
        await otpModel.updateOne({ email: email }, { $set: { otp: otpCode, status: statusUpdate } });

        // 6️⃣ Send success response
        return res.status(200).json({
            status: "success",
            msg: "Password reset successfully"
        });

    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({
            status: "fail",
            msg: "An error occurred while resetting the password"
        });
    }
};
