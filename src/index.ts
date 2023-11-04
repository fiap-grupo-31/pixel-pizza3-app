import { FastfoodApp } from "./interfaces/api";
import { MongodbConnection } from "./infrastructure/persistence/databases/mongodb_database";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../.env' });

const dbconnection = new MongodbConnection(
);
const fastfoodApp = new FastfoodApp(dbconnection);
fastfoodApp.start();
