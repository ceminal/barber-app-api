import { User } from './user.model';
import { IUser } from './user.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export class AuthService {
    async register(userData: IUser) {
        const existingUser = await User.findOne({ phoneNumber: userData.phoneNumber });
        if (existingUser) {
            throw new Error('Phone number already registered');
        }
        const user = new User(userData);
        await user.save();
        const token = this.generateToken(user);
        return {
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        };
    }

    async login(phoneNumber: string, pass: string) {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const token = this.generateToken(user);

        const userObj = user.toObject();

        return {
            token,
            user: {
                id: userObj._id,
                firstName: userObj.firstName,
                lastName: userObj.lastName,
                phoneNumber: userObj.phoneNumber,
                role: userObj.role
            }
        };
    }

    async getUserById(id: string) {
        const user = await User.findById(id).select('-password');
        if (!user) throw new Error('User not found');
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            role: user.role
        };
    }

    async updateUser(id: string, updateData: Partial<IUser>) {
        if (updateData.phoneNumber) {
            const existingUser = await User.findOne({
                phoneNumber: updateData.phoneNumber,
                _id: { $ne: id }
            });
            if (existingUser) {
                throw new Error('This phone number is already registered with another account.');
            }
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) throw new Error('User not found');
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            role: user.role
        };
    }

    async getAllUsers() {
        return await User.find().select('-password');
    }

    private generateToken(user: any) {
        const payload = { id: user._id, role: user.role };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    }
}
