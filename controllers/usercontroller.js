const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");

//Bronze Challenge
router.post("/create", async (req, res) => {

    let { username, password } = req.body.user;
    try {
        const newUser = await User.create({
            username,
            password: bcrypt.hashSync(password, 13),
        });

        let token = jwt.sign({id: newUser.id, username: newUser.username}, process.env.JWT_SECRET,{expiresIn: 60 * 60 * 24});

        res.status(201).json({
            message: "User created",
            user: newUser,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username already in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to create user",
            });
        }
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
        if (loginUser) {
            let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 2 });
        
            res.status(200).json({
            user: loginUser,
            message: "User successfully logged in!",
            sessionToken: token
        });
    }else {
        res.status(401).json({
            message: 'Login failed'
        });
    }
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});

module.exports = router;