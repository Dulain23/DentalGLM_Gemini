import { errorHandler } from "../utils/error.js";
import { successHandler } from "../utils/success.js";
import Conversation from '../models/conversation.model.js';
import mongoose from 'mongoose';
import { getPrompt, getLLMQuery, geminiAPICall, getInitials, getRandomColor, getMessagePrompt, getFeedbackPrompt } from './chat.helper.controller.js'

export const createChat = async (req, res, next) => {
    // Ensure that input parameters exist
    if (!req.body.reasonsForVisit && !req.body.patientCharacteristics) {
        next(errorHandler(500, "Create Chat Error - Invalid Input."));
    }

    // Create prompt with reasonsForVisit and patientCharacteristics
    const { reasonsForVisit, patientCharacteristics } = req.body;
    const patientCharacteristicsList = patientCharacteristics.map(char => char.value).join(', ');
    const reasonForVisit = reasonsForVisit.value;
    const prompt = await getPrompt(reasonForVisit, patientCharacteristicsList);
    try {
        // Send query to the Gemini
        const geminiResponse = await geminiAPICall(prompt);

        // Extract the generated response
        let textResponse = geminiResponse.text();
        textResponse = textResponse.replace(/```json|```/g, '').trim();

        // Convert the response to JSON
        const jsonResponse = JSON.parse(textResponse);

        // Create a new conversation with userId, patient, and timestamps
        const newConversation = new Conversation({
            userId: new mongoose.Types.ObjectId(req.token.id),
            patient: jsonResponse,
            systemProperties: {
                status: 'active',
                initials: getInitials(jsonResponse.Patient_Name),
                colour: getRandomColor()
            },
            createdAt: new Date(),
            updatedAt: new Date()
        });

        try {
            // Save the conversation to the database
            await newConversation.save();
            // Return success message with new conversation
            return res.status(200).json(successHandler(200, "Conversation Success - New conversation created.", { id: newConversation._id }));
        } catch (saveError) {
            console.error("Error saving conversation:", saveError);
            next(errorHandler(500, "Database Error - Unable to save conversation."));
        }
    } catch (error) {
        console.error("Error querying LLM:", error);
        next(errorHandler(500, "LLM Query Error - Unable to get response."));
    }
}

export const getChats = async (req, res, next) => {
    try {
        // Query the database for conversations
        const response = await Conversation.find({ userId: new mongoose.Types.ObjectId(req.token.id) })
            .select('patient.Patient_Name systemProperties.initials systemProperties.colour _id createdAt')
            .sort({ createdAt: -1 });

        // Format conversations
        const conversations = response.map(conversation => ({
            id: conversation._id,
            patientName: conversation.patient.Patient_Name,
            initials: conversation.systemProperties.initials,
            colour: conversation.systemProperties.colour
        }));

        return res.status(200).json({ success: true, body: conversations });

    } catch (error) {
        // Log the error for debugging and return
        console.error("Error fetching conversations:", error);
        return res.status(500).json({ success: false, message: "Database Error - Unable to retrieve from the database." });
    }
}

export const getChat = async (req, res, next) => {

    const chatID = req.params.id;

    try {
        // Query the database for the conversation by chatID
        const conversation = await Conversation.findById(chatID);

        // Check if conversation exists
        if (!conversation) {
            return next(errorHandler(404, "Chat Error - Chat not found."));
        }

        // Check if the user has permission to delete the chat
        if (conversation.userId.toString() !== req.token.id) {
            return next(errorHandler(403, "Chat Error - You do not have permissions for this chat."));
        }

        return res.status(200).json(successHandler(200, "Chat Success - Successfully retrieved chat.", { conversation }));
    } catch (error) {
        // Log the error for debugging and return
        console.error("Error fetching conversation:", error);
        return next(errorHandler(500, "Database Error - Unable to retrieve the conversation."));
    }

}

export const deleteChat = async (req, res, next) => {
    const chatID = req.params.id;

    try {
        // Find the conversation by ID
        const conversation = await Conversation.findById(chatID);

        // Check if conversation exists
        if (!conversation) {
            return next(errorHandler(404, "Chat Error - Chat not found."));
        }

        // Check if the user has permission to delete the chat
        if (conversation.userId.toString() !== req.token.id) {
            return next(errorHandler(403, "Chat Error - You do not have permissions to delete this chat."));
        }

        // Delete the conversation
        await Conversation.deleteOne({ _id: chatID });
        return res.status(200).json(successHandler(200, "Chat Success - Chat successfully deleted."));

    } catch (error) {
        console.error("Error deleting chat:", error);
        return next(errorHandler(500, "Database Error - Unable to delete the chat."));
    }
}

export const sendMessage = async (req, res, next) => {
    const chatID = req.params.id;
    const { message } = req.body;

    try {
        // Find the conversation by ID
        const conversation = await Conversation.findById(chatID);

        // Check if conversation exists
        if (!conversation) {
            return next(errorHandler(404, "Chat Error - Chat not found."));
        }

        // Check if the user has permission to the chat
        if (conversation.userId.toString() !== req.token.id) {
            return next(errorHandler(403, "Chat Error - You do not have permissions to delete this chat."));
        }

        // Create the prompt
        const prompt = getMessagePrompt(conversation.messages, message, conversation.patient);

        try {
            // Send query to the Gemini
            const geminiResponse = await geminiAPICall(prompt);

            // Extract the generated response
            let textResponse = geminiResponse.text();

            // Append the new messages to the conversation
            conversation.messages.push(
                { sender: 'user', content: message, timestamp: new Date() },
                { sender: 'llm', content: textResponse, timestamp: new Date() }
            );

            // Save conversation and pass back to user
            await conversation.save();
            return res.status(200).json({ success: true, body: { conversation } });

        } catch (error) {
            console.error("Error querying LLM:", error);
            next(errorHandler(500, "LLM Query Error - Unable to get response."));
        }

    } catch (error) {
        console.error("Error retrieving chat:", error);
        return next(errorHandler(500, "Database Error - Unable to retrieve the chat."));
    }
}

export const endChat = async (req, res, next) => {
    const chatID = req.params.id;

    try {
        // Find the conversation by ID
        const conversation = await Conversation.findById(chatID);

        // Check if conversation exists
        if (!conversation) {
            return next(errorHandler(404, "Chat Error - Chat not found."));
        }

        // Check if the user has permission to the chat
        if (conversation.userId.toString() !== req.token.id) {
            return next(errorHandler(403, "Chat Error - You do not have permissions to end this chat."));
        }

        // Craft a propt for generating feedback
        const prompt = getFeedbackPrompt(conversation.messages);

        try {
            // Send query to the Gemini
            const geminiResponse = await geminiAPICall(prompt);

            // Extract the generated response
            let textResponse = geminiResponse.text();  
            textResponse = textResponse.replace(/```json|```/g, '').trim();

            // Convert the response to JSON
            const jsonResponse = JSON.parse(textResponse);    

            // Append the llm feedback to the conversation
            conversation.feedback.push(
                { sender: 'llm', feedback: jsonResponse, timestamp: new Date() },
            );

            // Terminate the conversation by making the status inactive
            conversation.systemProperties.status = 'inactive';
            conversation.updatedAt = new Date();

            // Save Conversation
            await conversation.save();

            return res.status(200).json(successHandler(200, "Conversation Success - Feedback has been generated", { conversation }));

        } catch (error) {
            console.error("Error querying LLM:", error);
            next(errorHandler(500, "LLM Query Error - Unable to get response."));
        }


    } catch (error) {
        console.error("Error ending chat:", error);
        return next(errorHandler(500, "Database Error - Unable to end the chat."));
    }
}

// Get feedback of all conversation for user
export const getFeedback = async (req, res, next) => {
    try {

        // Query the database for all conversations that are complete
        const response = await Conversation.find({ userId: new mongoose.Types.ObjectId(req.token.id) })
            .select('patient.Patient_Name systemProperties feedback createdAt')
            .sort({ createdAt: -1 });

        // Format conversations
        const conversations = response.map(conversation => ({
            id: conversation._id,
            patientName: conversation.patient.Patient_Name,
            systemProperties: conversation.systemProperties,
            feedback: conversation.feedback
        }));

        return res.status(200).json(successHandler(200, "Feedback Success - Feedback scucessfully retrieved.", { conversations }));

    } catch (error) {
        // Log the error for debugging and return
        console.error("Error fetching conversations:", error);
        return res.status(500).json({ success: false, message: "Database Error - Unable to retrieve from the database." });
    }
}