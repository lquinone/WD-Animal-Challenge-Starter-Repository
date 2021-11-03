const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/types");

router.post("/register", async (req, res) => {
    let {email, password } = req.body.user;
    try {
        const User = await UserModel.create({
            email,
            password,
        });

        res.status(201).json({
            message: "User has created an account",
        });
    }catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use",
            });
        }else {
            res.status(500).json({
                message: "Failed to register user",
            });
        }
    }
})


module.exports = router;