import University from "../models/universityModel.js";
import Profile from "../models/profileModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { matchUniversitiesToProfile } from "../utils/universityMatcher.js";

// Get all universities with filters
export const getUniversities = async (req, res, next) => {
  try {
    const {
      country,
      minCost,
      maxCost,
      field,
      degree,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (country) query.country = country;
    if (field) query["programs.field"] = new RegExp(field, "i");
    if (degree) query["programs.degree"] = degree;
    if (minCost || maxCost) {
      query["cost.tuitionPerYear.min"] = {};
      if (minCost) query["cost.tuitionPerYear.min"].$gte = parseInt(minCost);
      if (maxCost)
        query["cost.tuitionPerYear.max"] = { $lte: parseInt(maxCost) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const universities = await University.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ "ranking.world": 1 });

    const total = await University.countDocuments(query);

    res.status(200).json({
      success: true,
      data: universities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to get universities: ${error.message}`, 500),
    );
  }
};

// Get university by ID
export const getUniversityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const university = await University.findById(id);

    if (!university) {
      return next(new ErrorHandler("University not found", 404));
    }

    res.status(200).json({
      success: true,
      data: university,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to get university: ${error.message}`, 500),
    );
  }
};

// Get matched universities based on user profile
export const getMatchedUniversities = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId });

    if (!profile || !profile.isOnboardingComplete) {
      return next(new ErrorHandler("Please complete your profile first", 400));
    }

    // Fetch universities matching profile criteria
    const query = {
      country: { $in: profile.preferredCountries },
      "programs.degree": profile.intendedDegree,
      "programs.field": new RegExp(profile.fieldOfStudy, "i"),
      "cost.tuitionPerYear.min": {
        $lte: profile.budgetPerYear.max,
      },
    };

    const universities = await University.find(query).limit(50);

    // Match and rank universities
    const matchedUniversities = matchUniversitiesToProfile(
      universities,
      profile,
    );

    res.status(200).json({
      success: true,
      data: matchedUniversities,
      count: matchedUniversities.length,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to match universities: ${error.message}`, 500),
    );
  }
};

// Search universities
export const searchUniversities = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return next(new ErrorHandler("Search query is required", 400));
    }

    const universities = await University.find({
      $or: [
        { name: new RegExp(query, "i") },
        { country: new RegExp(query, "i") },
        { city: new RegExp(query, "i") },
      ],
    }).limit(20);

    res.status(200).json({
      success: true,
      data: universities,
      count: universities.length,
    });
  } catch (error) {
    return next(new ErrorHandler(`Search failed: ${error.message}`, 500));
  }
};

// Get available countries
export const getCountries = async (req, res, next) => {
  try {
    const countries = await University.distinct("country");

    res.status(200).json({
      success: true,
      data: countries.sort(),
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to get countries: ${error.message}`, 500),
    );
  }
};
