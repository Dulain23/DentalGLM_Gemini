import { GoogleGenerativeAI } from "@google/generative-ai"

//Googel Gemini Model API Query
export const geminiAPICall = async (prompt) =>{
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response;
} 

// Generate the prompt used to query the model
export const getPrompt = async (reasonForVisit, patientCharacteristicsList) => {

    const instruction = `Generate diverse patient scenarios for patients visiting the dentist. Ensure that the scenarios include only the following information formatted as JSON given below:
{
    "Patient_Name": "Provide a realistic name for the patient",
    "Patient_Age": "Specify the age of the patient",
    "Patient_Gender": "Specify the gender of the patient",
    "Reason_For_Visit": "Reason for visiting the dentist.",
    "Patient_Emotional_State": "Describe the patient's emotional state in detail and any relevant factors contributing towards the patient's emotions. Provide detailed descriptions.",
    "Patient_Characteristics": "Detail the patient's oral hygiene habits, lifestyle, and any relevant personal characteristics. Provide comprehensive information.",
    "Patient_Symptoms": "List the symptoms the patient is experiencing, including duration and severity. Provide detailed descriptions.",
    "Patient_Medical_History": "Include the patient's dental and general medical history, medications, and any relevant past treatments. Provide detailed descriptions."
}`;

    const input = `Generate a patient scenario for a ${patientCharacteristicsList} patient that is visiting the doctor for a ${reasonForVisit}`;
    const output = '';

    const prompt = `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.
### Instruction:
${instruction}
    
### Input:
${input}
    
### Response:
${output}`;

    return prompt;
}


// Query to LLM to get Patient or Message
export const getLLMQuery = async (data) => {
    const response = await fetch(
        process.env.HUGGINGFACE_ENDPOINT,
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${process.env.HUGGINGFACEHUB_API_KEY}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}

const tailwindColors = [
    '#67e8f9', '#7dd3fc', '#93c5fd', '#a5b4fc',
    '#c4b5fd', '#f9a8d4', '#86efac'
];

// Generate the profile image colour for patient
export const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * tailwindColors.length);
    return tailwindColors[randomIndex];
};

// Generate the profile image initlal for patient
export const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
};

// Calculates the approximate token length - a token is about 2 or 3 words roughly
const calculateTokens = (text) => {
    const words = text.split(/\s+/).length;
    return Math.round(words / 2.5);
};

export const getMessagePrompt = (chatHistory, newMessage, patientDetails) => {
    const systemInstruction = `You are going to act as the following patient visiting the dentist. Respond only with spoken words and avoid any stage directions, descriptions of physical actions, or non-verbal expressions such as sighs, pauses, or gestures. Ensure that your replies are to the point focusing purely on verbal communication as if you were speaking directly to the dentist.
Patient Name : ${patientDetails.Patient_Name}
Patient Age : ${patientDetails.Patient_Age}
Patient Gender : ${patientDetails.Patient_Gender}
Reason For Visit : ${patientDetails.Reason_For_Visit}
Patient Emotional State: ${patientDetails.Patient_Emotional_State}
Patient Characteristics: ${patientDetails.Patient_Characteristics}
Patient Symptoms: ${patientDetails.Patient_Symptoms}
Patient Medical History: ${patientDetails.Patient_Medical_History}\n\n`;

    let prompt = `### System:\n${systemInstruction}`;

    // Format chat history
    const formattedHistory = chatHistory.map(msg => {
        const role = msg.sender === 'user' ? 'Doctor' : 'Patient';
        return `### ${role}:\n${msg.content}`;
    });

    // Add chat history to prompt
    for (const message of formattedHistory) {
        prompt += `${message}\n`;
    }

    // Add the new message
    prompt += `### Doctor:\n${newMessage}\n`;

    // Add the placeholder for the LLM response
    prompt += `### Patient:\n`;

    return prompt;
};

const guidelines = {
    "Communication Skills": "Focus on the clarity and simplicity of the dental student's explanations, as well as their ability to actively listen and respond appropriately to the patient's concerns. This includes demonstrating good listening skills by acknowledging and addressing the patient's questions effectively.",
    "Professionalism": "Evaluate the student's adherence to ethical guidelines, including patient confidentiality and informed consent. Consider how the student respects the patient's feelings and beliefs, and whether they demonstrate confident, but not arrogant, knowledge and skills.",
    "Patient Education": "Assess how clearly and accurately the student provides information about oral health, treatment options, and preventive care. Consider whether the student tailors their explanations and advice to the patient's specific needs and literacy level.",
    "Patient Involvement": "Look at how well the student encourages patient involvement by discussing treatment options and listening to their preferences. Evaluate the student's ability to ask for and respond to patient feedback, ensuring the patient's comfort and understanding.",
    "Interpersonal Skills": "Examine how well the student establishes a trusting relationship with the patient through a friendly and approachable demeanor. Consider the student's ability to recognize and address any patient anxiety or fear related to dental procedures.",
    "Follow-Up Care": "Consider how effectively the student discusses next steps, follow-up appointments, and long-term care plans. Assess whether the student provides information on how the patient can contact the clinic with any follow-up questions or concerns."
};

export const getFeedbackPrompt = (chatHistory) => {
    const instruction = `You are an experienced dental instructor. Based on the following conversation between a dental student and a patient, provide brief constructive feedback on the student's performance in only the following areas.

    Communication Skills: ${guidelines["Communication Skills"]},
    Professionalism: ${guidelines["Professionalism"]},
    Patient Education: ${guidelines["Patient Education"]},
    Patient Involvement: ${guidelines["Patient Involvement"]},
    Interpersonal Skills: ${guidelines["Interpersonal Skills"]},
    Follow-Up Care: ${guidelines["Follow-Up Care"]} 
`;

    const input = chatHistory.map(message => {
        const sender = message.sender === 'user' ? 'Student' : 'Patient';
        return `${sender}: ${message.content}`;
    }).join('\n');
    const output = "";

    const prompt = `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.
### Instruction:
${instruction}
        
### Input:
${input}

Expected JSON Output Format:
{
  "Communication_Skills": {
    "Score": [number out of 100],
    "Feedback": "[Brief, concise feedback in 1-2 sentences]"
  },
  "Professionalism": {
    "Score": [number out of 100],
    "Feedback": "[Brief, concise feedback in 1-2 sentences]"
  },
  "Patient_Education": {
    "Score": [number out of 100],
    "Feedback": "[Brief, concise feedback in 1-2 sentences]"
  },
  "Patient_Involvement": {
    "Score": [number out of 100],
    "Feedback": "[Brief, concise feedback in 1-2 sentences]"
  },
  "Interpersonal_Skills": {
    "Score": [number out of 100],
    "Feedback": "[Brief, concise feedback in 1-2 sentences]"
  },
  "Follow_Up_Care": {
    "Score": [number out of 100],
    "Feedback": "[Brief, concise feedback in 1-2 sentences]"
  }
}
        
### Response:
${output}`;

    return prompt;
};

