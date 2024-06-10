import bcrypt from 'bcrypt';
import { findStateByName} from '../models/State.js';
import { createUser, updateToken,findUserByEmail } from '../models/User.js';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'; 

dotenv.config();

export const signup = async (req, res) => {
    try {
        const data = req.body;
        const user = await findUserByEmail(data.email);
        if (user) {
            res.status(500).json({
                error: "email already exist",
            });
            return;
        }
        const passwordHash = await bcrypt.hash(data.passwordHash, 10);
        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload,10);

        const state = await findStateByName(data.state);

        await createUser({
            name: data.name,
            email:data.email,
            passwordHash,
            token
        }, state.id)

        res.status(201).json({token})
    } catch (error) {
        res
            .status(500)
            .json({ error: "failed to create user", message: error.message });
    };
};

export const signin = async (req, res) => {
    try {
        const data = req.body;
        // Verificar se o email existe
        const user = await findUserByEmail(data.email);
        if(!user){
            res.status(500).json({ error: 'Email or password invalid!'});
            return;
        }

        // Verificar se a senha está correta
        const match = await bcrypt.compare(data.passwordHash, user.passwordHash);
        if(!match){
            res.status(500).json({ error: 'Email or password invalid!'});
            return;
        }
        console.log(match);
        
        // Gerar um novo token
        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload,10);
        await updateToken(user.id,token);

        res.status(200).json({userId:user.id, token});


    } catch (error) {
        res.status(500).json({error:'Failed to log in', message:error.message})
    }
}


export const signupv2 = async (req, res) => {
    try {
        const data = req.body;
        const user = await findUserByEmail(data.email);
        if (user) {
            res.status(500).json({
                error: "email already exist",
            });
            return;
        }
        const passwordHash = await bcrypt.hash(data.passwordHash, 10);
        
        const state = await findStateByName(data.state);

        const newUser = await createUser({
            name: data.name,
            email: data.email,
            passwordHash,
            token: '' 
        }, state.id);

        
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await updateToken(newUser.id, token);

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: "failed to create user", message: error.message });
    }
};

export const signinv2 = async (req, res) => {
    try {
        const data = req.body;
        // Verificar se o email existe
        const user = await findUserByEmail(data.email);
        if (!user) {
            res.status(500).json({ error: 'Email or password invalid!' });
            return;
        }

        // Verificar se a senha está correta
        const match = await bcrypt.compare(data.passwordHash, user.passwordHash); // Corrigido para `data.password`
        if (!match) {
            res.status(500).json({ error: 'Email or password invalid!' });
            return;
        }
        
        
        // Gerar um novo token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Atualizar o token no banco de dados
        await updateToken(user.id, token);

        res.status(200).json({ userId: user.id, token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log in', message: error.message });
    }
};