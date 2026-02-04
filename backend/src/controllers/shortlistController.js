import Shortlist from "../models/shortlistModel.js";
import University from "../models/universityModel.js";
import Profile from "../models/profileModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Add university to shortlist
export const addToShortlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      universityId,
      program,
      category,
      acceptanceChance,
      fitReason,
      risks,
      costLevel,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !universityId ||
      !program ||
      !category ||
      !acceptanceChance ||
      !fitReason ||
      !costLevel
    ) {
      return next(new ErrorHandler("Missing required fields", 400));
    }

    // Check if university exists
    const university = await University.findById(universityId);
    if (!university) {
      return next(new ErrorHandler("University not found", 404));
    }

    // Check if already shortlisted
    const existing = await Shortlist.findOne({
      user: userId,
      university: universityId,
      program,
    });

    if (existing) {
      return next(new ErrorHandler("University already in shortlist", 400));
    }

    // Create shortlist entry
    const shortlist = await Shortlist.create({
      user: userId,
      university: universityId,
      program,
      category,
      acceptanceChance,
      fitReason,
      risks: risks || [],
      costLevel,
      notes,
      addedBy: "User",
    });

    const populatedShortlist = await Shortlist.findById(shortlist._id).populate(
      "university",
    );

    // Update profile stage if first shortlist
    const profile = await Profile.findOne({ user: userId });
    if (profile && profile.currentStage === "Discovering Universities") {
      profile.currentStage = "Finalizing Universities";
      await profile.save();
    }

    res.status(201).json({
      success: true,
      message: "University added to shortlist",
      data: populatedShortlist,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to add to shortlist: ${error.message}`, 500),
    );
  }
};

// Get user's shortlist
export const getShortlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { category } = req.query;

    const query = { user: userId };
    if (category) query.category = category;

    const shortlist = await Shortlist.find(query)
      .populate("university")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: shortlist,
      count: shortlist.length,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to get shortlist: ${error.message}`, 500),
    );
  }
};

// Remove from shortlist
export const removeFromShortlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const shortlist = await Shortlist.findOne({ _id: id, user: userId });

    if (!shortlist) {
      return next(new ErrorHandler("Shortlist entry not found", 404));
    }

    if (shortlist.isLocked) {
      return next(new ErrorHandler("Cannot remove locked university", 400));
    }

    await Shortlist.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "University removed from shortlist",
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        `Failed to remove from shortlist: ${error.message}`,
        500,
      ),
    );
  }
};

// Update shortlist entry
export const updateShortlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const updates = req.body;

    const shortlist = await Shortlist.findOne({ _id: id, user: userId });

    if (!shortlist) {
      return next(new ErrorHandler("Shortlist entry not found", 404));
    }

    Object.assign(shortlist, updates);
    await shortlist.save();

    const updated = await Shortlist.findById(id).populate("university");

    res.status(200).json({
      success: true,
      message: "Shortlist updated",
      data: updated,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to update shortlist: ${error.message}`, 500),
    );
  }
};

// Get shortlist statistics
export const getShortlistStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const total = await Shortlist.countDocuments({ user: userId });
    const byCategory = await Shortlist.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const locked = await Shortlist.countDocuments({
      user: userId,
      isLocked: true,
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        locked,
        byCategory: byCategory.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    return next(new ErrorHandler(`Failed to get stats: ${error.message}`, 500));
  }
};
