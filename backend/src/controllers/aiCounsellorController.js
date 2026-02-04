import Conversation from "../models/conversationModel.js";
import Profile from "../models/profileModel.js";
import Shortlist from "../models/shortlistModel.js";
import Lock from "../models/lockModel.js";
import University from "../models/universityModel.js";
import Task from "../models/taskModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import {
  generateResponse,
  generateUniversityRecommendations,
  analyzeProfile,
} from "../services/geminiService.js";

// Send message to AI Counsellor
export const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return next(new ErrorHandler("Message is required", 400));
    }

    // Check profile completion
    const profile = await Profile.findOne({ user: userId });
    if (!profile || !profile.isOnboardingComplete) {
      return res.status(400).json({
        success: false,
        message:
          "Please complete your profile onboarding first to access the AI Counsellor.",
      });
    }

    // Get or create conversation
    let conversation = await Conversation.findOne({
      user: userId,
      isActive: true,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        user: userId,
        messages: [],
        context: {
          profileSnapshot: profile,
          currentStage: profile.currentStage,
          lastUpdated: new Date(),
        },
      });
    }

    // Add user message
    conversation.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Build context for AI
    const shortlists = await Shortlist.find({ user: userId });
    const locks = await Lock.find({ user: userId, isActive: true });

    const context = {
      profile,
      shortlists,
      locks,
      stage: profile.currentStage,
      conversationHistory: conversation.messages.slice(-10), // Last 10 messages
    };

    // Generate AI response
    const aiResponse = await generateResponse(message, context);

    // Add AI message
    conversation.messages.push({
      role: "assistant",
      content: aiResponse.message,
      timestamp: new Date(),
      actions: aiResponse.actions || [],
    });

    // Update context
    conversation.context.lastUpdated = new Date();
    await conversation.save();

    res.status(200).json({
      success: true,
      data: {
        message: aiResponse.message,
        actions: aiResponse.actions,
        conversationId: conversation._id,
      },
    });
  } catch (error) {
    console.error("AI Counsellor Error:", error);
    return next(
      new ErrorHandler(`AI Counsellor failed: ${error.message}`, 500),
    );
  }
};

// Get conversation history
export const getConversationHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { limit = 50 } = req.query;

    const conversation = await Conversation.findOne({
      user: userId,
      isActive: true,
    });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No conversation history found",
      });
    }

    // Return last N messages
    const messages = conversation.messages.slice(-parseInt(limit));

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to get conversation: ${error.message}`, 500),
    );
  }
};

// Get AI recommendations for universities
export const getAIRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const profile = await Profile.findOne({ user: userId });
    if (!profile || !profile.isOnboardingComplete) {
      return next(new ErrorHandler("Please complete your profile first", 400));
    }

    // Fetch universities matching basic criteria
    const universities = await University.find({
      country: { $in: profile.preferredCountries },
      "programs.degree": profile.intendedDegree,
      "cost.tuitionPerYear.min": { $lte: profile.budgetPerYear.max },
    }).limit(50);

    if (universities.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message:
          "No universities found matching your criteria. Try adjusting your preferences.",
      });
    }

    // Generate AI recommendations
    const recommendations = await generateUniversityRecommendations(
      profile,
      universities,
    );

    // Match recommendations with actual universities
    const enrichedRecommendations = recommendations
      .map((rec) => {
        const university = universities.find(
          (u) => u.name.toLowerCase() === rec.universityName.toLowerCase(),
        );
        return {
          ...rec,
          universityData: university,
        };
      })
      .filter((rec) => rec.universityData); // Only include matched universities

    res.status(200).json({
      success: true,
      data: enrichedRecommendations,
      count: enrichedRecommendations.length,
    });
  } catch (error) {
    console.error("Recommendation Error:", error);
    return next(
      new ErrorHandler(
        `Failed to generate recommendations: ${error.message}`,
        500,
      ),
    );
  }
};

// Get profile analysis from AI
export const getProfileAnalysis = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const profile = await Profile.findOne({ user: userId });
    if (!profile || !profile.isOnboardingComplete) {
      return next(new ErrorHandler("Please complete your profile first", 400));
    }

    const analysis = await analyzeProfile(profile);

    res.status(200).json({
      success: true,
      data: {
        analysis,
        profileStrength: profile.profileStrength,
      },
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Profile analysis failed: ${error.message}`, 500),
    );
  }
};

// Clear conversation history
export const clearConversation = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await Conversation.findOneAndUpdate(
      { user: userId, isActive: true },
      { isActive: false },
    );

    res.status(200).json({
      success: true,
      message: "Conversation cleared successfully",
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to clear conversation: ${error.message}`, 500),
    );
  }
};
