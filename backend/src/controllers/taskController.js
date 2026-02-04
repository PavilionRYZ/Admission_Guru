import Task from "../models/taskModel.js";
import Profile from "../models/profileModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create task
export const createTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const taskData = req.body;

    const task = await Task.create({
      ...taskData,
      user: userId,
      generatedBy: "User",
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to create task: ${error.message}`, 500),
    );
  }
};

// Get all tasks
export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status, category, priority, stage } = req.query;

    const query = { user: userId };
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (stage) query.stage = stage;

    const tasks = await Task.find(query)
      .populate("relatedUniversity")
      .populate("relatedLock")
      .sort({ priority: -1, dueDate: 1 });

    res.status(200).json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    return next(new ErrorHandler(`Failed to get tasks: ${error.message}`, 500));
  }
};

// Get task by ID
export const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: userId })
      .populate("relatedUniversity")
      .populate("relatedLock");

    if (!task) {
      return next(new ErrorHandler("Task not found", 404));
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return next(new ErrorHandler(`Failed to get task: ${error.message}`, 500));
  }
};

// Update task
export const updateTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findOne({ _id: id, user: userId });

    if (!task) {
      return next(new ErrorHandler("Task not found", 404));
    }

    Object.assign(task, updates);

    // Set completion timestamp
    if (updates.status === "Completed" && !task.completedAt) {
      task.completedAt = new Date();
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to update task: ${error.message}`, 500),
    );
  }
};

// Delete task
export const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: userId });

    if (!task) {
      return next(new ErrorHandler("Task not found", 404));
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to delete task: ${error.message}`, 500),
    );
  }
};

// Mark task as complete
export const completeTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: userId });

    if (!task) {
      return next(new ErrorHandler("Task not found", 404));
    }

    task.status = "Completed";
    task.completedAt = new Date();
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task marked as complete",
      data: task,
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to complete task: ${error.message}`, 500),
    );
  }
};

// Get task statistics
export const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const stats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const byPriority = await Task.aggregate([
      { $match: { user: userId, status: { $ne: "Completed" } } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Task.countDocuments({ user: userId });
    const overdue = await Task.countDocuments({
      user: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        overdue,
        byStatus: stats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byPriority: byPriority.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to get task stats: ${error.message}`, 500),
    );
  }
};
