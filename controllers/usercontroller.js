const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");

//Bronze Challenge
router.post("/create", async (req, res) => {

    let { username, password } = req.body.user;
    console.log(username, password);
    try {
        const newUser = await User.create({
            username,
            password,
        });

        res.status(201).json({
            message: "User created",
            user: newUser,
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to create user",
        });
    }
});

//Silver Challenge
router.post("/login", async (req, res) => {

    let { username, password } = req.body.user;

    try {
        const loginUser = await User.findOne({
            where: {
                username: username,
            },
        });
        res.status(200).json({
            user: loginUser,
            message: "User successfully logged in!"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});

module.exports = router;