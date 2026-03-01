import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { phoneNumber, password } = req.body;
        const result = await authService.login(phoneNumber, password);
        res.json(result);
    } catch (err: any) {
        res.status(401).json({ message: err.message });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await authService.getUserById(req.user!.id);
        res.json(user);
    } catch (err: any) {
        res.status(401).json({ message: 'Oturum geçersiz, lütfen tekrar giriş yapın.' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const updatedUser = await authService.updateUser(req.user!.id, req.body);
        res.json(updatedUser);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await authService.getAllUsers();
        res.json(users);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
