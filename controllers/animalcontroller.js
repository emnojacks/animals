const express = require("express");
const router = express.Router();
const { Animal } = require("../models");
//capital vars reference the models 

module.exports = router;

router.post("/create", async(req, res) => {
    let { name, legNumber, predator } = req.body.animal;
    try {
        const newAnimal = await Animal.create({
            name,
            legNumber,
            predator
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

router.get("/", async(req, res) => {
    try {
        const allAnimals = await Animal.findAll();
        res.status(200).json(allAnimals);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch animals",
        })
    }
});


router.delete("/delete/:name", async(req, res) => {
    const animalToDelete = req.params.name;
    try {
        const query = {
            where: {
                animal: animalToDelete
            }
        }
        await Animal.destroy(query);

        res.status(200).json({
            message: "Animal has been deleted."
        });

    } catch (err) {
        res.status(500).json({
            message: "Failed to delete animal.",
        });
    }
});


router.put("/update/:id", async(req, res) => {
    const animalToUpdate = req.params.id;
    const { name, legNumber, predator } = req.body.animal;
    const query = {
        where: {
            id: animalToUpdate,
        }
    };
    //update the animal 
    const updatedAnimal = {
        name: name,
        legNumber: legNumber,
        predator: predator
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