const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require('sequelize/lib/errors');

router.post("/create", async(req, res) => {
    let { username, password } = req.body.user;
    try {
        const newUser = await User.create({
            username,
            password: bcrypt.hashSync(password, 10),
        });
        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: "14d" });

        res.status(201).json({
            message: "new user created",
            user: newUser,
            sessionToken: token,
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "email already in use",
            });
        } else {
            res.status(500).json({
                message: "failed to create user",
            });
        }
    }
});

router.post("/login", async(req, res) => {
    let { username, password } = req.body.user;
    try {
        const loginUser = await User.findOne({
            where: {
                username: username,
                password: password,
            }
        });

        if (loginUser) {
            let token =
                jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: "14d" });
            res.status(200).json({
                user: loginUser,
                message: "User successfully logged in",
                sessionToken: token,
            });

        } else {
            res.status(401).json({
                message: "Login attempt failed",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Cannot log in user",
        });
    }
});

module.exports = router;