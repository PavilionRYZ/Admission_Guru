import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for AI Counsellor
const SYSTEM_PROMPT = `You are an expert AI Study Abroad Counsellor. Your role is to:

1. Deeply understand the student's profile, goals, and constraints
2. Provide personalized university recommendations with clear reasoning
3. Explain acceptance chances, risks, and fit for each recommendation
4. Categorize universities as Dream, Target, or Safe based on profile
5. Take actions when appropriate (shortlist universities, create tasks)
6. Guide students through their application journey step by step
7. Be honest about risks and realistic about chances
8. Provide actionable advice, not generic responses

You have access to the following actions:
- SHORTLIST_UNIVERSITY: Add a university to the student's shortlist
- CREATE_TASK: Create an actionable to-do item
- UPDATE_STAGE: Move the student to the next stage

When recommending universities, always consider:
- Academic profile (GPA, test scores)
- Budget constraints
- Country preferences
- Field of study
- Competition level and acceptance rates
- Student's readiness (exams, documents)

Be conversational, supportive, and professional. Explain your reasoning clearly.`;

// Initialize Gemini model
const getModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });
};

// Generate AI response
export const generateResponse = async (userMessage, context) => {
  try {
    const model = getModel();

    // Build context-aware prompt
    const contextPrompt = buildContextPrompt(context);
    const fullPrompt = `${contextPrompt}\n\nUser: ${userMessage}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // Parse actions from response
    const actions = parseActions(text);

    return {
      message: cleanResponse(text),
      actions,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`AI response generation failed: ${error.message}`);
  }
};

// Generate university recommendations
export const generateUniversityRecommendations = async (
  profile,
  universities,
) => {
  try {
    const model = getModel();

    const prompt = `Based on this student profile:
- Intended Degree: ${profile.intendedDegree}
- Field: ${profile.fieldOfStudy}
- GPA/Score: ${profile.gpa || profile.percentage}
- Budget: ${profile.budgetPerYear.currency} ${profile.budgetPerYear.min} - ${profile.budgetPerYear.max}
- Countries: ${profile.preferredCountries.join(", ")}
- English Test: ${profile.englishTest?.type} - ${profile.englishTest?.status}
- Standardized Test: ${profile.standardizedTest?.type} - ${profile.standardizedTest?.status}

Available universities (showing top 20 from database):
${universities
  .slice(0, 20)
  .map(
    (u, i) =>
      `${i + 1}. ${u.name} (${u.country}) - Tuition: ${u.cost?.tuitionPerYear?.min || "N/A"}-${u.cost?.tuitionPerYear?.max || "N/A"} ${u.cost?.tuitionPerYear?.currency || "USD"}, Acceptance Rate: ${u.acceptanceRate || "N/A"}%`,
  )
  .join("\n")}

Task:
1. Select the TOP 10 most suitable universities from the list above
2. For each, provide:
   - universityName: exact name from the list
   - category: Dream, Target, or Safe
   - acceptanceChance: Low, Medium, or High
   - fitReason: 2-3 sentences explaining why it fits
   - risks: array of 1-3 potential concerns
   - costLevel: Low, Medium, or High

Format as valid JSON array. Example:
[
  {
    "universityName": "University of Toronto",
    "category": "Target",
    "acceptanceChance": "Medium",
    "fitReason": "Strong CS program matching your field. Budget-friendly compared to US universities. Good acceptance rate for your profile.",
    "risks": ["Competitive program", "Cold weather may be challenging"],
    "costLevel": "Medium"
  }
]

Return ONLY the JSON array, no other text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        return [];
      }
    }

    // Fallback: return empty array if parsing fails
    console.warn("Could not parse recommendations from AI response");
    return [];
  } catch (error) {
    console.error("Recommendation Generation Error:", error);
    throw new Error(`Failed to generate recommendations: ${error.message}`);
  }
};

// Analyze profile strength
export const analyzeProfile = async (profile) => {
  try {
    const model = getModel();

    const prompt = `Analyze this student profile and provide detailed feedback:

Academic Background:
- Degree: ${profile.degree} in ${profile.major}
- GPA: ${profile.gpa || "N/A"} | Percentage: ${profile.percentage || "N/A"}
- Graduation: ${profile.graduationYear}

Test Scores:
- English: ${profile.englishTest?.type || "None"} - ${profile.englishTest?.status || "N/A"} ${profile.englishTest?.score ? `(Score: ${profile.englishTest.score})` : ""}
- Standardized: ${profile.standardizedTest?.type || "None"} - ${profile.standardizedTest?.status || "N/A"} ${profile.standardizedTest?.score ? `(Score: ${profile.standardizedTest.score})` : ""}

Documents:
- SOP: ${profile.sopStatus}
- LOR: ${profile.lorStatus}

Work Experience: ${profile.workExperience?.hasExperience ? `Yes, ${profile.workExperience.years} years` : "No"}

Goals:
- ${profile.intendedDegree} in ${profile.fieldOfStudy}
- Countries: ${profile.preferredCountries.join(", ")}
- Budget: ${profile.budgetPerYear.min}-${profile.budgetPerYear.max} ${profile.budgetPerYear.currency}

Provide:
1. Overall Strength Assessment (2-3 sentences)
2. Key Strengths (3 bullet points)
3. Areas to Improve (3 bullet points)
4. Next Immediate Steps (3 actionable items)

Be honest, specific, and actionable. Use a supportive tone.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Profile Analysis Error:", error);
    throw new Error(`Profile analysis failed: ${error.message}`);
  }
};

// Generate tasks based on profile and stage
export const generateTasks = async (
  profile,
  stage,
  lockedUniversities = [],
) => {
  try {
    const model = getModel();

    const prompt = `Generate specific, actionable tasks for a student at this stage:

Current Stage: ${stage}
Profile Status:
- English Test: ${profile.englishTest?.status || "Not Started"}
- Standardized Test: ${profile.standardizedTest?.status || "Not Started"}
- SOP: ${profile.sopStatus}
- LOR: ${profile.lorStatus}
- Locked Universities: ${lockedUniversities.length}

Generate 5-7 prioritized tasks. For each task provide:
{
  "title": "Brief action-oriented title",
  "description": "Specific steps to complete this task",
  "category": "Exams|Documents|Application|Recommendation|Financial|Visa|Other",
  "priority": "Low|Medium|High|Urgent",
  "dueDate": <number of days from now, or null>
}

Return as valid JSON array. Focus on immediate, actionable tasks relevant to the current stage.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("Task JSON parsing error:", parseError);
        return getDefaultTasks(stage);
      }
    }

    return getDefaultTasks(stage);
  } catch (error) {
    console.error("Task Generation Error:", error);
    return getDefaultTasks(stage);
  }
};

// Helper functions
const buildContextPrompt = (context) => {
  const { profile, shortlists, locks, stage } = context;

  return `Student Context:
Current Stage: ${stage || "Building Profile"}
Profile Completion: ${profile?.isOnboardingComplete ? "Complete" : "Incomplete"}
Profile Strength: ${profile?.profileStrength?.overall || 0}/100
Shortlisted Universities: ${shortlists?.length || 0}
Locked Universities: ${locks?.length || 0}

Student Goals:
- ${profile?.intendedDegree || "Not specified"} in ${profile?.fieldOfStudy || "Not specified"}
- Countries: ${profile?.preferredCountries?.join(", ") || "Not specified"}
- Budget: ${profile?.budgetPerYear?.min || 0}-${profile?.budgetPerYear?.max || 0} ${profile?.budgetPerYear?.currency || "USD"}`;
};

const parseActions = (text) => {
  const actions = [];

  // Look for action markers in AI response (if you implement action syntax)
  if (text.includes("SHORTLIST_UNIVERSITY")) {
    // Extract and parse shortlist actions
  }

  if (text.includes("CREATE_TASK")) {
    // Extract and parse task actions
  }

  return actions;
};

const cleanResponse = (text) => {
  // Remove action markers and clean up response
  return text
    .replace(/SHORTLIST_UNIVERSITY\[[^\]]*\]/g, "")
    .replace(/CREATE_TASK\[[^\]]*\]/g, "")
    .replace(/UPDATE_STAGE\[[^\]]*\]/g, "")
    .trim();
};

const getDefaultTasks = (stage) => {
  const defaultTasks = {
    "Building Profile": [
      {
        title: "Complete your profile",
        description:
          "Fill in all required information including academic background and test scores",
        category: "Other",
        priority: "Urgent",
        dueDate: 3,
      },
    ],
    "Discovering Universities": [
      {
        title: "Research universities",
        description:
          "Browse matched universities and shortlist at least 5 options",
        category: "Application",
        priority: "High",
        dueDate: 7,
      },
    ],
    "Finalizing Universities": [
      {
        title: "Prepare English proficiency test",
        description: "Schedule and prepare for IELTS/TOEFL examination",
        category: "Exams",
        priority: "High",
        dueDate: 30,
      },
    ],
    "Preparing Applications": [
      {
        title: "Draft Statement of Purpose",
        description: "Write your SOP highlighting your goals and motivation",
        category: "Documents",
        priority: "Urgent",
        dueDate: 14,
      },
    ],
  };

  return defaultTasks[stage] || [];
};

export default {
  generateResponse,
  generateUniversityRecommendations,
  analyzeProfile,
  generateTasks,
};
