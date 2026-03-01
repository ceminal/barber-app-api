import { Request, Response } from "express";
import * as chatService from "./chat.service";

export const chatWithAi = async (req: Request, res: Response) => {
    try {
        const { message, context, history } = req.body;

        console.log("Incoming message:", message);
        console.log("Incoming context:", context);
        console.log("Incoming history length:", history?.length || 0);

        const reply = await chatService.getAiResponse(message, context, history);
        res.json({ success: true, reply });

    } catch (error: any) {
        console.error("Error processing AI request:", error);

        res.status(500).json({
            success: false,
            error: "AI error occurred",
            detail: error.message
        });
    }
};