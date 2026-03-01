import express from 'express';
import cors from 'cors';
import chatRoutes from "./features/chat/chat.routes";
import authRoutes from './features/auth/auth.routes';
import appointmentRoutes from './features/appointments/appointments.routes';
import { getMe } from './features/auth/auth.controller';
import { authenticate } from './middlewares/auth.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
});


app.get('/api/auth/me', authenticate, getMe);
app.get('/api/auth/me-test', (req, res) => res.json({ message: "Auth test route is working" }));


app.use('/api/auth', authRoutes);
app.get("/api/test", (req, res) => res.json({ message: "Backend is working" }));
app.use("/api/chat", chatRoutes);
app.use('/api/appointments', appointmentRoutes);

export default app;