
import { GoogleGenAI, Type } from "@google/genai";
import { CareerRecommendation } from '../types';

const API_KEY = typeof process !== 'undefined' ? process.env.API_KEY : undefined;

if (!API_KEY) {
  console.warn("Gemini API key is missing (process.env.API_KEY). AI features will use mock data.");
}

// Initialize with a dummy key if the real key is missing to prevent initialization errors.
const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });

const recommendationSchema = {
  type: Type.OBJECT,
  properties: {
    recommendedStream: {
      type: Type.STRING,
      description: "The academic stream recommended for the student (e.g., Science, Commerce, Arts, Vocational).",
    },
    reasoning: {
      type: Type.STRING,
      description: "A detailed, encouraging explanation for why this stream is recommended based on the quiz answers.",
    },
    suggestedSubjects: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of key subjects within the recommended stream that the student might excel at or enjoy.",
    },
    potentialCareers: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of potential career paths that align with the recommended stream and the student's interests.",
    },
    confidenceScore: {
        type: Type.NUMBER,
        description: "A score between 0 and 1 indicating the confidence in this recommendation.",
    },
    feedback: {
        type: Type.STRING,
        description: "Constructive feedback explaining how specific quiz answers influenced the recommendation. For example, 'Your interest in solving puzzles pointed towards an analytical field like Science.' This should be a single paragraph.",
    }
  },
  required: ["recommendedStream", "reasoning", "suggestedSubjects", "potentialCareers", "confidenceScore", "feedback"],
};

// Define a mock recommendation to be used as a fallback.
const MOCK_RECOMMENDATION: CareerRecommendation = {
  recommendedStream: "Science",
  reasoning: "Based on your logical problem-solving approach and interest in how things work, the Science stream is a great fit. It opens doors to fields like engineering and research where your analytical skills can shine. (This is a sample recommendation as the AI service is currently unavailable.)",
  suggestedSubjects: ["Physics", "Chemistry", "Mathematics", "Computer Science"],
  potentialCareers: ["Software Engineer", "Data Scientist", "Research Scientist", "Mechanical Engineer"],
  confidenceScore: 0.85,
  feedback: "Your preference for 'Solving puzzles' and subjects like 'Mathematics or Physics' strongly indicated a good fit for the analytical and logical reasoning required in the Science stream."
};


export const getCareerRecommendation = async (
  answers: { question: string; answer: string }[]
): Promise<CareerRecommendation> => {
  // If API key is missing, return mock data immediately.
  if (!API_KEY) {
    return Promise.resolve(MOCK_RECOMMENDATION);
  }

  const prompt = `
    Based on the following career quiz answers, please provide a personalized academic stream recommendation for a student.
    Analyze the answers to identify the student's core interests, skills, and motivations.
    The recommendation should be encouraging, insightful, and clear.
    Crucially, provide specific feedback on how the student's answers led to the recommendation.

    Quiz Answers:
    ${answers.map((a, index) => `${index + 1}. Question: "${a.question}"\n   Answer: "${a.answer}"`).join('\n')}

    Please return your analysis in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Basic validation to ensure the parsed object matches the expected structure.
    if (
        !parsedJson.recommendedStream ||
        !parsedJson.reasoning ||
        !Array.isArray(parsedJson.suggestedSubjects) ||
        !Array.isArray(parsedJson.potentialCareers) ||
        typeof parsedJson.confidenceScore !== 'number'
    ) {
        console.error("Parsed JSON does not match the CareerRecommendation schema, returning mock data.", parsedJson);
        return MOCK_RECOMMENDATION;
    }
    
    return parsedJson as CareerRecommendation;

  } catch (error) {
    console.error("Error fetching career recommendation from Gemini API:", error);
    // Propagate the error to the calling component so it can handle the UI state (e.g., show an error message).
    // Swallowing the error here and returning mock data caused an infinite loop in the UI.
    throw error;
  }
};
