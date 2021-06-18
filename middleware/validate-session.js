const jwt = require("jsonwebtoken");
const { User } = require("../models");

const validateSession = async(req, res, next) => {
    if (req.method == "OPTIONS") {
        next();
        //this goes back to the controller and calls the async func for that route
    } else if (
        req.headers.authorization &&
        req.headers.authorization.includes("Bearer")
    ) {
        const { authorization } = req.headers;
        console.log("authorization -->", authorization);
        const payload = authorization ?
            jwt.verify(authorization.includes("Bearer") ?
                authorization.split(" ")[1] :
                authorization,
                process.env.JWT_SECRET) :
            undefined;

        console.log("payload -->", payload);
        if (payload) {
            //search the db for the user and setting the id to the payload id 
            let foundUser = await User.findOne({
                where: {
                    id: payload.id
                }
            });
            console.log("founduser-->", foundUser);
            if (foundUser) {
                console.log("request-->", req);
                //when you use dot notation on the lefthand side, you are
                //creating a new property and anything on the right is a new prop
                //this creates user and sets it to founduser
                //models don't talk to eachother 
                req.user = foundUser;
                //THIS IS HOW WE GET THE USER ID 
                next();
            } else {
                res.status(400).send({ message: "Not Authorized" });
            }
        } else {
            res.status(401).send({
                message: "Invalid token"
            });
        }
    } else {
        res.status(403).send({ message: "Forbidden" });
    }
};

module.exports = validateSession;