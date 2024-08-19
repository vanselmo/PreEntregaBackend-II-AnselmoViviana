import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongodb_connection = process.env.MONGODB_STRING;

mongoose.connect(mongodb_connection)
    .then(() => console.log("Conectado a la base de datos"))
    .catch((error) => console.log("No se pudo conectar a la base de datos", error));
