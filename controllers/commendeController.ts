import { AppDataSource } from "../config/data-source"
import { Commende } from "../ models/Commende"
 import {User} from "../ models/User";
import  {Request, Response} from 'express';

const commendRepository = AppDataSource.getRepository(Commende)
const userRepository = AppDataSource.getRepository(User)
const newCommende = async (req:Request, res: Response) => {
    try {
        const { nom_commende, id_user } = req.body;

        // Recherche de l'utilisateur par ID
        const user = await userRepository.findOneBy({id_user :id_user});
        console.log("user",user)

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Créez un nouvel objet Commende avec l'utilisateur associé
        const newCommende = commendRepository.create({ nom_commende, user });
        console.log("newCommende",newCommende)
        // Enregistrez la nouvelle commande
        const result = await commendRepository.save(newCommende);

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
};

const getCommendeByID = async (req:Request, res: Response)  => {
    const commendeId = req.params.commendeId;
    console.log("nom_commende111: ",commendeId)
    const numericId = parseInt(commendeId, 10);

    const result = await commendRepository.find({
        relations: {
            user: true,
        },
        where: {id_commende:numericId }
    })


    console.log("result",result)
     res.status(201).json(result)
};


const getAllCommende = async (req:Request, res: Response)  => {

    await commendRepository
        .find()
        .then((result) => {
            console.log("result: ",result)
            res.status(201).json(result)  // Envoyer la réponse
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json(err.sqlMessage);
        });
};

const deletecommende = async (req: Request, res: Response) => {
    try {
        const idcommende: string = req.params.id_commende;
        const id_commende: number = parseInt(idcommende, 10);
        console.log("id_commende",id_commende)
        const commendeToDelete = await commendRepository.findOneBy({ id_commende: id_commende });

        if (!commendeToDelete) {
            res.status(404).json({ error: "Commende non trouvée." });
            return;
        }

        // Supprimez l'entité en la passant dans un tableau
        await commendRepository.remove([commendeToDelete]);

        res.status(201).json({ message: "Commende supprimée avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la suppression du commende." });
    }
};


module.exports = {
    newCommende,
    getCommendeByID,
    getAllCommende,
    deletecommende,
};