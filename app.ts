require('dotenv').config();
const express = require('express');
const app = express();
import { AppDataSource } from "./config/data-source"
// const userRoutes = require('./routes/userRoutes');
// const commendRoutes =require("./routes/commendRoutes");
const userRoutes = require('./routes/userRoutes');
const commendRoutes = require('./routes/commendRoutes');

const cors = require("cors")

AppDataSource
    .initialize()
    .then(() => {
        console.log(`Data Source has been initialized! ${process.env.PORT}`)
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

app.use(cors({credentials: true, origin: '*'}))
// Démarrage du serveur
const PORT = process.env.PORT_SERV || 3001 ;


// Configuration du moteur de template
app.set('view engine', 'ejs');

// Middleware pour parser le corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(userRoutes,);
app.use(commendRoutes);
// userRoutes.initialize(app)



app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});