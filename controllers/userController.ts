
import {User} from "../ models/User";
import { AppDataSource } from "../config/data-source"
const jwt = require("jsonwebtoken");
import config from "../config/config";
const bcrypt = require('bcrypt');
import { isValidEmail } from '../util';
import  {Request, Response} from 'express';
import {Commende} from "../ models/Commende";


// userController.js



const commendRepository = AppDataSource.getRepository(Commende)
const userRepository = AppDataSource.getRepository(User)


const register = async (req:Request, res: Response)  => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if(!isValidEmail(req.body.e_mail)){
        res.status(400).json({ error: "not valid E-mail" });
        return;
    }

    // Créez un nouvel utilisateur avec le mot de passe haché
    const newUser = new User(
         req.body.first_name,
         req.body.last_name,
         req.body.e_mail,
         hashedPassword,
       req.body.commende
    )
    await userRepository
        .save(newUser)
        .then((result) => {
            res.status(201).json(result)  // Envoyer la réponse après l'enregistrement réussi
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json(err.sqlMessage);
        });
};

const login = async (req:Request, res: Response)=>{
    try {
        let { e_mail, password } = req.body;
        if(!isValidEmail(e_mail)){
            res.status(400).json({ error: "not valid E-mail" });
            return;
        }
        if(!(e_mail && password)){
            res.status(400).json({ error: "E-mail ou mot de passe invalide " });
            return;
        }

        let result =''
        let oneUser : User | null = await userRepository.findOneBy({e_mail:req.body.e_mail})
        if(oneUser){
            bcrypt.compare(req.body.password, oneUser.password).then((loginValid:boolean)=>{
                if(loginValid){

                        const userToken = jwt.sign({ userId: oneUser?.id_user, username: oneUser?.first_name }, config.jwtSecret, { expiresIn: "1h" });
                        res.cookie("userToken",userToken)
                        result=userToken
                    res.status(200).json(oneUser);

                    }else{
                        res.status(400).json({ error: "E-mail ou mot de passe invalide " });
                    }


            })

        }else{
            res.status(400).json({ error: "E-mail ou mot de passe invalide " });
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération d'utilisateurs" });
    }

}



const getAllUsers = async (req:Request, res: Response) => {

    const result = await userRepository.find({
        relations: {
            commendes: true,
        },
    })
    console.log("result",result)
    res.status(201).json(result)
};

const getuserbyId = async (req:Request, res: Response) => {
    const id_user :string = req.params.id_user;
    const iduser :number = parseInt(id_user, 10);

    const result = await userRepository.find({
        relations: {
            commendes: true,
        },
            where: { id_user:iduser }
    }
    ).then(()=>{
        console.log("result",result)
        res.status(201).json(result)
    }) .catch((err) => {
        console.error(err);
        res.status(400).json(err);
    });
};

const deleteUser_n = async (req:Request, res: Response) => {

    const id_user: string = req.params.id_user;
    const iduser: number = parseInt(id_user, 10);
    console.log("nom_commende111: ", iduser)
    const user_1 = await userRepository.find({
        relations: {
            commendes: true,
        },
        where: {id_user: iduser}

    })
    console.log("user_1", user_1)

    await commendRepository.delete({user: user_1}).then((result1) => {
        console.log("result", result1)
        res.status(201).json(result1)

    }).catch((err) => {
        console.error(err);
        res.status(400).json(err);
    });

    await userRepository.remove(user_1).then((result1) => {
        console.log("result", result1)
        res.status(201).json(result1)

    }).catch((err) => {
        console.error(err);
        res.status(400).json(err);
    });

}
    const deleteUser = async (req: Request, res: Response) => {
        try {
            const id_user: string = req.params.id_user;
            const iduser: number = parseInt(id_user, 10);

            // Vérifiez d'abord s'il existe un utilisateur avec l'ID donné
            const userToDelete = await userRepository.findOneBy({ id_user:iduser }

            );
            if (!userToDelete) {
                res.status(404).json({ error: "Utilisateur non trouvé." });
                return;
            }

            // Supprimez toutes les références à l'utilisateur dans la table 'commende'
            await commendRepository.delete({ user: userToDelete });

            // Ensuite, supprimez l'utilisateur lui-même
            await userRepository.remove(userToDelete);

            res.status(201).json({ message: "Utilisateur supprimé avec succès." });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: "Une erreur s'est produite lors de la suppression de l'utilisateur." });
        }
    };






    // await userRepository.delete({id_user : iduser}).then((result)=>{
 //        console.log("result",result)
 //        res.status(201).json(result)
 //    }) .catch((err) => {
 //        console.error(err);
 //        res.status(400).json(err);
 //    });





module.exports = {
    getAllUsers,
    register,
    login,
    getuserbyId,
    deleteUser
};
