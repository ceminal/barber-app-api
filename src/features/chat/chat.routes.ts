import { Router } from 'express';
import * as chatController from './chat.controller';

const router = Router();

router.post('/', chatController.chatWithAi);
router.get('/', (req, res) => res.send("Chat rotası yaşıyor!"));
export default router;
