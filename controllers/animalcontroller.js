const express = require("express");
const router = express.Router();
//capital vars reference the models 

const { Animal, User } = require("../models");
//adding authorization requirements to animal view

const validateSession = require("../middleware/validate-session");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//CREATE ANIMAL//
router.post("/create", validateSession, async(req, res) => {
    let { name, legNumber, predator, userId } = req.body.animal;
    try {
        const newAnimal = await Animal.create({
            name,
            legNumber,
            predator,
            userId: req.user.id
        });
        res.status(201).json({
            animal: newAnimal,
            message: "New animal has been created"
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to create new animal`
        })
    }
});

//GET ALL ANIMALS//
router.get("/", validateSession, async(req, res) => {
    try {
        const allAnimals = await Animal.findAll();
        where: { userId: req.user.id }
        res.status(200).json(allAnimals);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch animals",
        })
    }
});

//DELETE ANIMAL//
router.delete("/delete/:name", validateSession, async(req, res) => {
    //first grab the user's id from the user model --- not sure how this works
    const userId = req.user.id;
    //grab animal name from search params and set to the animal to delete
    const animalToDelete = req.params.name;
    //find all the user's animals 
    try {
        const userAnimalsToDelete = await Animal.findAll({
            where: {
                userId: userId,
                animal: animalToDelete
            }
        });
        res.status(200).json(userAnimalsToDelete);
    } catch (err) {
        res.status(404).json({ message: "No user animals found matching those specs" });
    };
    if (userAnimalsToDelete) {
        await Animal.destroy(userAnimalsToDelete);
        res.status(200).json({
            message: "Animal has been deleted."
        });
    } else {
        res.status(304).json({
            message: "Failed to delete animal.",
        });
    }
});



//UPDATE ANIMAL//
router.put("/update/:id", validateSession, async(req, res) => {
    const animalToUpdate = req.params.id;
    const userId = req.user.id;
    const { name, legNumber, predator } = req.body.animal;
    const query = {
        where: {
            id: animalToUpdate,
            userId: userId
        }
    };
    //update the animal 
    const updatedAnimal = {
        name: name,
        legNumber: legNumber,
        predator: predator
            //dont want to include userId here bc it will never change 
            //we don't want user to be able to change it 
    };
    try {
        //update is sequelize method that takes two args - first is object holding the new value, and second is where to place new data
        const update = await Animal.update(updatedAnimal, query);
        res.status(200).json({
            message: "Animal updated",
            update
        })
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


module.exports = router;