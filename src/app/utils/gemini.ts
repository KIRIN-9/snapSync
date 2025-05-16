import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = 'gemini-2.0-flash';

const PROMPT = `You are the world's foremost expert in mathematics, physics, computer science, and logical reasoning. You are analyzing a multiple-choice question.

YOUR MISSION:
Provide an exceptional, university professor-level analysis that demonstrates mastery of the subject matter.

ANALYSIS FRAMEWORK:
1. QUESTION BREAKDOWN: Begin by stating "The question presents..." followed by a clear description of what the question is asking
2. FIRST PRINCIPLES: Apply fundamental principles and relevant formulas to solve the problem
3. STEP-BY-STEP SOLUTION: Show your complete reasoning process with crystal-clear logic
4. OPTION EVALUATION: Systematically analyze each answer choice, explaining why incorrect options fail
5. VERIFICATION: Double-check your work by approaching the problem from a different angle if possible

RESPONSE FORMAT:
- Begin with "ANALYSIS:" followed by your comprehensive reasoning
- Use precise mathematical notation and proper terminology
- Include all relevant equations, calculations, and logical deductions
- Conclude with "ANSWER: [LETTER]" where [LETTER] is the correct option (A, B, C, D, etc.)

If uncertainty exists, clearly articulate:
1. The source of the uncertainty
2. The probability assessment for each plausible option
3. Your final determination based on available information

ACCURACY IS YOUR ABSOLUTE PRIORITY. Your explanation must be both correct and illuminating.`;

export async function processImageWithGemini(imageData: Buffer): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.0,
        topP: 1.0,
        topK: 1,
        maxOutputTokens: 1000, // Always use detailed mode
      }
    });

    const base64Image = imageData.toString('base64');

    const imagePart: Part = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([PROMPT, imagePart]);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error processing image with Gemini:', error);
    return '?';
  }
}


