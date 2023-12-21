import {DataSource} from "typeorm";
import { User } from "../ models/User";
import {Commende} from "../ models/Commende";



export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port:Number(process.env.PORT) ,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
    synchronize: true,
    logging: true,
    entities: [User,Commende],
    subscribers: [],
    migrations: [],
})

