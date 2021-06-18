const express = require("express");
const db = require("./db");

const app = express();

app.use(require("./middleware/headers"));

const controllers = require("./controllers");

//jsonifies all requests 
app.use(express.json());

app.use("/user", controllers.usercontroller);

//controls all the routes below 
app.use(require("./middleware/validate-session"))

app.use("/animal", controllers.animalcontroller);
//creation of user/create endpoint
//app.use('/create', controllers.usercontroller);

db.authenticate()
    .then(() => db.sync({})) // => {force: true}
    .then(() => {
        app.listen(3000, () =>
            console.log(`[Server: ] App is listening on Port ${3000}`)
        );
    })
    .catch((err) => {
        console.log("[Server: ] Server Crashed");
        console.error(err);
    });