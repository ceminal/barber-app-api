import { geminiModel } from "../../config/gemini";

import { Appointment } from "../appointments/appointment.model";

const BARBER_DATA = [
    { name: 'Sebastian Thorne' },
    { name: 'Arthur Sterling' },
    { name: 'Marco Rossi' }
];

export const getAiResponse = async (userMessage: string, context: any, history: any[] = []) => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);


    let bookedListStr = "";
    try {
        const bookedAppointments = await Appointment.find({
            date: { $gte: today, $lte: maxDate },
            status: { $ne: 'CANCELLED' }
        }).select('barberName date appointmentTime -_id');


        bookedListStr = bookedAppointments.map(app =>
            `${app.barberName} is booked on ${new Date(app.date).toLocaleDateString('en-US')} at ${app.appointmentTime}`
        ).join("\n");
    } catch (dbError) {
        console.error("Error reading database:", dbError);
    }

    const todayStr = today.toLocaleDateString('en-US');
    const maxDateStr = maxDate.toLocaleDateString('en-US');

    const rootUrl = "https://cutio-demo.netlify.app";
    const bookingLink = `${rootUrl}/booking`;

    const systemInstruction = `You are the virtual assistant of a luxury barbershop named "Cutio".
    Respond politely, professionally, and concisely. Respond in the language the user writes in, but default to English.

    SHOP INFO (Use only this info):
    - Services: Haircut ($50), Beard Trim ($20), Facial Care ($30).
    - Working Hours: Monday - Saturday, 09:00 - 19:30. Closed on Sunday.
    - Location: Istanbul, Turkey.
    - Barbers: Sebastian Thorne, Arthur Sterling, Marco Rossi.

    TASKS & STRICT RULES:
    1. Answer questions about prices, barbers, services, and working hours.
    2. STRICT RULE: If the user wants to book an appointment, ask for a time/day, or ask for availability, give him the booking link directly.
    3. "IDK" RULE: If asked about anything outside shop info, redirect to the booking link.
    4. When giving the link, write ONLY "${bookingLink}". NEVER put dots, commas, or exclamation marks at the end of the link!
    5. Correct Answer Example: "For detailed information and booking, click here: ${bookingLink}"
    6. Never suggest a specific time or date yourself. Always redirect to the link.`;

    try {
        const chat = geminiModel.startChat({
            history: history || [],
            systemInstruction: {
                role: "system",
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.5,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();

    } catch (error: any) {
        console.error("!!! GEMINI API ERROR !!!", error.message);
        return "System error: I cannot access the schedule right now. Please try again later.";
    }
};
